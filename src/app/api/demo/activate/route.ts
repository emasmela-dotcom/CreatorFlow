import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

/**
 * Demo Account Activation
 * Creates or retrieves a demo account for exploring the site
 */

const DEMO_EMAIL = 'demo@creatorflow365.com'
const DEMO_PASSWORD = 'DemoAccount2025!'

/**
 * POST - Activate demo account
 */
export async function POST(request: NextRequest) {
  try {
    // Fix database constraint first (in case it doesn't include 'free')
    try {
      const constraintNames = [
        'users_subscription_tier_check',
        'users_subscription_tier_check1',
        'subscription_tier_check'
      ]
      for (const name of constraintNames) {
        try {
          await db.execute({ sql: `ALTER TABLE users DROP CONSTRAINT IF EXISTS ${name}` })
        } catch (e: any) {
          // Ignore errors
        }
      }
      await db.execute({
        sql: `ALTER TABLE users ADD CONSTRAINT users_subscription_tier_check 
              CHECK(subscription_tier IN ('free', 'starter', 'growth', 'pro', 'business', 'agency'))`
      })
    } catch (constraintError: any) {
      // Constraint might already be correct, continue
      if (!constraintError.message?.includes('already exists')) {
        console.log('Could not update constraint (may already be correct):', constraintError.message)
      }
    }

    // Check if demo user already exists
    let demoUser = await db.execute({
      sql: 'SELECT id, email FROM users WHERE email = ?',
      args: [DEMO_EMAIL]
    })

    let userId: string
    let isNewUser = false

    if (demoUser.rows.length === 0) {
      // Create demo user
      isNewUser = true
      userId = crypto.randomUUID()
      const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10)

      await db.execute({
        sql: `
          INSERT INTO users (id, email, password_hash, subscription_tier, trial_end_at, created_at)
          VALUES (?, ?, ?, 'starter', NOW() + INTERVAL '30 days', NOW())
        `,
        args: [userId, DEMO_EMAIL, hashedPassword]
      })

      // Create snapshot for demo account (empty state)
      try {
        await db.execute({
          sql: `
            CREATE TABLE IF NOT EXISTS account_snapshots (
              id SERIAL PRIMARY KEY,
              user_id VARCHAR(255) NOT NULL,
              snapshot_data TEXT NOT NULL,
              created_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
          `
        })

        await db.execute({
          sql: `
            INSERT INTO account_snapshots (user_id, snapshot_data, created_at)
            VALUES (?, ?, NOW())
          `,
          args: [userId, JSON.stringify({ empty: true, createdAt: new Date().toISOString() })]
        })
      } catch (error) {
        // Continue even if snapshot fails
        console.log('Snapshot creation skipped')
      }

      // Pre-populate with sample data for demo
      await createDemoContent(userId)
    } else {
      // Use existing demo user
      userId = (demoUser.rows[0] as any).id
    }

    await ensureDemoTrialAccess(userId)

    // Generate token with longer expiration for demo (7 days)
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-development-only'
    const token = jwt.sign(
      {
        userId,
        email: DEMO_EMAIL,
        type: 'access',
        isDemo: true
      },
      JWT_SECRET,
      { expiresIn: '7d' } // Demo tokens last 7 days
    )

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: userId,
        email: DEMO_EMAIL,
        isDemo: true
      },
      isNewUser
    })
  } catch (error: any) {
    console.error('Demo activation error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to activate demo account'
    }, { status: 500 })
  }
}

/** Starter trial so demo can create posts and use full AI monthly allowance */
async function ensureDemoTrialAccess(userId: string) {
  try {
    await db.execute({
      sql: `
        UPDATE users
        SET subscription_tier = 'starter',
            trial_end_at = NOW() + INTERVAL '30 days'
        WHERE id = ?
      `,
      args: [userId],
    })
  } catch (error) {
    console.error('Error ensuring demo trial access:', error)
  }
}

/**
 * Create sample demo content
 */
async function createDemoContent(userId: string) {
  try {
    // Create sample documents
    await db.execute({
      sql: `
        INSERT INTO documents (user_id, title, content, created_at)
        VALUES 
          (?, 'Welcome to CreatorFlow!', 'This is a demo document. Explore all the features!', NOW()),
          (?, 'Content Ideas', 'Here are some content ideas for your next posts...', NOW())
      `,
      args: [userId, userId]
    })

    // Create sample hashtag sets
    await db.execute({
      sql: `
        INSERT INTO hashtag_sets (user_id, name, platform, hashtags, description, created_at)
        VALUES 
          (?, 'Fitness — Instagram', 'instagram', '["#fitness", "#workout", "#health", "#gymlife"]', 'Demo fitness niche set', NOW()),
          (?, 'Tech — Twitter', 'twitter', '["#tech", "#innovation", "#startup", "#buildinpublic"]', 'Demo tech niche set', NOW()),
          (?, 'Creator tips — TikTok', 'tiktok', '["#creatortips", "#contentcreator", "#socialmediatips"]', 'Demo short-form set', NOW())
      `,
      args: [userId, userId, userId]
    })

    // Create sample templates
    await db.execute({
      sql: `
        INSERT INTO content_templates (user_id, name, platform, content, variables, category, created_at)
        VALUES 
          (?, 'Product Launch', 'instagram', 'Excited to announce {product}! 🎉\n\nLink in bio for early access.', '["product"]', 'launch', NOW()),
          (?, 'Weekly Update', 'twitter', 'This week: {update}. What would you try first?', '["update"]', 'update', NOW()),
          (?, 'Carousel slide 1', 'instagram', 'Hook: {hook}\n\nSwipe for the full breakdown →', '["hook"]', 'carousel', NOW())
      `,
      args: [userId, userId, userId]
    })

    // Create sample posts
    await db.execute({
      sql: `
        INSERT INTO content_posts (user_id, platform, content, status, created_at)
        VALUES 
          (?, 'instagram', 'Check out CreatorFlow365 — plan, write, and organize content in one workspace. #demo #creatorflow', 'published', NOW()),
          (?, 'twitter', 'Just batched a week of posts in one session. Less app-hopping, more publishing. 🚀', 'draft', NOW()),
          (?, 'linkedin', 'Creators: your bottleneck is not ideas — it is workflow. Here is how I structure a content week.', 'draft', NOW()),
          (?, 'tiktok', 'POV: you finally have captions, hashtags, and templates in one place.', 'draft', NOW())
      `,
      args: [userId, userId, userId, userId]
    })
  } catch (error) {
    console.error('Error creating demo content:', error)
    // Don't fail if demo content creation fails
  }
}

