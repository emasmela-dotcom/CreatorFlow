import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * Fix subscription_tier constraint to include 'free'
 * This is a one-time migration endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Try to drop existing constraint and recreate with 'free' included
    const constraintNames = [
      'users_subscription_tier_check',
      'users_subscription_tier_check1',
      'subscription_tier_check'
    ]
    
    for (const name of constraintNames) {
      try {
        await db.execute({ sql: `ALTER TABLE users DROP CONSTRAINT IF EXISTS ${name}` })
        console.log(`Dropped constraint: ${name}`)
      } catch (e: any) {
        // Ignore errors - constraint might not exist
      }
    }
    
    // Add new constraint with 'free' included
    await db.execute({
      sql: `ALTER TABLE users ADD CONSTRAINT users_subscription_tier_check 
            CHECK(subscription_tier IN ('free', 'starter', 'growth', 'pro', 'business', 'agency'))`
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Constraint updated successfully to include "free" plan' 
    })
  } catch (error: any) {
    // If constraint already exists with correct values, that's fine
    if (error.message?.includes('already exists')) {
      return NextResponse.json({ 
        success: true, 
        message: 'Constraint already exists (may already be correct)' 
      })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to update constraint' 
    }, { status: 500 })
  }
}

