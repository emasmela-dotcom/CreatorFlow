import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

/**
 * Customer Service Bot - AI-powered customer support
 * Available for all tiers
 */

async function getUserPlanTier(userId: string): Promise<string> {
  try {
    const userResult = await db.execute({
      sql: 'SELECT subscription_tier FROM users WHERE id = ?',
      args: [userId]
    })
    if (userResult.rows.length === 0) return 'starter'
    const tier = (userResult.rows[0] as any).subscription_tier
    return tier || 'starter'
  } catch (error) {
    return 'starter'
  }
}

/**
 * POST - Handle customer chat message
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // All tiers can use Customer Service Bot
    const tier = await getUserPlanTier(user.userId)

    const body = await request.json()
    const { message, conversationId, customerName, customerEmail } = body

    if (!message) {
      return NextResponse.json({ 
        error: 'Message is required' 
      }, { status: 400 })
    }

    // Generate conversation ID if not provided
    const convId = conversationId || `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Ensure tables exist (fallback)
    try {
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS customer_conversations (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        conversation_id VARCHAR(255) UNIQUE NOT NULL,
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS customer_messages (
        id SERIAL PRIMARY KEY,
        conversation_id VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS customer_knowledge_base (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category VARCHAR(100),
        keywords TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
    } catch (e) {}

    // Get or create conversation
    let conversationResult = await db.execute({
      sql: 'SELECT * FROM customer_conversations WHERE conversation_id = ? AND user_id = ?',
      args: [convId, user.userId]
    })

    if (conversationResult.rows.length === 0) {
      await db.execute({
        sql: `
          INSERT INTO customer_conversations (
            user_id, conversation_id, customer_name, customer_email, status
          )
          VALUES (?, ?, ?, ?, 'active')
        `,
        args: [user.userId, convId, customerName || 'Anonymous', customerEmail || null]
      })
    }

    // Save user message
    await db.execute({
      sql: `
        INSERT INTO customer_messages (conversation_id, role, content)
        VALUES (?, 'user', ?)
      `,
      args: [convId, message]
    })

    // Get conversation history
    const historyResult = await db.execute({
      sql: `
        SELECT role, content FROM customer_messages
        WHERE conversation_id = ?
        ORDER BY created_at ASC
        LIMIT 20
      `,
      args: [convId]
    })

    // Get knowledge base entries
    const keywords = message.toLowerCase().split(' ').filter((w: string) => w.length > 3)
    let knowledgeContext = ''

    if (keywords.length > 0) {
      // Build keyword search (PostgreSQL doesn't support && with parameterized arrays easily)
      const keywordPattern = keywords.map((k: string) => `%${k}%`).join(' OR ')
      const knowledgeResult = await db.execute({
        sql: `
          SELECT question, answer, category
          FROM customer_knowledge_base
          WHERE user_id = ? AND is_active = true
          AND (
            LOWER(keywords) LIKE ANY(ARRAY[${keywords.map(() => '?').join(',')}])
            OR LOWER(question) LIKE ?
          )
          LIMIT 3
        `,
        args: [user.userId, ...keywords, `%${message.toLowerCase()}%`]
      })

      if (knowledgeResult.rows.length > 0) {
        knowledgeContext = '\n\nRelevant knowledge:\n' + 
          knowledgeResult.rows.map((k: any) => `Q: ${k.question}\nA: ${k.answer}`).join('\n\n')
      }
    }

    // Generate AI response (simplified - in production, use OpenAI)
    const botResponse = `Thank you for your message: "${message}". Our team will get back to you soon.${knowledgeContext ? '\n\n' + knowledgeContext : ''}`

    // Save bot response
    await db.execute({
      sql: `
        INSERT INTO customer_messages (conversation_id, role, content)
        VALUES (?, 'assistant', ?)
      `,
      args: [convId, botResponse]
    })

    return NextResponse.json({
      success: true,
      conversationId: convId,
      response: botResponse,
      tier
    })
  } catch (error: any) {
    console.error('Customer Service Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to process message' 
    }, { status: 500 })
  }
}

/**
 * GET - Get conversations
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tier = await getUserPlanTier(user.userId)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    let sqlQuery = 'SELECT * FROM customer_conversations WHERE user_id = ?'
    const args: any[] = [user.userId]

    if (status) {
      sqlQuery += ' AND status = ?'
      args.push(status)
    }

    sqlQuery += ' ORDER BY created_at DESC LIMIT ?'
    args.push(limit)

    const result = await db.execute({ sql: sqlQuery, args })

    return NextResponse.json({
      success: true,
      conversations: result.rows,
      tier
    })
  } catch (error: any) {
    console.error('Customer Service Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch conversations' 
    }, { status: 500 })
  }
}

