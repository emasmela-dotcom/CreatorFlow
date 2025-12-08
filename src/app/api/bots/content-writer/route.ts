import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { canMakeAICall, logAICall } from '@/lib/usageTracking'

/**
 * Content Writer Bot - AI-powered content generation
 * Available for all tiers
 * Note: This complements the existing Content Assistant Bot
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
 * POST - Generate content
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check AI call limit
    const limitCheck = await canMakeAICall(user.userId)
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: limitCheck.message || 'AI call limit exceeded',
        current: limitCheck.current,
        limit: limitCheck.limit,
        upgradeRequired: true
      }, { status: 403 })
    }

    // All tiers can use Content Writer Bot
    const tier = await getUserPlanTier(user.userId)

    const body = await request.json()
    const { topic, type, tone, length, platform, keywords } = body

    if (!topic || !type) {
      return NextResponse.json({ 
        error: 'Topic and type are required' 
      }, { status: 400 })
    }

    // Generate content (simplified - in production, use AI)
    const content = `[Generated content about: ${topic}]\n\nThis is a ${type} piece with a ${tone || 'professional'} tone. ${length ? `Approximately ${length} words.` : ''}${platform ? ` Optimized for ${platform}.` : ''}${keywords ? ` Keywords: ${keywords.join(', ')}` : ''}`

    // Ensure table exists (fallback)
    try {
      // Try to add missing columns if table exists
      try {
        await db.execute({ sql: `ALTER TABLE generated_content ADD COLUMN IF NOT EXISTS type VARCHAR(50)` })
      } catch (e) {}
      try {
        await db.execute({ sql: `ALTER TABLE generated_content ADD COLUMN IF NOT EXISTS content_type VARCHAR(50)` })
      } catch (e) {}
      try {
        await db.execute({ sql: `ALTER TABLE generated_content ADD COLUMN IF NOT EXISTS length INTEGER` })
      } catch (e) {}
      try {
        await db.execute({ sql: `ALTER TABLE generated_content ADD COLUMN IF NOT EXISTS platform VARCHAR(50)` })
      } catch (e) {}
      try {
        await db.execute({ sql: `ALTER TABLE generated_content ADD COLUMN IF NOT EXISTS keywords TEXT` })
      } catch (e) {}
      
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS generated_content (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        topic TEXT NOT NULL,
        type VARCHAR(50),
        content_type VARCHAR(50) DEFAULT 'blog-post',
        tone VARCHAR(50),
        length INTEGER,
        platform VARCHAR(50),
        keywords TEXT,
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
    } catch (e) {}

    // Save generated content
    const result = await db.execute({
      sql: `
        INSERT INTO generated_content (
          user_id, topic, type, content_type, tone, length, platform, keywords, content, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        RETURNING *
      `,
      args: [
        user.userId,
        topic,
        type,
        type || 'blog-post', // content_type defaults to type
        tone || 'professional',
        length || null,
        platform || null,
        JSON.stringify(keywords || []),
        content
      ]
    })

    // Log the AI call
    await logAICall(user.userId, 'Content Writer', '/api/bots/content-writer')

    return NextResponse.json({
      success: true,
      content: result.rows[0],
      tier,
      usage: {
        aiCallsUsed: limitCheck.current + 1,
        aiCallsLimit: limitCheck.limit
      }
    })
  } catch (error: any) {
    console.error('Content Writer Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to generate content' 
    }, { status: 500 })
  }
}

