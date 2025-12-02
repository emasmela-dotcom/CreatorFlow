import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

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

    const body = await request.json()
    const { id, name, platform, content, variables, category, description } = body

    if (!name || !content) {
      return NextResponse.json({ 
        error: 'Name and content are required' 
      }, { status: 400 })
    }

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

      return NextResponse.json({
        success: true,
        template: result.rows[0]
      })
    } else {
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

