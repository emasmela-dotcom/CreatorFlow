import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { canMakeAICall, logAICall } from '@/lib/usageTracking'

/**
 * Product Recommendation Bot - AI-powered product recommendations
 * Available for all tiers
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
 * POST - Get product recommendations
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    // All tiers can use Product Recommendation Bot
    const tier = await getUserPlanTier(user.userId)

    const body = await request.json()
    const { customerId, productId, category, preferences, purchaseHistory } = body

    // Ensure tables exist FIRST (before any queries)
    try {
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        price DECIMAL(10, 2),
        image_url TEXT,
        tags TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS product_customers (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255),
        purchase_history TEXT,
        preferences TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS recommendations (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        customer_id VARCHAR(255),
        product_id INTEGER,
        category VARCHAR(100),
        preferences TEXT,
        recommendation_score DECIMAL(5, 2),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
    } catch (e: any) {
      console.error('Error creating product tables:', e.message)
      // Continue anyway - tables might already exist
    }

    // Get customer data
    let customerData = null
    if (customerId) {
      try {
        const customerResult = await db.execute({
          sql: 'SELECT * FROM product_customers WHERE id = ? AND user_id = ?',
          args: [customerId, user.userId]
        })
        customerData = customerResult.rows[0]
      } catch (e: any) {
        console.log('Error fetching customer data (table may not exist yet):', e.message)
      }
    }

    // Get products
    let sqlQuery = 'SELECT * FROM products WHERE user_id = ?'
    const args: any[] = [user.userId]

    if (category) {
      sqlQuery += ' AND category = ?'
      args.push(category)
    }

    const productsResult = await db.execute({ sql: sqlQuery, args })
    const products = productsResult.rows

    // Simple recommendation algorithm (can be enhanced with ML)
    const recommendations = products
      .filter((p: any) => !productId || p.id !== productId)
      .slice(0, 5)
      .map((p: any) => ({
        productId: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        score: Math.random() * 100 // Placeholder - replace with actual scoring
      }))
      .sort((a: any, b: any) => b.score - a.score)

    // Save recommendation request
    await db.execute({
      sql: `
        INSERT INTO recommendations (
          user_id, customer_id, product_id, category, preferences, recommendation_score, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `,
      args: [
        user.userId,
        customerId || null,
        productId || null,
        category || null,
        JSON.stringify(preferences || {}),
        recommendations[0]?.score || 0
      ]
    })

    // Log the AI call
    await logAICall(user.userId, 'Product Recommendation', '/api/bots/product-recommendation')

    return NextResponse.json({
      success: true,
      recommendations,
      tier,
      usage: {
        aiCallsUsed: limitCheck.current + 1,
        aiCallsLimit: limitCheck.limit
      }
    })
  } catch (error: any) {
    console.error('Product Recommendation Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to get recommendations' 
    }, { status: 500 })
  }
}

