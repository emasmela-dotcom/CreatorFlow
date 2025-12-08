import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * POST - Submit feedback
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      feedbackType,
      category,
      message,
      rating,
      userEmail,
      canContact
    } = body

    // Validate required fields
    if (!feedbackType || !message || !message.trim()) {
      return NextResponse.json(
        { error: 'Feedback type and message are required' },
        { status: 400 }
      )
    }

    // Validate feedback type
    const validTypes = ['bug', 'feature', 'general', 'praise', 'other']
    if (!validTypes.includes(feedbackType)) {
      return NextResponse.json(
        { error: 'Invalid feedback type' },
        { status: 400 }
      )
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Insert feedback
    const result = await db.execute({
      sql: `
        INSERT INTO user_feedback (
          user_id, feedback_type, category, message, rating,
          user_email, can_contact, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'new')
        RETURNING id
      `,
      args: [
        user.userId,
        feedbackType,
        category || null,
        message.trim(),
        rating || null,
        userEmail || null,
        canContact || false
      ]
    })

    const feedbackId = (result.rows[0] as any).id

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback! We appreciate you helping us improve CreatorFlow.',
      feedbackId
    })
  } catch (error: any) {
    console.error('Feedback submission error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}

/**
 * GET - Get user's feedback (optional - for users to see their submitted feedback)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const result = await db.execute({
      sql: `
        SELECT 
          id, feedback_type, category, message, rating, status,
          created_at, updated_at
        FROM user_feedback
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?
      `,
      args: [user.userId, limit]
    })

    return NextResponse.json({
      success: true,
      feedback: result.rows
    })
  } catch (error: any) {
    console.error('Error getting feedback:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get feedback' },
      { status: 500 }
    )
  }
}

