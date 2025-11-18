import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

/**
 * Social Media Manager Bot - Advanced social media management
 * Available for all tiers
 * Note: This complements CreatorFlow's existing social features
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
 * POST - Create social media post
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // All tiers can use Social Media Manager Bot
    const tier = await getUserPlanTier(user.userId)

    const body = await request.json()
    const { platform, content, mediaUrls, scheduledAt, hashtags } = body

    if (!platform || !content) {
      return NextResponse.json({ 
        error: 'Platform and content are required' 
      }, { status: 400 })
    }

    // Ensure table exists (fallback)
    try {
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS social_media_posts (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        platform VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        media_urls TEXT,
        scheduled_at TIMESTAMP,
        hashtags TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
    } catch (e) {}

    // Create post
    const result = await db.execute({
      sql: `
        INSERT INTO social_media_posts (
          user_id, platform, content, media_urls, scheduled_at,
          hashtags, status, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, 'draft', NOW())
        RETURNING *
      `,
      args: [
        user.userId,
        platform,
        content,
        JSON.stringify(mediaUrls || []),
        scheduledAt || null,
        JSON.stringify(hashtags || [])
      ]
    })

    return NextResponse.json({
      success: true,
      post: result.rows[0],
      tier
    })
  } catch (error: any) {
    console.error('Social Media Manager Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create post' 
    }, { status: 500 })
  }
}

/**
 * GET - List social media posts
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tier = await getUserPlanTier(user.userId)

    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    let sqlQuery = 'SELECT * FROM social_media_posts WHERE user_id = ?'
    const args: any[] = [user.userId]

    if (platform) {
      sqlQuery += ' AND platform = ?'
      args.push(platform)
    }
    if (status) {
      sqlQuery += ' AND status = ?'
      args.push(status)
    }

    sqlQuery += ' ORDER BY created_at DESC LIMIT ?'
    args.push(limit)

    const result = await db.execute({ sql: sqlQuery, args })

    return NextResponse.json({
      success: true,
      posts: result.rows,
      tier
    })
  } catch (error: any) {
    console.error('Social Media Manager Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch posts' 
    }, { status: 500 })
  }
}

