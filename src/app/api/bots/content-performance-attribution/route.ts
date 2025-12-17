import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { canMakeAICall, logAICall } from '@/lib/usageTracking'

/**
 * Content Performance Attribution - Tracks which content drives revenue
 * Available for all tiers, performance scales with plan tier
 */

interface ContentAttribution {
  contentId: string
  contentTitle: string
  platform: string
  performance: {
    engagement: {
      likes: number
      comments: number
      shares: number
      views: number
      engagementRate: number
    }
    revenue: {
      totalRevenue: number
      revenuePerView: number
      revenuePerEngagement: number
      affiliateRevenue: number
      brandDealRevenue: number
      productSales: number
    }
    roi: {
      timeSpent: number // minutes
      revenuePerHour: number
      roiPercentage: number
      breakEven: boolean
    }
  }
  attribution: {
    affiliateLinks: Array<{
      link: string
      clicks: number
      conversions: number
      revenue: number
    }>
    brandDeals: Array<{
      brandName: string
      rate: number
      status: string
    }>
    productSales: Array<{
      productName: string
      sales: number
      revenue: number
    }>
  }
  insights: {
    topPerformer: boolean
    revenueDriver: boolean
    recommendations: string[]
  }
}

async function getUserPlanTier(userId: string): Promise<string> {
  try {
    const userResult = await db.execute({
      sql: 'SELECT subscription_tier FROM users WHERE id = $1',
      args: [userId]
    })
    if (userResult.rows.length === 0) return 'starter'
    const tier = (userResult.rows[0] as any).subscription_tier
    return tier || 'starter'
  } catch (error) {
    return 'starter'
  }
}

async function getContentRevenue(
  userId: string,
  contentId: string
): Promise<{
  affiliateRevenue: number
  brandDealRevenue: number
  productSalesRevenue: number
  affiliateLinks: Array<{ link: string; clicks: number; conversions: number; revenue: number }>
  brandDeals: Array<{ brandName: string; rate: number; status: string }>
  productSales: Array<{ productName: string; sales: number; revenue: number }>
}> {
  try {
    // Get affiliate revenue
    const affiliateResult = await db.execute({
      sql: `
        SELECT 
          link_url,
          clicks,
          conversions,
          revenue
        FROM affiliate_tracking
        WHERE user_id = $1 AND content_id = $2
      `,
      args: [userId, contentId]
    })
    
    let affiliateRevenue = 0
    const affiliateLinks: Array<{ link: string; clicks: number; conversions: number; revenue: number }> = []
    
    affiliateResult.rows.forEach((row: any) => {
      const revenue = parseFloat(row.revenue || 0)
      affiliateRevenue += revenue
      affiliateLinks.push({
        link: row.link_url || '',
        clicks: parseInt(row.clicks || 0),
        conversions: parseInt(row.conversions || 0),
        revenue
      })
    })
    
    // Get brand deal revenue
    const brandDealResult = await db.execute({
      sql: `
        SELECT 
          brand_name,
          rate,
          status
        FROM brand_deal_analyses
        WHERE user_id = $1 AND content_id = $2
      `,
      args: [userId, contentId]
    })
    
    let brandDealRevenue = 0
    const brandDeals: Array<{ brandName: string; rate: number; status: string }> = []
    
    brandDealResult.rows.forEach((row: any) => {
      const rate = parseFloat(row.rate || 0)
      if (row.status === 'accepted' || row.status === 'excellent' || row.status === 'good') {
        brandDealRevenue += rate
      }
      brandDeals.push({
        brandName: row.brand_name || '',
        rate,
        status: row.status || 'pending'
      })
    })
    
    // Get product sales
    const productResult = await db.execute({
      sql: `
        SELECT 
          product_name,
          quantity,
          revenue
        FROM product_sales
        WHERE user_id = $1 AND content_id = $2
      `,
      args: [userId, contentId]
    })
    
    let productSalesRevenue = 0
    const productSales: Array<{ productName: string; sales: number; revenue: number }> = []
    
    productResult.rows.forEach((row: any) => {
      const revenue = parseFloat(row.revenue || 0)
      productSalesRevenue += revenue
      productSales.push({
        productName: row.product_name || '',
        sales: parseInt(row.quantity || 0),
        revenue
      })
    })
    
    return {
      affiliateRevenue,
      brandDealRevenue,
      productSalesRevenue,
      affiliateLinks,
      brandDeals,
      productSales
    }
  } catch (error) {
    return {
      affiliateRevenue: 0,
      brandDealRevenue: 0,
      productSalesRevenue: 0,
      affiliateLinks: [],
      brandDeals: [],
      productSales: []
    }
  }
}

function calculateAttribution(
  content: any,
  revenue: {
    affiliateRevenue: number
    brandDealRevenue: number
    productSalesRevenue: number
    affiliateLinks: Array<{ link: string; clicks: number; conversions: number; revenue: number }>
    brandDeals: Array<{ brandName: string; rate: number; status: string }>
    productSales: Array<{ productName: string; sales: number; revenue: number }>
  },
  engagement: {
    likes: number
    comments: number
    shares: number
    views: number
  }
): ContentAttribution {
  const totalRevenue = revenue.affiliateRevenue + revenue.brandDealRevenue + revenue.productSalesRevenue
  const totalEngagement = engagement.likes + engagement.comments + engagement.shares
  const engagementRate = engagement.views > 0 ? (totalEngagement / engagement.views) * 100 : 0
  
  const revenuePerView = engagement.views > 0 ? totalRevenue / engagement.views : 0
  const revenuePerEngagement = totalEngagement > 0 ? totalRevenue / totalEngagement : 0
  
  // Estimate time spent (default 2 hours for content creation)
  const timeSpent = content.time_spent || 120 // minutes
  const revenuePerHour = (totalRevenue / timeSpent) * 60
  
  // ROI calculation (assuming $50/hour opportunity cost)
  const opportunityCost = (timeSpent / 60) * 50
  const roiPercentage = opportunityCost > 0 ? ((totalRevenue - opportunityCost) / opportunityCost) * 100 : 0
  const breakEven = totalRevenue >= opportunityCost
  
  const insights = {
    topPerformer: engagementRate > 5 && totalRevenue > 100,
    revenueDriver: totalRevenue > 50,
    recommendations: [] as string[]
  }
  
  if (revenuePerView < 0.01 && engagement.views > 1000) {
    insights.recommendations.push('High views but low revenue - consider adding affiliate links or product mentions')
  }
  
  if (engagementRate < 2) {
    insights.recommendations.push('Low engagement rate - focus on more engaging content formats')
  }
  
  if (revenuePerHour < 25) {
    insights.recommendations.push('Revenue per hour is below average - consider optimizing content creation time or increasing monetization')
  }
  
  if (totalRevenue === 0 && engagement.views > 5000) {
    insights.recommendations.push('High engagement but no revenue - add monetization (affiliate links, products, brand deals)')
  }
  
  return {
    contentId: content.id || '',
    contentTitle: content.title || content.topic || 'Untitled',
    platform: content.platform || 'instagram',
    performance: {
      engagement: {
        likes: engagement.likes,
        comments: engagement.comments,
        shares: engagement.shares,
        views: engagement.views,
        engagementRate: Math.round(engagementRate * 100) / 100
      },
      revenue: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        revenuePerView: Math.round(revenuePerView * 1000) / 1000,
        revenuePerEngagement: Math.round(revenuePerEngagement * 100) / 100,
        affiliateRevenue: Math.round(revenue.affiliateRevenue * 100) / 100,
        brandDealRevenue: Math.round(revenue.brandDealRevenue * 100) / 100,
        productSales: Math.round(revenue.productSalesRevenue * 100) / 100
      },
      roi: {
        timeSpent,
        revenuePerHour: Math.round(revenuePerHour * 100) / 100,
        roiPercentage: Math.round(roiPercentage * 100) / 100,
        breakEven
      }
    },
    attribution: {
      affiliateLinks: revenue.affiliateLinks || [],
      brandDeals: revenue.brandDeals || [],
      productSales: revenue.productSales || []
    },
    insights
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { contentId, contentTitle, platform, engagement, timeSpent } = body

    if (!contentId) {
      return NextResponse.json({
        error: 'contentId is required'
      }, { status: 400 })
    }

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

    // Get content data
    let contentData: any = {
      id: contentId,
      title: contentTitle,
      platform: platform || 'instagram',
      time_spent: timeSpent || 120
    }

    // Try to get content from database
    try {
      const contentResult = await db.execute({
        sql: `
          SELECT id, topic, title, platform, created_at
          FROM content_posts
          WHERE user_id = $1 AND id = $2
          LIMIT 1
        `,
        args: [user.userId, contentId]
      })
      
      if (contentResult.rows.length > 0) {
        const row = contentResult.rows[0] as any
        contentData = {
          id: row.id,
          title: row.title || row.topic,
          platform: row.platform || platform || 'instagram',
          time_spent: timeSpent || 120
        }
      }
    } catch (error) {
      // Use provided data
    }

    // Get engagement data (use provided or fetch)
    const engagementData = engagement || {
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0
    }

    // Get revenue data
    const revenueData = await getContentRevenue(user.userId, contentId)

    // Calculate attribution
    const attribution = calculateAttribution(contentData, revenueData, engagementData)

    // Save attribution
    try {
      await db.execute({
        sql: `CREATE TABLE IF NOT EXISTS content_attributions (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          content_id VARCHAR(255) NOT NULL,
          total_revenue DECIMAL(10, 2) NOT NULL,
          attribution_data JSONB NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )`
      })

      await db.execute({
        sql: `
          INSERT INTO content_attributions (
            user_id, content_id, total_revenue, attribution_data, created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, NOW(), NOW())
          ON CONFLICT (user_id, content_id) 
          DO UPDATE SET 
            total_revenue = EXCLUDED.total_revenue,
            attribution_data = EXCLUDED.attribution_data,
            updated_at = NOW()
        `,
        args: [
          user.userId,
          contentId,
          attribution.performance.revenue.totalRevenue,
          JSON.stringify(attribution)
        ]
      })
    } catch (error) {
      // Table might not support ON CONFLICT, try simple insert
      try {
        await db.execute({
          sql: `
            INSERT INTO content_attributions (
              user_id, content_id, total_revenue, attribution_data, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, NOW(), NOW())
          `,
          args: [
            user.userId,
            contentId,
            attribution.performance.revenue.totalRevenue,
            JSON.stringify(attribution)
          ]
        })
      } catch (e) {
        console.error('Error saving attribution:', e)
      }
    }

    await logAICall(user.userId, 'Content Performance Attribution', '/api/bots/content-performance-attribution')

    return NextResponse.json({
      success: true,
      attribution,
      tier,
      usage: {
        aiCalls: {
          current: limitCheck.current + 1,
          limit: limitCheck.limit
        }
      }
    })
  } catch (error: any) {
    console.error('Content Performance Attribution Bot error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to calculate content attribution'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const contentId = searchParams.get('contentId')

    try {
      let results
      if (contentId) {
        results = await db.execute({
          sql: `
            SELECT content_id, total_revenue, attribution_data, created_at, updated_at
            FROM content_attributions
            WHERE user_id = $1 AND content_id = $2
            ORDER BY updated_at DESC
            LIMIT 1
          `,
          args: [user.userId, contentId]
        })
      } else {
        results = await db.execute({
          sql: `
            SELECT content_id, total_revenue, attribution_data, created_at, updated_at
            FROM content_attributions
            WHERE user_id = $1
            ORDER BY total_revenue DESC
            LIMIT $2
          `,
          args: [user.userId, limit]
        })
      }

      return NextResponse.json({
        success: true,
        attributions: results.rows
      })
    } catch (error) {
      return NextResponse.json({
        success: true,
        attributions: []
      })
    }
  } catch (error: any) {
    console.error('Content Performance Attribution GET error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to get content attributions'
    }, { status: 500 })
  }
}

