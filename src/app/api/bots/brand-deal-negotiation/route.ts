import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { canMakeAICall, logAICall } from '@/lib/usageTracking'

/**
 * Brand Deal Negotiation Assistant - Analyzes brand deals and suggests negotiations
 * Available for all tiers, performance scales with plan tier
 */

interface BrandDealAnalysis {
  dealScore: number
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'reject'
  offerAnalysis: {
    proposedRate: number
    suggestedRate: number
    rateDifference: number
    ratePercentage: number
    industryBenchmark: {
      min: number
      max: number
      average: number
      yourTier: string
    }
  }
  requirements: {
    deliverables: string[]
    timeline: string
    exclusivity: boolean
    usageRights: string[]
    revisions: number
  }
  negotiation: {
    recommendedAction: 'accept' | 'counter' | 'reject'
    counterOffer: number | null
    negotiationPoints: Array<{
      point: string
      priority: 'high' | 'medium' | 'low'
      suggestion: string
      emailTemplate: string
    }>
    emailTemplates: {
      counterOffer: string
      acceptance: string
      rejection: string
    }
  }
  recommendations: Array<{
    category: 'rate' | 'terms' | 'timeline' | 'rights'
    issue: string
    suggestion: string
    impact: 'high' | 'medium' | 'low'
  }>
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

async function getUserMetrics(userId: string): Promise<{
  followers: number
  avgEngagement: number
  avgViews: number
  platform: string
}> {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          followers_count,
          avg_engagement_rate,
          avg_views
        FROM social_accounts
        WHERE user_id = $1
        ORDER BY followers_count DESC
        LIMIT 1
      `,
      args: [userId]
    })
    
    if (result.rows.length > 0) {
      const row = result.rows[0] as any
      return {
        followers: row.followers_count || 10000,
        avgEngagement: row.avg_engagement_rate || 3.0,
        avgViews: row.avg_views || 5000,
        platform: 'instagram'
      }
    }
    
    return {
      followers: 10000,
      avgEngagement: 3.0,
      avgViews: 5000,
      platform: 'instagram'
    }
  } catch (error) {
    return {
      followers: 10000,
      avgEngagement: 3.0,
      avgViews: 5000,
      platform: 'instagram'
    }
  }
}

function calculateIndustryBenchmark(
  followers: number,
  engagement: number,
  platform: string
): { min: number; max: number; average: number; yourTier: string } {
  const baseRatePerFollower = 0.01
  const engagementMultiplier = Math.min(engagement / 3.0, 2.0)
  const baseRate = followers * baseRatePerFollower * engagementMultiplier
  
  let tier = 'micro'
  let minMultiplier = 0.5
  let maxMultiplier = 1.5
  
  if (followers >= 1000000) {
    tier = 'mega'
    minMultiplier = 1.0
    maxMultiplier = 3.0
  } else if (followers >= 500000) {
    tier = 'macro'
    minMultiplier = 0.8
    maxMultiplier = 2.5
  } else if (followers >= 100000) {
    tier = 'mid-tier'
    minMultiplier = 0.7
    maxMultiplier = 2.0
  } else if (followers >= 50000) {
    tier = 'micro-plus'
    minMultiplier = 0.6
    maxMultiplier = 1.5
  }
  
  return {
    min: Math.round(baseRate * minMultiplier),
    max: Math.round(baseRate * maxMultiplier),
    average: Math.round(baseRate),
    yourTier: tier
  }
}

function analyzeBrandDeal(
  offer: {
    proposedRate: number
    deliverables: string[]
    timeline: string
    exclusivity: boolean
    usageRights: string[]
    revisions: number
    brandName: string
    campaignType: string
  },
  userMetrics: {
    followers: number
    avgEngagement: number
    avgViews: number
    platform: string
  }
): BrandDealAnalysis {
  const benchmark = calculateIndustryBenchmark(
    userMetrics.followers,
    userMetrics.avgEngagement,
    userMetrics.platform
  )
  
  const recommendations: BrandDealAnalysis['recommendations'] = []
  const negotiationPoints: BrandDealAnalysis['negotiation']['negotiationPoints'] = []
  let dealScore = 100
  
  const ratePercentage = (offer.proposedRate / benchmark.average) * 100
  const suggestedRate = Math.round(benchmark.average * 1.15)
  const rateDifference = suggestedRate - offer.proposedRate
  
  if (ratePercentage < 50) {
    dealScore -= 40
    recommendations.push({
      category: 'rate',
      issue: 'Rate is significantly below industry standard',
      suggestion: `Counter with $${suggestedRate.toLocaleString()}`,
      impact: 'high'
    })
    negotiationPoints.push({
      point: 'Rate is below market value',
      priority: 'high',
      suggestion: `Propose $${suggestedRate.toLocaleString()}`,
      emailTemplate: `Based on my audience size of ${userMetrics.followers.toLocaleString()} followers and ${userMetrics.avgEngagement.toFixed(1)}% average engagement rate, I'd like to propose a rate of $${suggestedRate.toLocaleString()} for this collaboration.`
    })
  } else if (ratePercentage < 75) {
    dealScore -= 20
    recommendations.push({
      category: 'rate',
      issue: 'Rate is below industry average',
      suggestion: `Consider countering with $${suggestedRate.toLocaleString()}`,
      impact: 'medium'
    })
    negotiationPoints.push({
      point: 'Rate could be improved',
      priority: 'medium',
      suggestion: `Industry average is $${benchmark.average.toLocaleString()}. Consider asking for $${suggestedRate.toLocaleString()}`,
      emailTemplate: `I appreciate the offer. Based on industry standards, I'd like to discuss a rate of $${suggestedRate.toLocaleString()}.`
    })
  }
  
  if (offer.exclusivity) {
    dealScore -= 15
    recommendations.push({
      category: 'terms',
      issue: 'Exclusivity clause limits future opportunities',
      suggestion: 'Request exclusivity fee (20-30% of base rate)',
      impact: 'high'
    })
    negotiationPoints.push({
      point: 'Exclusivity requires additional compensation',
      priority: 'high',
      suggestion: 'Exclusivity clauses typically add 20-30% to the base rate',
      emailTemplate: `For exclusivity, I typically add a 25% premium, which would bring the total to $${Math.round(offer.proposedRate * 1.25).toLocaleString()}.`
    })
  }
  
  if (offer.usageRights.length > 2) {
    dealScore -= 10
    recommendations.push({
      category: 'rights',
      issue: 'Extensive usage rights requested',
      suggestion: 'Limit usage rights or request additional compensation',
      impact: 'medium'
    })
  }
  
  const timelineDays = parseInt(offer.timeline) || 14
  if (timelineDays < 7) {
    dealScore -= 10
    recommendations.push({
      category: 'timeline',
      issue: 'Very tight timeline',
      suggestion: 'Request more time or rush fee (20-30% of base rate)',
      impact: 'medium'
    })
  }
  
  let status: 'excellent' | 'good' | 'fair' | 'poor' | 'reject' = 'good'
  if (dealScore >= 90) status = 'excellent'
  else if (dealScore >= 75) status = 'good'
  else if (dealScore >= 60) status = 'fair'
  else if (dealScore >= 40) status = 'poor'
  else status = 'reject'
  
  let recommendedAction: 'accept' | 'counter' | 'reject' = 'accept'
  if (dealScore < 40) recommendedAction = 'reject'
  else if (dealScore < 75 || ratePercentage < 75) recommendedAction = 'counter'
  
  const counterOfferEmail = `Hi there,\n\nThank you for the opportunity to collaborate with ${offer.brandName}. I'm excited about the campaign concept.\n\nAfter reviewing the proposal, I'd like to discuss a rate of $${suggestedRate.toLocaleString()} based on my audience metrics and industry standards.\n\nI'm confident we can find terms that work for both of us. Would you be open to discussing this?\n\nBest regards`
  
  const acceptanceEmail = `Hi there,\n\nThank you for the collaboration opportunity with ${offer.brandName}. I'm excited to work together!\n\nI'm happy to accept the terms as proposed. Please send over the contract.\n\nBest regards`
  
  const rejectionEmail = `Hi there,\n\nThank you for considering me for the ${offer.brandName} campaign. After careful consideration, I don't think this collaboration is the right fit at this time.\n\nBest regards`
  
  return {
    dealScore: Math.max(0, Math.min(100, dealScore)),
    status,
    offerAnalysis: {
      proposedRate: offer.proposedRate,
      suggestedRate,
      rateDifference,
      ratePercentage: Math.round(ratePercentage),
      industryBenchmark: benchmark
    },
    requirements: {
      deliverables: offer.deliverables,
      timeline: offer.timeline,
      exclusivity: offer.exclusivity,
      usageRights: offer.usageRights,
      revisions: offer.revisions
    },
    negotiation: {
      recommendedAction,
      counterOffer: recommendedAction === 'counter' ? suggestedRate : null,
      negotiationPoints,
      emailTemplates: {
        counterOffer: counterOfferEmail,
        acceptance: acceptanceEmail,
        rejection: rejectionEmail
      }
    },
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
    const {
      proposedRate,
      deliverables,
      timeline,
      exclusivity,
      usageRights,
      revisions,
      brandName,
      campaignType
    } = body

    if (!proposedRate || !deliverables || !brandName) {
      return NextResponse.json({
        error: 'proposedRate, deliverables, and brandName are required'
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

    const userMetrics = await getUserMetrics(user.userId)
    const tier = await getUserPlanTier(user.userId)

    const analysis = analyzeBrandDeal({
      proposedRate,
      deliverables: Array.isArray(deliverables) ? deliverables : [deliverables],
      timeline: timeline || '14 days',
      exclusivity: exclusivity || false,
      usageRights: Array.isArray(usageRights) ? usageRights : (usageRights ? [usageRights] : []),
      revisions: revisions || 2,
      brandName,
      campaignType: campaignType || 'sponsored-post'
    }, userMetrics)

    try {
      await db.execute({
        sql: `CREATE TABLE IF NOT EXISTS brand_deal_analyses (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          brand_name VARCHAR(255) NOT NULL,
          proposed_rate DECIMAL(10, 2) NOT NULL,
          suggested_rate DECIMAL(10, 2),
          deal_score INTEGER NOT NULL,
          status VARCHAR(50) NOT NULL,
          analysis JSONB NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )`
      })

      await db.execute({
        sql: `
          INSERT INTO brand_deal_analyses (
            user_id, brand_name, proposed_rate, suggested_rate, deal_score, status, analysis, created_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        `,
        args: [
          user.userId,
          brandName,
          proposedRate,
          analysis.negotiation.counterOffer,
          analysis.dealScore,
          analysis.status,
          JSON.stringify(analysis)
        ]
      })
    } catch (error) {
      console.error('Error saving brand deal analysis:', error)
    }

    await logAICall(user.userId, 'Brand Deal Negotiation', '/api/bots/brand-deal-negotiation')

    return NextResponse.json({
      success: true,
      analysis,
      tier,
      usage: {
        aiCalls: {
          current: limitCheck.current + 1,
          limit: limitCheck.limit
        }
      }
    })
  } catch (error: any) {
    console.error('Brand Deal Negotiation Bot error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to analyze brand deal'
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

    try {
      const results = await db.execute({
        sql: `
          SELECT id, brand_name, proposed_rate, suggested_rate, deal_score, status, created_at
          FROM brand_deal_analyses
          WHERE user_id = $1
          ORDER BY created_at DESC
          LIMIT $2
        `,
        args: [user.userId, limit]
      })

      return NextResponse.json({
        success: true,
        analyses: results.rows
      })
    } catch (error) {
      return NextResponse.json({
        success: true,
        analyses: []
      })
    }
  } catch (error: any) {
    console.error('Brand Deal Negotiation GET error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to get brand deal analyses'
    }, { status: 500 })
  }
}
