/**
 * Revenue Tracker & Income Dashboard
 * Track all income sources for creators
 */

import { db } from './db'

export interface RevenueSource {
  id?: number
  sourceName: string
  sourceType: 'sponsorship' | 'affiliate' | 'product' | 'ads' | 'other'
  isActive: boolean
}

export interface RevenueTransaction {
  id?: number
  sourceId: number
  amount: number
  currency: string
  transactionDate: string
  description?: string
  category?: string
  paymentMethod?: string
}

/**
 * Get all revenue sources for user
 */
export async function getRevenueSources(userId: string): Promise<RevenueSource[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT * FROM revenue_sources
        WHERE user_id = ?
        ORDER BY created_at DESC
      `,
      args: [userId]
    })

    return result.rows as RevenueSource[]
  } catch (error: any) {
    console.error('Error getting revenue sources:', error)
    return []
  }
}

/**
 * Add revenue source
 */
export async function addRevenueSource(
  userId: string,
  source: RevenueSource
): Promise<number> {
  try {
    const result = await db.execute({
      sql: `
        INSERT INTO revenue_sources (user_id, source_name, source_type, is_active)
        VALUES (?, ?, ?, ?)
        RETURNING id
      `,
      args: [userId, source.sourceName, source.sourceType, source.isActive ?? true]
    })

    return (result.rows[0] as any).id
  } catch (error: any) {
    console.error('Error adding revenue source:', error)
    throw error
  }
}

/**
 * Add revenue transaction
 */
export async function addRevenueTransaction(
  userId: string,
  transaction: RevenueTransaction
): Promise<number> {
  try {
    const result = await db.execute({
      sql: `
        INSERT INTO revenue_transactions (
          user_id, source_id, amount, currency, transaction_date,
          description, category, payment_method
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id
      `,
      args: [
        userId,
        transaction.sourceId,
        transaction.amount,
        transaction.currency || 'USD',
        transaction.transactionDate,
        transaction.description || null,
        transaction.category || null,
        transaction.paymentMethod || null
      ]
    })

    return (result.rows[0] as any).id
  } catch (error: any) {
    console.error('Error adding revenue transaction:', error)
    throw error
  }
}

/**
 * Get revenue summary
 */
export async function getRevenueSummary(
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<{
  totalRevenue: number
  revenueBySource: Record<string, number>
  revenueByMonth: Record<string, number>
  transactionCount: number
}> {
  try {
    let sql = `
      SELECT 
        source_id,
        amount,
        currency,
        transaction_date,
        rs.source_name,
        rs.source_type
      FROM revenue_transactions rt
      JOIN revenue_sources rs ON rs.id = rt.source_id
      WHERE rt.user_id = ?
    `
    const args: any[] = [userId]

    if (startDate) {
      sql += ' AND transaction_date >= ?'
      args.push(startDate)
    }
    if (endDate) {
      sql += ' AND transaction_date <= ?'
      args.push(endDate)
    }

    sql += ' ORDER BY transaction_date DESC'

    const result = await db.execute({ sql, args })
    const transactions = result.rows as any[]

    let totalRevenue = 0
    const revenueBySource: Record<string, number> = {}
    const revenueByMonth: Record<string, number> = {}

    transactions.forEach((t: any) => {
      const amount = parseFloat(t.amount || 0)
      totalRevenue += amount

      // By source
      const sourceName = t.source_name || 'Unknown'
      revenueBySource[sourceName] = (revenueBySource[sourceName] || 0) + amount

      // By month
      const date = new Date(t.transaction_date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + amount
    })

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      revenueBySource,
      revenueByMonth,
      transactionCount: transactions.length
    }
  } catch (error: any) {
    console.error('Error getting revenue summary:', error)
    return {
      totalRevenue: 0,
      revenueBySource: {},
      revenueByMonth: {},
      transactionCount: 0
    }
  }
}

