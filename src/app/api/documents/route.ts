import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { canUseStorage, updateStorageUsage } from '@/lib/usageTracking'
import { getDocumentLimit, PlanType } from '@/lib/planLimits'

export const dynamic = 'force-dynamic'

/**
 * Documents API - Built-in document/notes storage
 * Creators can write and store all their content in CreatorFlow
 */

/**
 * POST - Create or update a document
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
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100),
        tags TEXT,
        is_pinned BOOLEAN DEFAULT FALSE,
        word_count INTEGER DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
      
      // Check if user_id column exists, if not add it
      try {
        await db.execute({ sql: `ALTER TABLE documents ADD COLUMN IF NOT EXISTS user_id VARCHAR(255)` })
      } catch (e: any) {
        // Column might already exist, ignore error
      }
    } catch (e: any) {
      console.error('Failed to create documents table:', e.message)
      // Continue anyway - table might already exist
    }

    const body = await request.json()
    const { id, title, content, category, tags, is_pinned } = body

    if (!title || !content) {
      return NextResponse.json({ 
        error: 'Title and content are required' 
      }, { status: 400 })
    }

    // Calculate word count
    const wordCount = content.trim().split(/\s+/).filter((word: string) => word.length > 0).length

    // Get user's plan to check limits
    const userResult = await db.execute({
      sql: 'SELECT subscription_tier FROM users WHERE id = ?',
      args: [user.userId]
    })
    const userPlan = (userResult.rows[0] as any)?.subscription_tier as PlanType | null

    if (id) {
      // Update existing document
      const result = await db.execute({
        sql: `
          UPDATE documents 
          SET title = ?, content = ?, category = ?, tags = ?, 
              is_pinned = ?, word_count = ?, updated_at = NOW()
          WHERE id = ? AND user_id = ?
          RETURNING *
        `,
        args: [
          title, 
          content, 
          category || null, 
          tags || null,
          is_pinned || false,
          wordCount,
          id, 
          user.userId
        ]
      })

      // Update storage usage
      await updateStorageUsage(user.userId)

      return NextResponse.json({
        success: true,
        document: result.rows[0]
      })
    } else {
      // Check document limit for new documents
      const docLimit = getDocumentLimit(userPlan)
      if (docLimit !== -1) {
        const currentDocs = await db.execute({
          sql: 'SELECT COUNT(*) as count FROM documents WHERE user_id = ?',
          args: [user.userId]
        })
        const currentCount = parseInt(currentDocs.rows[0]?.count || 0)
        if (currentCount >= docLimit) {
          return NextResponse.json({
            error: `You've reached your document limit (${currentCount}/${docLimit}). Upgrade to continue.`,
            current: currentCount,
            limit: docLimit,
            upgradeRequired: true
          }, { status: 403 })
        }
      }

      // Check storage limit
      const contentBytes = Buffer.byteLength(title + content, 'utf8')
      const storageCheck = await canUseStorage(user.userId, contentBytes)
      if (!storageCheck.allowed) {
        return NextResponse.json({
          error: storageCheck.message || 'Storage limit exceeded',
          currentMB: storageCheck.currentMB,
          limitMB: storageCheck.limitMB,
          upgradeRequired: true
        }, { status: 403 })
      }


      // Create new document
      const result = await db.execute({
        sql: `
          INSERT INTO documents 
          (user_id, title, content, category, tags, is_pinned, word_count, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          RETURNING *
        `,
        args: [
          user.userId, 
          title, 
          content, 
          category || null, 
          tags || null,
          is_pinned || false,
          wordCount
        ]
      })

      // Update storage usage
      await updateStorageUsage(user.userId)

      return NextResponse.json({
        success: true,
        document: result.rows[0]
      })
    }
  } catch (error: any) {
    console.error('Documents API error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to save document' 
    }, { status: 500 })
  }
}

/**
 * GET - Get documents (all, by category, search, or single document)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const pinned = searchParams.get('pinned')

    let sql = 'SELECT * FROM documents WHERE user_id = ?'
    const args: any[] = [user.userId]

    if (id) {
      sql += ' AND id = ?'
      args.push(id)
    } else if (category) {
      sql += ' AND category = ?'
      args.push(category)
    } else if (search) {
      sql += ' AND (title ILIKE ? OR content ILIKE ?)'
      const searchTerm = `%${search}%`
      args.push(searchTerm, searchTerm)
    }

    if (pinned === 'true') {
      sql += ' AND is_pinned = true'
    }

    sql += ' ORDER BY is_pinned DESC, updated_at DESC'

    const result = await db.execute({ sql, args })

    return NextResponse.json({
      success: true,
      documents: result.rows,
      count: result.rows.length
    })
  } catch (error: any) {
    console.error('Documents GET error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to get documents' 
    }, { status: 500 })
  }
}

/**
 * DELETE - Delete a document
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
        error: 'Document ID is required' 
      }, { status: 400 })
    }

    await db.execute({
      sql: `DELETE FROM documents 
            WHERE id = ? AND user_id = ?`,
      args: [id, user.userId]
    })

    return NextResponse.json({
      success: true,
      message: 'Document deleted'
    })
  } catch (error: any) {
    console.error('Documents DELETE error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to delete document' 
    }, { status: 500 })
  }
}

