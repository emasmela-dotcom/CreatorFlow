import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { canUseStorage, updateStorageUsage, PlanType } from '@/lib/usageTracking'
import { getHashtagSetLimit } from '@/lib/planLimits'

/**
 * Hashtag Research Tool
 * Find trending hashtags, save hashtag sets, and get recommendations
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
 * POST - Research hashtags or save a hashtag set
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, niche, platform, content, name, hashtags, description } = body

    if (action === 'research') {
      // Research trending hashtags
      const tier = await getUserPlanTier(user.userId)
      
      // Analyze user's content to determine niche if not provided
      let userNiche = niche || 'general'
      if (!niche) {
        const postsResult = await db.execute({
          sql: `SELECT content FROM content_posts 
                WHERE user_id = ? AND status = 'published'
                ORDER BY published_at DESC LIMIT 20`,
          args: [user.userId]
        })
        
        const allContent = (postsResult.rows as any[])
          .map(p => p.content?.toLowerCase() || '')
          .join(' ')
        
        if (allContent.includes('fitness') || allContent.includes('workout')) userNiche = 'fitness'
        else if (allContent.includes('business') || allContent.includes('entrepreneur')) userNiche = 'business'
        else if (allContent.includes('tech') || allContent.includes('coding')) userNiche = 'technology'
        else if (allContent.includes('food') || allContent.includes('recipe')) userNiche = 'food'
        else if (allContent.includes('travel')) userNiche = 'travel'
        else if (allContent.includes('fashion') || allContent.includes('style')) userNiche = 'fashion'
      }

      // Get trending hashtags based on niche and platform
      const trendingHashtags = getTrendingHashtags(userNiche, platform || 'instagram', tier)
      
      // Get recommended hashtags based on content if provided
      let recommendedHashtags: any[] = []
      if (content) {
        recommendedHashtags = getRecommendedHashtags(content, platform || 'instagram', userNiche)
      }

      return NextResponse.json({
        success: true,
        niche: userNiche,
        platform: platform || 'instagram',
        trending: trendingHashtags,
        recommended: recommendedHashtags,
        strategy: {
          optimalCount: platform === 'instagram' ? 15 : platform === 'tiktok' ? 5 : 10,
          mix: '30% high-reach, 50% niche-specific, 20% trending'
        }
      })
    } else if (action === 'save') {
      // Save a hashtag set
      if (!name || !hashtags) {
        return NextResponse.json({ 
          error: 'Name and hashtags are required' 
        }, { status: 400 })
      }

      const result = await db.execute({
        sql: `
          INSERT INTO hashtag_sets (user_id, name, platform, hashtags, description, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, NOW(), NOW())
          RETURNING *
        `,
        args: [user.userId, name, platform || null, hashtags, description || null]
      })

      return NextResponse.json({
        success: true,
        hashtagSet: result.rows[0]
      })
    } else {
      return NextResponse.json({ 
        error: 'Invalid action. Use "research" or "save"' 
      }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Hashtag Research error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to research hashtags' 
    }, { status: 500 })
  }
}

/**
 * GET - Get saved hashtag sets or search hashtags
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'sets'

    if (action === 'sets') {
      // Get all saved hashtag sets
      const result = await db.execute({
        sql: `SELECT * FROM hashtag_sets 
              WHERE user_id = ? 
              ORDER BY updated_at DESC`,
        args: [user.userId]
      })

      return NextResponse.json({
        success: true,
        hashtagSets: result.rows
      })
    } else if (action === 'search') {
      // Search for hashtags (basic implementation)
      const query = searchParams.get('q') || ''
      const platform = searchParams.get('platform') || 'instagram'
      
      // In a real implementation, you'd use an API like Instagram's or TikTok's
      // For now, return suggestions based on query
      const suggestions = searchHashtags(query, platform)
      
      return NextResponse.json({
        success: true,
        suggestions
      })
    } else {
      return NextResponse.json({ 
        error: 'Invalid action' 
      }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Hashtag Research GET error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to get hashtag sets' 
    }, { status: 500 })
  }
}

/**
 * DELETE - Delete a hashtag set
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const setId = searchParams.get('id')

    if (!setId) {
      return NextResponse.json({ 
        error: 'Hashtag set ID is required' 
      }, { status: 400 })
    }

    await db.execute({
      sql: `DELETE FROM hashtag_sets 
            WHERE id = ? AND user_id = ?`,
      args: [setId, user.userId]
    })

    return NextResponse.json({
      success: true,
      message: 'Hashtag set deleted'
    })
  } catch (error: any) {
    console.error('Hashtag Research DELETE error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to delete hashtag set' 
    }, { status: 500 })
  }
}

// Helper functions
function getTrendingHashtags(niche: string, platform: string, tier: string): any[] {
  const hashtagsByNiche: Record<string, any[]> = {
    fitness: [
      { hashtag: '#FitnessMotivation', reach: 'High', engagement: 'High', posts: '2.5M+' },
      { hashtag: '#Workout', reach: 'Very High', engagement: 'Medium', posts: '5M+' },
      { hashtag: '#HomeWorkout', reach: 'Medium', engagement: 'High', posts: '800K+' },
      { hashtag: '#FitnessTips', reach: 'Medium', engagement: 'High', posts: '1.2M+' },
      { hashtag: '#HealthyLifestyle', reach: 'High', engagement: 'Medium', posts: '3M+' }
    ],
    business: [
      { hashtag: '#Entrepreneurship', reach: 'High', engagement: 'High', posts: '4M+' },
      { hashtag: '#BusinessTips', reach: 'High', engagement: 'High', posts: '2M+' },
      { hashtag: '#StartupLife', reach: 'Medium', engagement: 'High', posts: '1.5M+' },
      { hashtag: '#Productivity', reach: 'High', engagement: 'Medium', posts: '3M+' },
      { hashtag: '#BusinessGrowth', reach: 'Medium', engagement: 'High', posts: '900K+' }
    ],
    technology: [
      { hashtag: '#TechNews', reach: 'Very High', engagement: 'Medium', posts: '6M+' },
      { hashtag: '#AI', reach: 'High', engagement: 'High', posts: '2M+' },
      { hashtag: '#Coding', reach: 'Medium', engagement: 'High', posts: '1.8M+' },
      { hashtag: '#TechTips', reach: 'Medium', engagement: 'High', posts: '1M+' },
      { hashtag: '#Innovation', reach: 'High', engagement: 'Medium', posts: '2.5M+' }
    ],
    food: [
      { hashtag: '#Foodie', reach: 'Very High', engagement: 'High', posts: '8M+' },
      { hashtag: '#FoodPorn', reach: 'Very High', engagement: 'High', posts: '10M+' },
      { hashtag: '#Recipe', reach: 'High', engagement: 'High', posts: '3M+' },
      { hashtag: '#HomeCooking', reach: 'Medium', engagement: 'High', posts: '1.5M+' },
      { hashtag: '#FoodPhotography', reach: 'High', engagement: 'Medium', posts: '2M+' }
    ],
    travel: [
      { hashtag: '#Travel', reach: 'Very High', engagement: 'High', posts: '15M+' },
      { hashtag: '#Wanderlust', reach: 'High', engagement: 'High', posts: '5M+' },
      { hashtag: '#TravelPhotography', reach: 'High', engagement: 'Medium', posts: '3M+' },
      { hashtag: '#Adventure', reach: 'High', engagement: 'High', posts: '4M+' },
      { hashtag: '#Explore', reach: 'Very High', engagement: 'Medium', posts: '6M+' }
    ],
    fashion: [
      { hashtag: '#Fashion', reach: 'Very High', engagement: 'High', posts: '12M+' },
      { hashtag: '#OOTD', reach: 'High', engagement: 'High', posts: '8M+' },
      { hashtag: '#Style', reach: 'High', engagement: 'Medium', posts: '5M+' },
      { hashtag: '#FashionInspo', reach: 'Medium', engagement: 'High', posts: '2M+' },
      { hashtag: '#FashionBlogger', reach: 'Medium', engagement: 'High', posts: '1.5M+' }
    ],
    general: [
      { hashtag: '#Motivation', reach: 'Very High', engagement: 'High', posts: '20M+' },
      { hashtag: '#Inspiration', reach: 'Very High', engagement: 'High', posts: '15M+' },
      { hashtag: '#Lifestyle', reach: 'Very High', engagement: 'Medium', posts: '10M+' },
      { hashtag: '#Daily', reach: 'High', engagement: 'Medium', posts: '8M+' },
      { hashtag: '#Life', reach: 'Very High', engagement: 'Medium', posts: '12M+' }
    ]
  }

  return hashtagsByNiche[niche] || hashtagsByNiche.general
}

function getRecommendedHashtags(content: string, platform: string, niche: string): any[] {
  const contentLower = content.toLowerCase()
  const recommendations: any[] = []

  // Extract keywords and suggest hashtags
  const keywords = contentLower.split(/\s+/).filter(word => word.length > 4)
  
  keywords.slice(0, 5).forEach(keyword => {
    const hashtag = '#' + keyword.charAt(0).toUpperCase() + keyword.slice(1)
    recommendations.push({
      hashtag,
      reason: `Based on your content keyword: "${keyword}"`,
      reach: 'Medium',
      engagement: 'Medium'
    })
  })

  return recommendations
}

function searchHashtags(query: string, platform: string): any[] {
  // Basic search - in production, use actual API
  const suggestions = [
    { hashtag: `#${query}`, reach: 'Medium', posts: '100K+' },
    { hashtag: `#${query}Tips`, reach: 'Low', posts: '50K+' },
    { hashtag: `#${query}Life`, reach: 'Low', posts: '30K+' }
  ]
  
  return suggestions
}

