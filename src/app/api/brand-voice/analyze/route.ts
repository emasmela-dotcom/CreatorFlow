import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { analyzeBrandVoice, saveBrandVoiceProfile } from '@/lib/brandVoice'

export const dynamic = 'force-dynamic'

/**
 * GET - Analyze brand voice
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await analyzeBrandVoice(user.userId)
    await saveBrandVoiceProfile(user.userId, profile)

    return NextResponse.json({
      success: true,
      profile
    })
  } catch (error: any) {
    console.error('Brand voice analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze brand voice' },
      { status: 500 }
    )
  }
}

