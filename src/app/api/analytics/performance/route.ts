import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * Performance Analytics API
 * Aggregate analytics data from posts and analytics tables
 */

/**
 * GET - Get performance analytics
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const days = parseInt(searchParams.get('days') || '30') // Default to last 30 days

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const startDateStr = startDate.toISOString().split('T')[0]

    // Get published posts with engagement metrics
    let postsSql = `
      SELECT 
        id,
        platform,
        content,
        published_at,
        engagement_metrics,
        created_at
      FROM content_posts
      WHERE user_id = ?
        AND status = 'published'
        AND published_at >= ?
    `
    const postsArgs: any[] = [user.userId, startDateStr]

    if (platform) {
      postsSql += ' AND platform = ?'
      postsArgs.push(platform)
    }

    postsSql += ' ORDER BY published_at DESC'

    const postsResult = await db.execute({ sql: postsSql, args: postsArgs })
    const posts = postsResult.rows

    // Calculate metrics
    let totalPosts = posts.length
    let totalEngagement = 0
    let totalLikes = 0
    let totalComments = 0
    let totalShares = 0
    let totalReach = 0
    const postsByPlatform: Record<string, number> = {}
    const engagementByPlatform: Record<string, number> = {}
    const topPosts: any[] = []

    posts.forEach((post: any) => {
      const platformName = post.platform
      postsByPlatform[platformName] = (postsByPlatform[platformName] || 0) + 1

      // Parse engagement metrics
      let metrics: any = {}
      try {
        metrics = typeof post.engagement_metrics === 'string' 
          ? JSON.parse(post.engagement_metrics || '{}') 
          : post.engagement_metrics || {}
      } catch (e) {
        metrics = {}
      }

      const likes = parseInt(metrics.likes || 0)
      const comments = parseInt(metrics.comments || 0)
      const shares = parseInt(metrics.shares || 0)
      const reach = parseInt(metrics.reach || 0)
      const engagement = likes + comments + shares

      totalLikes += likes
      totalComments += comments
      totalShares += shares
      totalReach += reach
      totalEngagement += engagement

      engagementByPlatform[platformName] = (engagementByPlatform[platformName] || 0) + engagement

      // Track top posts (by engagement)
      if (engagement > 0) {
        topPosts.push({
          id: post.id,
          platform: platformName,
          content: post.content?.substring(0, 100),
          publishedAt: post.published_at,
          engagement,
          likes,
          comments,
          shares,
          reach
        })
      }
    })

    // Sort top posts by engagement
    topPosts.sort((a, b) => b.engagement - a.engagement)
    const top10Posts = topPosts.slice(0, 10)

    // Calculate averages
    const avgEngagement = totalPosts > 0 ? Math.round(totalEngagement / totalPosts) : 0
    const avgLikes = totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0
    const avgComments = totalPosts > 0 ? Math.round(totalComments / totalPosts) : 0
    const avgReach = totalPosts > 0 ? Math.round(totalReach / totalPosts) : 0

    // Get analytics table data (if available)
    let analyticsData: any[] = []
    try {
      let analyticsSql = `
        SELECT 
          platform,
          metric_type,
          value,
          date
        FROM analytics
        WHERE user_id = ?
          AND date >= ?
      `
      const analyticsArgs: any[] = [user.userId, startDateStr]

      if (platform) {
        analyticsSql += ' AND platform = ?'
        analyticsArgs.push(platform)
      }

      analyticsSql += ' ORDER BY date DESC'

      const analyticsResult = await db.execute({ sql: analyticsSql, args: analyticsArgs })
      analyticsData = analyticsResult.rows
    } catch (e: any) {
      console.log('Analytics table not available or error:', e.message)
    }

    // Calculate growth (compare first half vs second half of period)
    const midpoint = Math.floor(posts.length / 2)
    let firstHalfEngagement = 0
    let secondHalfEngagement = 0

    posts.slice(0, midpoint).forEach((post: any) => {
      try {
        const postMetrics = typeof post.engagement_metrics === 'string' 
          ? JSON.parse(post.engagement_metrics || '{}') 
          : post.engagement_metrics || {}
        firstHalfEngagement += parseInt(postMetrics.likes || 0) + parseInt(postMetrics.comments || 0) + parseInt(postMetrics.shares || 0)
      } catch (e) {}
    })

    posts.slice(midpoint).forEach((post: any) => {
      try {
        const postMetrics = typeof post.engagement_metrics === 'string' 
          ? JSON.parse(post.engagement_metrics || '{}') 
          : post.engagement_metrics || {}
        secondHalfEngagement += parseInt(postMetrics.likes || 0) + parseInt(postMetrics.comments || 0) + parseInt(postMetrics.shares || 0)
      } catch (e) {}
    })

    const growthRate = firstHalfEngagement > 0 
      ? Math.round(((secondHalfEngagement - firstHalfEngagement) / firstHalfEngagement) * 100) 
      : 0

    // Build metrics object with all data including growth
    const metrics = {
      totalPosts,
      totalEngagement,
      totalLikes,
      totalComments,
      totalShares,
      totalReach,
      avgEngagement,
      avgLikes,
      avgComments,
      avgReach,
      postsByPlatform,
      engagementByPlatform,
      topPosts: top10Posts,
      growth: {
        posts: 0,
        engagement: growthRate,
        likes: 0
      },
      period: {
        start: startDateStr,
        end: new Date().toISOString().split('T')[0],
        days
      }
    }

    return NextResponse.json({
      success: true,
      metrics,
      period: {
        days: metrics.period.days,
        startDate: metrics.period.start,
        endDate: metrics.period.end
      },
      overview: {
        totalPosts: metrics.totalPosts,
        totalEngagement: metrics.totalEngagement,
        totalLikes: metrics.totalLikes,
        totalComments: metrics.totalComments,
        totalShares: metrics.totalShares,
        totalReach: metrics.totalReach,
        avgEngagement: metrics.avgEngagement,
        avgLikes: metrics.avgLikes,
        avgComments: metrics.avgComments,
        avgReach: metrics.avgReach,
        growthRate
      },
      byPlatform: {
        posts: metrics.postsByPlatform,
        engagement: metrics.engagementByPlatform
      },
      topPosts: metrics.topPosts,
      analyticsData: analyticsData.slice(0, 100) // Limit to prevent large responses
    })
  } catch (error: any) {
    console.error('Performance analytics error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to get performance analytics' 
    }, { status: 500 })
  }
}


