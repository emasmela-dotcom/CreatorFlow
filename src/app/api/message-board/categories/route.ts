import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { getDefaultCategories } from '@/lib/messageBoard'

export const dynamic = 'force-dynamic'

/**
 * GET - Get all categories
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categories = await getDefaultCategories()

    return NextResponse.json({
      success: true,
      categories
    })
  } catch (error: any) {
    console.error('Categories error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get categories' },
      { status: 500 }
    )
  }
}

