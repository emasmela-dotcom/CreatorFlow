import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { canMakeAICall, logAICall } from '@/lib/usageTracking'

/**
 * Engagement Analyzer Bot - Analyzes post performance
 * FREE for all users, performance scales with plan tier
 */

interface EngagementAnalysis {
  averageEngagement: number
  bestPerformingPost: {
    id: string
    content: string
    engagement: number
    date: string
  }
  trends: {
    bestDays: string[]
    bestTimes: string[]
    bestHashtags: string[]
    bestContentTypes: string[]
  }
  insights: string[]
  recommendations: string[]
}

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

async function analyzeUserPosts(userId: string, platform: string): Promise<EngagementAnalysis> {
  // Get all published posts with engagement metrics
  const postsResult = await db.execute({
    sql: `SELECT * FROM content_posts 
          WHERE user_id = ? AND platform = ? 
          AND status = 'published'
          AND engagement_metrics IS NOT NULL
          ORDER BY published_at DESC LIMIT 50`,
    args: [userId, platform]
  })

  const posts = postsResult.rows as any[]
  
  if (posts.length === 0) {
    return {
      averageEngagement: 0,
      bestPerformingPost: {
        id: '',
        content: '',
        engagement: 0,
        date: ''
      },
      trends: {
        bestDays: [],
        bestTimes: [],
        bestHashtags: [],
        bestContentTypes: []
      },
      insights: [
        'No published posts found. Start posting to get engagement insights!'
      ],
      recommendations: [
        'Create and publish your first post to see engagement analysis',
        'Post consistently to build engagement data'
      ]
    }
  }

  // Calculate average engagement
  let totalEngagement = 0
  const engagementByDay: Record<string, number> = {}
  const engagementByHour: Record<number, number> = {}
  const hashtagPerformance: Record<string, number> = {}
  
  let bestPost = posts[0]
  let bestEngagement = 0

  posts.forEach((post: any) => {
    const metrics = typeof post.engagement_metrics === 'string'
      ? JSON.parse(post.engagement_metrics)
      : post.engagement_metrics

    const engagement = (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0)
    totalEngagement += engagement

    if (engagement > bestEngagement) {
      bestEngagement = engagement
      bestPost = post
    }

    // Analyze by day
    if (post.published_at) {
      const date = new Date(post.published_at)
      const day = date.toLocaleDateString('en-US', { weekday: 'long' })
      engagementByDay[day] = (engagementByDay[day] || 0) + engagement

      // Analyze by hour
      const hour = date.getHours()
      engagementByHour[hour] = (engagementByHour[hour] || 0) + engagement
    }

    // Extract hashtags from content
    const hashtags = post.content.match(/#\w+/g) || []
    hashtags.forEach((tag: string) => {
      hashtagPerformance[tag] = (hashtagPerformance[tag] || 0) + engagement
    })
  })

  const averageEngagement = totalEngagement / posts.length

  // Find best performing patterns
  const bestDays = Object.entries(engagementByDay)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([day]) => day)

  const bestTimes = Object.entries(engagementByHour)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hour]) => `${hour}:00`)

  const bestHashtags = Object.entries(hashtagPerformance)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag)

  // Generate insights
  const insights: string[] = []
  if (bestDays.length > 0) {
    insights.push(`${bestDays[0]} is your best performing day`)
  }
  if (bestTimes.length > 0) {
    insights.push(`Posts at ${bestTimes[0]} get the most engagement`)
  }
  if (bestHashtags.length > 0) {
    insights.push(`${bestHashtags[0]} is your top performing hashtag`)
  }

  // Generate recommendations
  const recommendations: string[] = []
  if (averageEngagement < 10) {
    recommendations.push('Focus on creating more engaging content')
    recommendations.push('Post during your best times for better results')
  } else {
    recommendations.push('Continue posting at your best times')
    recommendations.push('Use your top performing hashtags more often')
  }

  const bestPostMetrics = typeof bestPost.engagement_metrics === 'string'
    ? JSON.parse(bestPost.engagement_metrics)
    : bestPost.engagement_metrics

  const bestPostEngagement = (bestPostMetrics.likes || 0) + 
                            (bestPostMetrics.comments || 0) + 
                            (bestPostMetrics.shares || 0)

  return {
    averageEngagement: Math.round(averageEngagement),
    bestPerformingPost: {
      id: bestPost.id,
      content: bestPost.content.substring(0, 100) + '...',
      engagement: bestPostEngagement,
      date: bestPost.published_at || ''
    },
    trends: {
      bestDays,
      bestTimes,
      bestHashtags,
      bestContentTypes: []
    },
    insights,
    recommendations
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { platform } = body

    if (!platform) {
      return NextResponse.json({ error: 'Platform is required' }, { status: 400 })
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

    const tier = await getUserPlanTier(user.userId)
    const analysis = await analyzeUserPosts(user.userId, platform)

    // Log the AI call
    await logAICall(user.userId, 'Engagement Analyzer', '/api/bots/engagement-analyzer')

    return NextResponse.json({
      success: true,
      analysis,
      tier,
      usage: {
        aiCallsUsed: limitCheck.current + 1,
        aiCallsLimit: limitCheck.limit
      }
    })
  } catch (error: any) {
    console.error('Engagement Analyzer Bot error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to analyze engagement'
    }, { status: 500 })
  }
}

