/**
 * Creator Collaboration Marketplace
 * Connect creators with brands
 */

import { db } from './db'

export interface BrandOpportunity {
  id?: number
  brandName: string
  brandEmail?: string
  opportunityTitle: string
  description: string
  compensationType: string
  compensationAmount?: number
  requirements: string
  platforms: string[]
  status: 'active' | 'filled' | 'expired'
  expiresAt?: string
}

export interface CreatorCollaboration {
  id?: number
  userId: string
  opportunityId: number
  applicationStatus: 'applied' | 'accepted' | 'rejected' | 'completed'
  applicationDate: string
  acceptedAt?: string
  completedAt?: string
}

/**
 * Create brand opportunity
 */
export async function createBrandOpportunity(
  opportunity: BrandOpportunity
): Promise<number> {
  try {
    const result = await db.execute({
      sql: `
        INSERT INTO brand_opportunities (
          brand_name, brand_email, opportunity_title, description,
          compensation_type, compensation_amount, requirements, platforms, status, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id
      `,
      args: [
        opportunity.brandName,
        opportunity.brandEmail || null,
        opportunity.opportunityTitle,
        opportunity.description,
        opportunity.compensationType,
        opportunity.compensationAmount || null,
        opportunity.requirements,
        opportunity.platforms.join(','),
        opportunity.status || 'active',
        opportunity.expiresAt || null
      ]
    })

    return (result.rows[0] as any).id
  } catch (error: any) {
    console.error('Error creating brand opportunity:', error)
    throw error
  }
}

/**
 * Get active opportunities
 */
export async function getActiveOpportunities(limit: number = 20): Promise<BrandOpportunity[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT * FROM brand_opportunities
        WHERE status = 'active'
          AND (expires_at IS NULL OR expires_at >= CURRENT_DATE)
        ORDER BY created_at DESC
        LIMIT ?
      `,
      args: [limit]
    })

    return result.rows.map((row: any) => ({
      id: row.id,
      brandName: row.brand_name,
      brandEmail: row.brand_email,
      opportunityTitle: row.opportunity_title,
      description: row.description,
      compensationType: row.compensation_type,
      compensationAmount: parseFloat(row.compensation_amount || 0),
      requirements: row.requirements,
      platforms: (row.platforms || '').split(',').filter((p: string) => p),
      status: row.status,
      expiresAt: row.expires_at
    }))
  } catch (error: any) {
    console.error('Error getting opportunities:', error)
    return []
  }
}

/**
 * Apply to opportunity
 */
export async function applyToOpportunity(
  userId: string,
  opportunityId: number
): Promise<number> {
  try {
    const result = await db.execute({
      sql: `
        INSERT INTO creator_collaborations (
          user_id, opportunity_id, application_status, application_date
        ) VALUES (?, ?, 'applied', NOW())
        RETURNING id
      `,
      args: [userId, opportunityId]
    })

    return (result.rows[0] as any).id
  } catch (error: any) {
    console.error('Error applying to opportunity:', error)
    throw error
  }
}

/**
 * Get user's collaborations
 */
export async function getUserCollaborations(userId: string): Promise<CreatorCollaboration[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          cc.*,
          bo.opportunity_title,
          bo.brand_name,
          bo.compensation_type,
          bo.compensation_amount
        FROM creator_collaborations cc
        JOIN brand_opportunities bo ON bo.id = cc.opportunity_id
        WHERE cc.user_id = ?
        ORDER BY cc.application_date DESC
      `,
      args: [userId]
    })

    return result.rows.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      opportunityId: row.opportunity_id,
      applicationStatus: row.application_status,
      applicationDate: row.application_date,
      acceptedAt: row.accepted_at,
      completedAt: row.completed_at,
      opportunityTitle: row.opportunity_title,
      brandName: row.brand_name,
      compensationType: row.compensation_type,
      compensationAmount: parseFloat(row.compensation_amount || 0)
    }))
  } catch (error: any) {
    console.error('Error getting collaborations:', error)
    return []
  }
}

