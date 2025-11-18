import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

/**
 * Website Chat Bot - Live chat widget for websites
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
 * POST - Handle website chat message
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // All tiers can use Website Chat Bot
    const tier = await getUserPlanTier(user.userId)

    const body = await request.json()
    const {
      message,
      sessionId,
      visitorName,
      visitorEmail,
      visitorPhone,
      pageUrl,
      userAgent
    } = body

    if (!message) {
      return NextResponse.json({ 
        error: 'Message is required' 
      }, { status: 400 })
    }

    // Generate session ID if not provided
    const sessId = sessionId || `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Ensure tables exist (fallback)
    try {
      // Try to add missing column if table exists
      try {
        await db.execute({ sql: `ALTER TABLE website_chat_conversations ADD COLUMN IF NOT EXISTS user_agent TEXT` })
      } catch (e) {}
      
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS website_chat_conversations (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        visitor_name VARCHAR(255),
        visitor_email VARCHAR(255),
        visitor_phone VARCHAR(50),
        page_url TEXT,
        user_agent TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS website_chat_messages (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
    } catch (e) {}

    // Get or create conversation
    let conversationResult = await db.execute({
      sql: 'SELECT * FROM website_chat_conversations WHERE session_id = ? AND user_id = ?',
      args: [sessId, user.userId]
    })

    if (conversationResult.rows.length === 0) {
      await db.execute({
        sql: `
          INSERT INTO website_chat_conversations (
            user_id, session_id, visitor_name, visitor_email, visitor_phone,
            page_url, user_agent, status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
        `,
        args: [
          user.userId,
          sessId,
          visitorName || null,
          visitorEmail || null,
          visitorPhone || null,
          pageUrl || null,
          userAgent || null
        ]
      })
    }

    // Save user message
    await db.execute({
      sql: `
        INSERT INTO website_chat_messages (session_id, role, content)
        VALUES (?, 'user', ?)
      `,
      args: [sessId, message]
    })

    // Get conversation history
    const historyResult = await db.execute({
      sql: `
        SELECT role, content FROM website_chat_messages
        WHERE session_id = ?
        ORDER BY created_at ASC
        LIMIT 20
      `,
      args: [sessId]
    })

    // Get bot settings (create table if needed)
    let settings: Record<string, string> = {}
    try {
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS website_chat_settings (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        setting_key VARCHAR(100) NOT NULL,
        setting_value TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, setting_key)
      )` })
      
      const settingsResult = await db.execute({
        sql: 'SELECT setting_key, setting_value FROM website_chat_settings WHERE user_id = ?',
        args: [user.userId]
      })
      settingsResult.rows.forEach((row: any) => {
        settings[row.setting_key] = row.setting_value
      })
    } catch (e) {
      // Use defaults if settings table doesn't exist
    }

    // Generate bot response (simplified - in production, use AI)
    const greeting = settings.greeting_message || 'Hello! How can I help you today?'
    const botResponse = message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')
      ? greeting
      : `Thank you for your message: "${message}". Our team will get back to you soon.`

    // Save bot response
    await db.execute({
      sql: `
        INSERT INTO website_chat_messages (session_id, role, content)
        VALUES (?, 'assistant', ?)
      `,
      args: [sessId, botResponse]
    })

    return NextResponse.json({
      success: true,
      sessionId: sessId,
      response: botResponse,
      tier
    })
  } catch (error: any) {
    console.error('Website Chat Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to process message' 
    }, { status: 500 })
  }
}

/**
 * GET - Get chat conversations
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

    let sqlQuery = 'SELECT * FROM website_chat_conversations WHERE user_id = ?'
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
    console.error('Website Chat Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch conversations' 
    }, { status: 500 })
  }
}

