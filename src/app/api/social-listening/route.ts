import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import {
  addListeningRule,
  getListeningRules,
  saveMention,
  getMentions,
  getListeningStats,
  analyzeSentiment
} from '@/lib/socialListening'

export const dynamic = 'force-dynamic'

/**
 * Social Listening API
 * Track mentions, hashtags, competitors, and sentiment
 */

/**
 * POST - Add listening rule or save mention
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    if (action === 'add-rule') {
      // Add a new listening rule
      const { name, platform, type, query } = body

      if (!name || !platform || !type || !query) {
        return NextResponse.json({
          error: 'Name, platform, type, and query are required'
        }, { status: 400 })
      }

      const rule = await addListeningRule(user.userId, {
        name,
        platform,
        type: type as 'username' | 'hashtag' | 'keyword' | 'competitor',
        query,
        isActive: true
      })

      return NextResponse.json({
        success: true,
        rule
      })
    } else if (action === 'save-mention') {
      // Save a mention (typically from API webhook or manual entry)
      const { platform, mentionType, query, content, authorName, authorHandle, postUrl, engagementCount } = body

      if (!platform || !mentionType || !query || !content) {
        return NextResponse.json({
          error: 'Platform, mentionType, query, and content are required'
        }, { status: 400 })
      }

      // Analyze sentiment
      const sentiment = analyzeSentiment(content)

      const mention = await saveMention({
        userId: user.userId,
        platform,
        mentionType: mentionType as 'username' | 'hashtag' | 'keyword' | 'competitor',
        query,
        content,
        authorName,
        authorHandle,
        postUrl,
        sentiment,
        engagementCount
      })

      return NextResponse.json({
        success: true,
        mention
      })
    } else {
      return NextResponse.json({
        error: 'Invalid action. Use "add-rule" or "save-mention"'
      }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Social Listening POST error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to process request'
    }, { status: 500 })
  }
}

/**
 * GET - Get listening rules, mentions, or statistics
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'rules', 'mentions', 'stats'

    if (type === 'rules') {
      const rules = await getListeningRules(user.userId)
      return NextResponse.json({
        success: true,
        rules
      })
    } else if (type === 'mentions') {
      const filters: any = {}
      const platform = searchParams.get('platform')
      const mentionType = searchParams.get('mentionType')
      const query = searchParams.get('query')
      const sentiment = searchParams.get('sentiment')
      const limit = parseInt(searchParams.get('limit') || '100')

      if (platform) filters.platform = platform
      if (mentionType) filters.mentionType = mentionType
      if (query) filters.query = query
      if (sentiment) filters.sentiment = sentiment
      filters.limit = limit

      const mentions = await getMentions(user.userId, filters)
      return NextResponse.json({
        success: true,
        mentions
      })
    } else if (type === 'stats') {
      const days = parseInt(searchParams.get('days') || '30')
      const stats = await getListeningStats(user.userId, days)
      return NextResponse.json({
        success: true,
        stats
      })
    } else {
      // Default: return rules
      const rules = await getListeningRules(user.userId)
      return NextResponse.json({
        success: true,
        rules
      })
    }
  } catch (error: any) {
    console.error('Social Listening GET error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to get data'
    }, { status: 500 })
  }
}

/**
 * DELETE - Delete a listening rule
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const ruleId = searchParams.get('ruleId')

    if (!ruleId) {
      return NextResponse.json({
        error: 'ruleId is required'
      }, { status: 400 })
    }

    const { db } = await import('@/lib/db')
    await db.execute({
      sql: `
        UPDATE social_listening_rules
        SET is_active = FALSE
        WHERE id = ? AND user_id = ?
      `,
      args: [ruleId, user.userId]
    })

    return NextResponse.json({
      success: true,
      message: 'Listening rule deleted'
    })
  } catch (error: any) {
    console.error('Social Listening DELETE error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to delete rule'
    }, { status: 500 })
  }
}

