import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

/**
 * Analytics Coach Bot - Provides personalized growth insights and strategies
 * FREE for all users, performance scales with plan tier
 */

interface GrowthInsight {
  metric: string
  value: number | string
  trend: 'up' | 'down' | 'stable'
  explanation: string
  action: string
}

interface StrategyRecommendation {
  area: string
  current: string
  target: string
  strategy: string
  timeframe: string
}

interface CoachAnalysis {
  insights: GrowthInsight[]
  strategies: StrategyRecommendation[]
  predictions: string[]
  recommendations: string[]
  growthScore: number
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

async function analyzeUserMetrics(userId: string, platform: string): Promise<{
  totalPosts: number
  averageEngagement: number
  bestEngagement: number
  engagementRate: number
  postingFrequency: number
}> {
  const postsResult = await db.execute({
    sql: `SELECT * FROM content_posts 
          WHERE user_id = ? AND platform = ? 
          AND status = 'published'
          ORDER BY published_at DESC`,
    args: [userId, platform]
  })

  const posts = postsResult.rows as any[]
  
  if (posts.length === 0) {
    return {
      totalPosts: 0,
      averageEngagement: 0,
      bestEngagement: 0,
      engagementRate: 0,
      postingFrequency: 0
    }
  }

  let totalEngagement = 0
  let bestEngagement = 0
  let totalReach = 0

  posts.forEach((post: any) => {
    const metrics = typeof post.engagement_metrics === 'string'
      ? JSON.parse(post.engagement_metrics)
      : post.engagement_metrics

    const engagement = (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0)
    totalEngagement += engagement
    
    if (engagement > bestEngagement) {
      bestEngagement = engagement
    }

    totalReach += metrics.reach || metrics.impressions || 0
  })

  const averageEngagement = totalEngagement / posts.length
  const engagementRate = totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0

  // Calculate posting frequency (posts per week)
  if (posts.length > 1) {
    const firstPost = new Date(posts[posts.length - 1].published_at)
    const lastPost = new Date(posts[0].published_at)
    const weeks = (lastPost.getTime() - firstPost.getTime()) / (1000 * 60 * 60 * 24 * 7)
    const postingFrequency = weeks > 0 ? posts.length / weeks : 0
    return {
      totalPosts: posts.length,
      averageEngagement: Math.round(averageEngagement),
      bestEngagement,
      engagementRate: Math.round(engagementRate * 100) / 100,
      postingFrequency: Math.round(postingFrequency * 10) / 10
    }
  }

  return {
    totalPosts: posts.length,
    averageEngagement: Math.round(averageEngagement),
    bestEngagement,
    engagementRate: Math.round(engagementRate * 100) / 100,
    postingFrequency: 0
  }
}

async function generateInsights(
  metrics: ReturnType<typeof analyzeUserMetrics> extends Promise<infer T> ? T : never,
  tier: string
): Promise<GrowthInsight[]> {
  const insights: GrowthInsight[] = []

  // Engagement Rate Insight
  if (metrics.engagementRate > 0) {
    const trend = metrics.engagementRate > 3 ? 'up' : metrics.engagementRate < 1 ? 'down' : 'stable'
    insights.push({
      metric: 'Engagement Rate',
      value: `${metrics.engagementRate}%`,
      trend,
      explanation: trend === 'up' 
        ? 'Your engagement rate is strong!'
        : trend === 'down'
        ? 'Your engagement rate needs improvement'
        : 'Your engagement rate is average',
      action: trend === 'down' 
        ? 'Focus on creating more engaging content'
        : 'Keep up the great work!'
    })
  }

  // Posting Frequency Insight
  if (metrics.postingFrequency > 0) {
    const optimal = 3 // 3 posts per week is optimal
    const trend = metrics.postingFrequency >= optimal ? 'up' : 'down'
    insights.push({
      metric: 'Posting Frequency',
      value: `${metrics.postingFrequency} posts/week`,
      trend,
      explanation: trend === 'up'
        ? 'You\'re posting consistently!'
        : 'You could benefit from posting more frequently',
      action: trend === 'down'
        ? `Aim for ${optimal} posts per week for better growth`
        : 'Maintain this consistency'
    })
  }

  // Average Engagement Insight
  if (metrics.averageEngagement > 0) {
    const trend = metrics.averageEngagement > 50 ? 'up' : metrics.averageEngagement < 10 ? 'down' : 'stable'
    insights.push({
      metric: 'Average Engagement',
      value: metrics.averageEngagement,
      trend,
      explanation: trend === 'up'
        ? 'Your content is resonating well!'
        : trend === 'down'
        ? 'Your content needs more engagement'
        : 'Your engagement is growing steadily',
      action: trend === 'down'
        ? 'Experiment with different content types'
        : 'Continue creating similar content'
    })
  }

  return insights
}

async function generateStrategies(
  metrics: ReturnType<typeof analyzeUserMetrics> extends Promise<infer T> ? T : never,
  tier: string
): Promise<StrategyRecommendation[]> {
  const strategies: StrategyRecommendation[] = []

  // Engagement Strategy
  if (metrics.engagementRate < 2) {
    strategies.push({
      area: 'Engagement Rate',
      current: `${metrics.engagementRate}%`,
      target: '3-5%',
      strategy: 'Post during peak hours, use relevant hashtags, ask questions in captions',
      timeframe: '2-4 weeks'
    })
  }

  // Posting Frequency Strategy
  if (metrics.postingFrequency < 3) {
    strategies.push({
      area: 'Posting Frequency',
      current: `${metrics.postingFrequency} posts/week`,
      target: '3-5 posts/week',
      strategy: 'Create a content calendar, batch create content, schedule posts in advance',
      timeframe: '1-2 weeks'
    })
  }

  // Content Quality Strategy
  if (metrics.averageEngagement < 20) {
    strategies.push({
      area: 'Content Quality',
      current: `${metrics.averageEngagement} avg engagement`,
      target: '50+ avg engagement',
      strategy: 'Focus on value-driven content, use engaging visuals, optimize posting times',
      timeframe: '4-6 weeks'
    })
  }

  return strategies
}

function calculateGrowthScore(metrics: ReturnType<typeof analyzeUserMetrics> extends Promise<infer T> ? T : never): number {
  let score = 50 // Base score

  // Engagement rate contribution (0-30 points)
  if (metrics.engagementRate >= 3) score += 30
  else if (metrics.engagementRate >= 2) score += 20
  else if (metrics.engagementRate >= 1) score += 10

  // Posting frequency contribution (0-20 points)
  if (metrics.postingFrequency >= 3) score += 20
  else if (metrics.postingFrequency >= 2) score += 10
  else if (metrics.postingFrequency >= 1) score += 5

  // Average engagement contribution (0-20 points)
  if (metrics.averageEngagement >= 50) score += 20
  else if (metrics.averageEngagement >= 20) score += 10
  else if (metrics.averageEngagement >= 10) score += 5

  return Math.min(100, Math.max(0, score))
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
    const metrics = await analyzeUserMetrics(user.userId, platform)
    const insights = await generateInsights(metrics, tier)
    const strategies = await generateStrategies(metrics, tier)
    const growthScore = calculateGrowthScore(metrics)

    // Generate predictions
    const predictions: string[] = []
    if (metrics.postingFrequency >= 3 && metrics.engagementRate > 2) {
      predictions.push('With current momentum, you could see 20% growth in 30 days')
    } else if (metrics.postingFrequency < 2) {
      predictions.push('Increasing posting frequency to 3x/week could boost engagement by 40%')
    } else {
      predictions.push('Optimizing posting times could improve engagement by 25%')
    }

    // Generate recommendations
    const recommendations: string[] = []
    if (metrics.engagementRate < 2) {
      recommendations.push('Focus on improving engagement rate first')
    }
    if (metrics.postingFrequency < 3) {
      recommendations.push('Post more consistently for better results')
    }
    if (metrics.averageEngagement < 20) {
      recommendations.push('Experiment with different content formats')
    }
    recommendations.push('Track your metrics weekly to measure progress')

    const analysis: CoachAnalysis = {
      insights,
      strategies,
      predictions,
      recommendations,
      growthScore
    }

    return NextResponse.json({
      success: true,
      analysis,
      metrics,
      tier
    })
  } catch (error: any) {
    console.error('Analytics Coach Bot error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to coach analytics'
    }, { status: 500 })
  }
}

