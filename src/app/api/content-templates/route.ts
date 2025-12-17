import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { canUseStorage, updateStorageUsage } from '@/lib/usageTracking'
import { getTemplateLimit, PlanType } from '@/lib/planLimits'

/**
 * Content Templates Tool
 * Save, load, and manage content templates
 */

/**
 * POST - Create or update a template
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ENSURE TABLE EXISTS FIRST - Before any other operations
    // Only create if it doesn't exist - NEVER drop existing tables!
    try {
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS content_templates (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        platform VARCHAR(50),
        content TEXT NOT NULL,
        variables TEXT,
        category VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
      
      // Check if user_id column exists, if not add it
      try {
        await db.execute({ sql: `ALTER TABLE content_templates ADD COLUMN IF NOT EXISTS user_id VARCHAR(255)` })
      } catch (e: any) {
        // Column might already exist, ignore error
      }
    } catch (e: any) {
      console.error('Failed to create content_templates table:', e.message)
      // Continue anyway - table might already exist
    }

    const body = await request.json()
    const { id, name, platform, content, variables, category, description } = body

    if (!name || !content) {
      return NextResponse.json({ 
        error: 'Name and content are required' 
      }, { status: 400 })
    }

    // Get user's plan
    const userResult = await db.execute({
      sql: 'SELECT subscription_tier FROM users WHERE id = ?',
      args: [user.userId]
    })
    const userPlan = (userResult.rows[0] as any)?.subscription_tier as PlanType | null

    if (id) {
      // Update existing template
      const result = await db.execute({
        sql: `
          UPDATE content_templates 
          SET name = ?, platform = ?, content = ?, variables = ?, 
              category = ?, description = ?, updated_at = NOW()
          WHERE id = ? AND user_id = ?
          RETURNING *
        `,
        args: [name, platform || null, content, variables || null, 
               category || null, description || null, id, user.userId]
      })

      // Update storage usage
      await updateStorageUsage(user.userId)

      return NextResponse.json({
        success: true,
        template: result.rows[0]
      })
    } else {
      // Check template limit for new templates
      const templateLimit = getTemplateLimit(userPlan)
      if (templateLimit !== -1) {
        const currentTemplates = await db.execute({
          sql: 'SELECT COUNT(*) as count FROM content_templates WHERE user_id = ?',
          args: [user.userId]
        })
        const currentCount = parseInt(currentTemplates.rows[0]?.count || 0)
        if (currentCount >= templateLimit) {
          return NextResponse.json({
            error: `You've reached your template limit (${currentCount}/${templateLimit}). Upgrade to continue.`,
            current: currentCount,
            limit: templateLimit,
            upgradeRequired: true
          }, { status: 403 })
        }
      }

      // Check storage limit
      const contentBytes = Buffer.byteLength(name + content + (description || ''), 'utf8')
      const storageCheck = await canUseStorage(user.userId, contentBytes)
      if (!storageCheck.allowed) {
        return NextResponse.json({
          error: storageCheck.message || 'Storage limit exceeded',
          currentMB: storageCheck.currentMB,
          limitMB: storageCheck.limitMB,
          upgradeRequired: true
        }, { status: 403 })
      }


      // Create new template
      const result = await db.execute({
        sql: `
          INSERT INTO content_templates 
          (user_id, name, platform, content, variables, category, description, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          RETURNING *
        `,
        args: [user.userId, name, platform || null, content, 
               variables || null, category || null, description || null]
      })

      // Update storage usage
      await updateStorageUsage(user.userId)

      return NextResponse.json({
        success: true,
        template: result.rows[0]
      })
    }
  } catch (error: any) {
    console.error('Content Templates error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to save template' 
    }, { status: 500 })
  }
}

/**
 * GET - Get templates (all, by category, or by platform)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ENSURE TABLE EXISTS FIRST
    try {
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS content_templates (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        platform VARCHAR(50),
        content TEXT NOT NULL,
        variables TEXT,
        category VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
    } catch (e: any) {
      console.error('Failed to ensure content_templates table:', e.message)
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const platform = searchParams.get('platform')
    const id = searchParams.get('id')

    let sql = 'SELECT * FROM content_templates WHERE user_id = ?'
    const args: any[] = [user.userId]

    if (id) {
      sql += ' AND id = ?'
      args.push(id)
    } else if (category) {
      sql += ' AND category = ?'
      args.push(category)
    } else if (platform) {
      sql += ' AND platform = ?'
      args.push(platform)
    }

    sql += ' ORDER BY updated_at DESC'

    const result = await db.execute({ sql, args })

    return NextResponse.json({
      success: true,
      templates: result.rows
    })
  } catch (error: any) {
    console.error('Content Templates GET error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to get templates' 
    }, { status: 500 })
  }
}

/**
 * DELETE - Delete a template
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ 
        error: 'Template ID is required' 
      }, { status: 400 })
    }

    await db.execute({
      sql: `DELETE FROM content_templates 
            WHERE id = ? AND user_id = ?`,
      args: [id, user.userId]
    })

    return NextResponse.json({
      success: true,
      message: 'Template deleted'
    })
  } catch (error: any) {
    console.error('Content Templates DELETE error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to delete template' 
    }, { status: 500 })
  }
}

