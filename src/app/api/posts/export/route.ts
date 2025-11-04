import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { enforceContentLock } from '@/lib/contentLockCheck'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

/**
 * Export posts - ENFORCES LOCK
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let userId: string
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
      userId = decoded.userId
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { postIds, format = 'json' } = await request.json()

    if (!Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json({ error: 'Post IDs array is required' }, { status: 400 })
    }

    // Check locks on all posts
    for (const postId of postIds) {
      try {
        await enforceContentLock(postId, userId)
      } catch (lockError: any) {
        return NextResponse.json({ 
          error: `Cannot export post ${postId}: ${lockError.message}`,
          code: 'CONTENT_LOCKED',
          upgradeRequired: true
        }, { status: 403 })
      }
    }

    // Get posts
    const placeholders = postIds.map(() => '?').join(',')
    const postsResult = await db.execute({
      sql: `SELECT * FROM content_posts WHERE id IN (${placeholders}) AND user_id = ?`,
      args: [...postIds, userId]
    })

    if (postsResult.rows.length === 0) {
      return NextResponse.json({ error: 'No posts found' }, { status: 404 })
    }

    // Format export
    if (format === 'csv') {
      const csv = convertToCSV(postsResult.rows)
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="creatorflow-export-${Date.now()}.csv"`
        }
      })
    } else {
      return NextResponse.json({
        posts: postsResult.rows,
        exportedAt: new Date().toISOString(),
        count: postsResult.rows.length
      })
    }
  } catch (error: any) {
    console.error('Export posts error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to export posts' 
    }, { status: 500 })
  }
}

function convertToCSV(posts: any[]): string {
  const headers = ['ID', 'Platform', 'Content', 'Status', 'Scheduled At', 'Published At', 'Created At']
  const rows = posts.map(post => [
    post.id,
    post.platform,
    post.content?.replace(/"/g, '""') || '',
    post.status,
    post.scheduled_at || '',
    post.published_at || '',
    post.created_at
  ])

  const csvRows = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ]

  return csvRows.join('\n')
}
