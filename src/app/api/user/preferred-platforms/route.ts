import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

/**
 * Get user's preferred platforms
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await db.execute({
      sql: 'SELECT preferred_platforms FROM users WHERE id = ?',
      args: [user.userId]
    })

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const preferredPlatforms = result.rows[0].preferred_platforms
      ? JSON.parse(result.rows[0].preferred_platforms as string)
      : []

    return NextResponse.json({ preferredPlatforms })
  } catch (error: any) {
    console.error('Get preferred platforms error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to get preferred platforms' 
    }, { status: 500 })
  }
}

/**
 * Update user's preferred platforms
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { preferredPlatforms } = await request.json()

    if (!Array.isArray(preferredPlatforms)) {
      return NextResponse.json({ error: 'preferredPlatforms must be an array' }, { status: 400 })
    }

    // Validate platforms
    const validPlatforms = ['instagram', 'twitter', 'linkedin', 'tiktok', 'youtube']
    const invalidPlatforms = preferredPlatforms.filter((p: string) => !validPlatforms.includes(p.toLowerCase()))
    
    if (invalidPlatforms.length > 0) {
      return NextResponse.json({ 
        error: `Invalid platforms: ${invalidPlatforms.join(', ')}. Valid platforms: ${validPlatforms.join(', ')}` 
      }, { status: 400 })
    }

    // Update user's preferred platforms
    await db.execute({
      sql: 'UPDATE users SET preferred_platforms = ?, updated_at = ? WHERE id = ?',
      args: [JSON.stringify(preferredPlatforms), new Date().toISOString(), user.userId]
    })

    return NextResponse.json({ 
      success: true,
      message: 'Preferred platforms updated successfully',
      preferredPlatforms
    })
  } catch (error: any) {
    console.error('Update preferred platforms error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to update preferred platforms' 
    }, { status: 500 })
  }
}

