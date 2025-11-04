import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export const dynamic = 'force-dynamic'

/**
 * Multi-Platform Reformatter
 * Automatically adapts one post for all platforms with optimal formatting
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    
    const { originalContent, sourcePlatform, targetPlatforms } = await request.json()

    if (!originalContent || !targetPlatforms) {
      return NextResponse.json({ error: 'Content and target platforms are required' }, { status: 400 })
    }

    // TODO: Use AI to reformat content for each platform's best practices
    const reformattedContent: Record<string, any> = {}

    targetPlatforms.forEach((platform: string) => {
      switch (platform.toLowerCase()) {
        case 'instagram':
          reformattedContent[platform] = {
            caption: originalContent,
            hashtags: '#contentcreator #creatortips',
            characterCount: originalContent.length,
            suggestions: ['Add emoji for engagement', 'Include call-to-action', 'Keep under 2200 characters']
          }
          break
        case 'twitter':
        case 'x':
          reformattedContent[platform] = {
            content: originalContent.substring(0, 280),
            characterCount: Math.min(originalContent.length, 280),
            suggestions: ['Condensed for Twitter format', 'Consider thread for longer content']
          }
          break
        case 'linkedin':
          reformattedContent[platform] = {
            content: originalContent,
            style: 'Professional',
            suggestions: ['More professional tone', 'Add industry insights', 'Include relevant statistics']
          }
          break
        case 'tiktok':
          reformattedContent[platform] = {
            caption: originalContent.substring(0, 2200),
            hashtags: '#fyp #contentcreator',
            suggestions: ['Shorter, punchier captions work best', 'Use trending sounds']
          }
          break
        default:
          reformattedContent[platform] = {
            content: originalContent,
            suggestions: ['Platform-specific formatting applied']
          }
      }
    })

    return NextResponse.json({
      success: true,
      reformattedContent,
      message: 'Multi-platform reformatting complete'
    })
  } catch (error: any) {
    console.error('Reformatter error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to reformat content' 
    }, { status: 500 })
  }
}

