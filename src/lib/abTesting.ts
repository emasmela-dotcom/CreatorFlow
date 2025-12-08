/**
 * Content A/B Testing System
 * Test variations and compare performance
 */

import { db } from './db'

export interface ABTestGroup {
  id?: number
  testName: string
  originalPostId: string
  variantAPostId: string
  variantBPostId: string
  status: 'active' | 'completed'
  winnerPostId?: string
}

export interface ABTestResult {
  variant: 'A' | 'B'
  engagement: number
  reach: number
  likes: number
  comments: number
  shares: number
}

/**
 * Create A/B test group
 */
export async function createABTest(
  userId: string,
  test: ABTestGroup
): Promise<number> {
  try {
    const result = await db.execute({
      sql: `
        INSERT INTO ab_test_groups (
          user_id, test_name, original_post_id, variant_a_post_id, variant_b_post_id, test_status
        ) VALUES (?, ?, ?, ?, ?, ?)
        RETURNING id
      `,
      args: [
        userId,
        test.testName,
        test.originalPostId,
        test.variantAPostId,
        test.variantBPostId,
        test.status || 'active'
      ]
    })

    return (result.rows[0] as any).id
  } catch (error: any) {
    console.error('Error creating A/B test:', error)
    throw error
  }
}

/**
 * Record A/B test results
 */
export async function recordABTestResult(
  testGroupId: number,
  postId: string,
  variant: 'A' | 'B',
  metrics: {
    engagement: number
    reach: number
    likes: number
    comments: number
    shares: number
  }
): Promise<void> {
  try {
    await db.execute({
      sql: `
        INSERT INTO ab_test_results (
          test_group_id, post_id, variant, engagement, reach, likes, comments, shares
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        testGroupId,
        postId,
        variant,
        metrics.engagement,
        metrics.reach,
        metrics.likes,
        metrics.comments,
        metrics.shares
      ]
    })
  } catch (error: any) {
    console.error('Error recording A/B test result:', error)
    throw error
  }
}

/**
 * Get A/B test results and determine winner
 */
export async function getABTestResults(testGroupId: number): Promise<{
  variantA: ABTestResult
  variantB: ABTestResult
  winner: 'A' | 'B' | null
  confidence: number
}> {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          variant,
          AVG(engagement) as avg_engagement,
          AVG(reach) as avg_reach,
          AVG(likes) as avg_likes,
          AVG(comments) as avg_comments,
          AVG(shares) as avg_shares,
          COUNT(*) as sample_size
        FROM ab_test_results
        WHERE test_group_id = ?
        GROUP BY variant
      `,
      args: [testGroupId]
    })

    const rows = result.rows as any[]
    const variantA = rows.find((r: any) => r.variant === 'A')
    const variantB = rows.find((r: any) => r.variant === 'B')

    if (!variantA || !variantB) {
      return {
        variantA: { variant: 'A', engagement: 0, reach: 0, likes: 0, comments: 0, shares: 0 },
        variantB: { variant: 'B', engagement: 0, reach: 0, likes: 0, comments: 0, shares: 0 },
        winner: null,
        confidence: 0
      }
    }

    const aEngagement = parseFloat(variantA.avg_engagement || 0)
    const bEngagement = parseFloat(variantB.avg_engagement || 0)

    const winner = aEngagement > bEngagement ? 'A' : bEngagement > aEngagement ? 'B' : null
    const difference = Math.abs(aEngagement - bEngagement)
    const avgEngagement = (aEngagement + bEngagement) / 2
    const confidence = avgEngagement > 0 
      ? Math.min(100, Math.round((difference / avgEngagement) * 100))
      : 0

    return {
      variantA: {
        variant: 'A',
        engagement: Math.round(aEngagement),
        reach: Math.round(parseFloat(variantA.avg_reach || 0)),
        likes: Math.round(parseFloat(variantA.avg_likes || 0)),
        comments: Math.round(parseFloat(variantA.avg_comments || 0)),
        shares: Math.round(parseFloat(variantA.avg_shares || 0))
      },
      variantB: {
        variant: 'B',
        engagement: Math.round(bEngagement),
        reach: Math.round(parseFloat(variantB.avg_reach || 0)),
        likes: Math.round(parseFloat(variantB.avg_likes || 0)),
        comments: Math.round(parseFloat(variantB.avg_comments || 0)),
        shares: Math.round(parseFloat(variantB.avg_shares || 0))
      },
      winner,
      confidence
    }
  } catch (error: any) {
    console.error('Error getting A/B test results:', error)
    throw error
  }
}

