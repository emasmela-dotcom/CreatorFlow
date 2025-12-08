import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { checkBrandVoiceMatch } from '@/lib/brandVoice'

export const dynamic = 'force-dynamic'

/**
 * POST - Check if content matches brand voice
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const result = await checkBrandVoiceMatch(user.userId, content)

    return NextResponse.json({
      success: true,
      ...result
    })
  } catch (error: any) {
    console.error('Brand voice check error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check brand voice' },
      { status: 500 }
    )
  }
}

