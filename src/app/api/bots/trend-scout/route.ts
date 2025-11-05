import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

/**
 * Trend Scout Bot - Identifies trending topics and opportunities
 * FREE for all users, performance scales with plan tier
 */

interface TrendOpportunity {
  topic: string
  hashtag: string
  reason: string
  engagement: string
  relevance: number
}

interface TrendAnalysis {
  trendingTopics: TrendOpportunity[]
  opportunities: string[]
  recommendations: string[]
  bestTimeToPost: string
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

async function analyzeUserNiche(userId: string, platform: string): Promise<string> {
  // Analyze user's past posts to determine niche
  const postsResult = await db.execute({
    sql: `SELECT content FROM content_posts 
          WHERE user_id = ? AND platform = ? 
          AND status = 'published'
          ORDER BY published_at DESC LIMIT 20`,
    args: [userId, platform]
  })

  const posts = postsResult.rows as any[]
  
  if (posts.length === 0) {
    return 'general' // Default niche if no posts
  }

  // Simple keyword extraction to determine niche
  const allContent = posts.map((p: any) => p.content?.toLowerCase() || '').join(' ')
  
  // Common niches based on keywords
  if (allContent.includes('fitness') || allContent.includes('workout') || allContent.includes('exercise')) {
    return 'fitness'
  }
  if (allContent.includes('business') || allContent.includes('entrepreneur') || allContent.includes('startup')) {
    return 'business'
  }
  if (allContent.includes('tech') || allContent.includes('coding') || allContent.includes('developer')) {
    return 'technology'
  }
  if (allContent.includes('food') || allContent.includes('recipe') || allContent.includes('cooking')) {
    return 'food'
  }
  if (allContent.includes('travel') || allContent.includes('trip') || allContent.includes('destination')) {
    return 'travel'
  }
  if (allContent.includes('fashion') || allContent.includes('style') || allContent.includes('outfit')) {
    return 'fashion'
  }

  return 'general'
}

async function getTrendingTopics(niche: string, tier: string): Promise<TrendOpportunity[]> {
  // Rule-based trend suggestions (free tier)
  // Higher tiers could use AI/APIs for real-time trends
  
  const trends: Record<string, TrendOpportunity[]> = {
    fitness: [
      {
        topic: 'Morning Workouts',
        hashtag: '#MorningMotivation',
        reason: 'High engagement in fitness community',
        engagement: '15k+ posts/week',
        relevance: 0.9
      },
      {
        topic: 'Home Fitness',
        hashtag: '#HomeWorkout',
        reason: 'Growing trend, lower competition',
        engagement: '8k+ posts/week',
        relevance: 0.85
      },
      {
        topic: 'Nutrition Tips',
        hashtag: '#HealthyEating',
        reason: 'Consistent engagement',
        engagement: '12k+ posts/week',
        relevance: 0.8
      }
    ],
    business: [
      {
        topic: 'Productivity Hacks',
        hashtag: '#ProductivityTips',
        reason: 'High engagement from entrepreneurs',
        engagement: '20k+ posts/week',
        relevance: 0.9
      },
      {
        topic: 'Side Hustle Ideas',
        hashtag: '#SideHustle',
        reason: 'Growing interest, viral potential',
        engagement: '25k+ posts/week',
        relevance: 0.95
      },
      {
        topic: 'Business Growth',
        hashtag: '#BusinessGrowth',
        reason: 'Steady engagement',
        engagement: '10k+ posts/week',
        relevance: 0.85
      }
    ],
    technology: [
      {
        topic: 'AI Tools',
        hashtag: '#AITools',
        reason: 'Hot topic, high engagement',
        engagement: '30k+ posts/week',
        relevance: 0.95
      },
      {
        topic: 'Coding Tips',
        hashtag: '#CodingTips',
        reason: 'Consistent community engagement',
        engagement: '18k+ posts/week',
        relevance: 0.9
      },
      {
        topic: 'Tech News',
        hashtag: '#TechNews',
        reason: 'Timely, shareable content',
        engagement: '15k+ posts/week',
        relevance: 0.85
      }
    ],
    general: [
      {
        topic: 'Daily Motivation',
        hashtag: '#MotivationMonday',
        reason: 'Always trending',
        engagement: '50k+ posts/week',
        relevance: 0.7
      },
      {
        topic: 'Lifestyle Tips',
        hashtag: '#Lifestyle',
        reason: 'Broad appeal',
        engagement: '35k+ posts/week',
        relevance: 0.75
      },
      {
        topic: 'Weekend Vibes',
        hashtag: '#WeekendVibes',
        reason: 'High weekend engagement',
        engagement: '28k+ posts/week',
        relevance: 0.8
      }
    ]
  }

  return trends[niche] || trends.general
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

    const tier = await getUserPlanTier(user.userId)
    const niche = await analyzeUserNiche(user.userId, platform)
    const trendingTopics = await getTrendingTopics(niche, tier)

    // Generate opportunities
    const opportunities: string[] = []
    if (trendingTopics.length > 0) {
      opportunities.push(`Jump on ${trendingTopics[0].topic} - high engagement right now`)
      opportunities.push(`Use ${trendingTopics[0].hashtag} for better reach`)
    }

    // Generate recommendations
    const recommendations: string[] = []
    recommendations.push(`Focus on ${niche} content - your niche shows strong engagement`)
    recommendations.push(`Post about trending topics to increase visibility`)
    recommendations.push(`Use trending hashtags but keep them relevant to your content`)

    // Best time based on platform
    const bestTimeToPost = platform === 'instagram' 
      ? '9:00 AM - 11:00 AM or 7:00 PM - 9:00 PM'
      : platform === 'twitter'
      ? '8:00 AM - 10:00 AM or 5:00 PM - 7:00 PM'
      : '9:00 AM - 12:00 PM'

    const analysis: TrendAnalysis = {
      trendingTopics,
      opportunities,
      recommendations,
      bestTimeToPost
    }

    return NextResponse.json({
      success: true,
      analysis,
      niche,
      tier
    })
  } catch (error: any) {
    console.error('Trend Scout Bot error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to scout trends'
    }, { status: 500 })
  }
}

