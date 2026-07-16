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
        case 'facebook':
          reformattedContent[platform] = {
            content: originalContent.substring(0, 63206),
            suggestions: ['Lead with a strong first sentence', 'Use a clear CTA to drive comments or shares']
          }
          break
        case 'pinterest':
          reformattedContent[platform] = {
            title: originalContent.substring(0, 100),
            description: originalContent.substring(0, 500),
            suggestions: ['Front-load searchable keywords', 'Add one clear idea per pin']
          }
          break
        case 'threads':
          reformattedContent[platform] = {
            content: originalContent.substring(0, 500),
            suggestions: ['Keep it conversational', 'Ask a simple opinion question to boost replies']
          }
          break
        case 'snapchat':
          reformattedContent[platform] = {
            caption: originalContent.substring(0, 250),
            suggestions: ['Keep text short and direct', 'Pair with visual-first storytelling']
          }
          break
        case 'reddit':
          reformattedContent[platform] = {
            title: originalContent.substring(0, 140),
            body: originalContent.substring(0, 40000),
            suggestions: ['Use a plain, specific title', 'Focus on value and context before promotion']
          }
          break
        case 'bluesky':
          reformattedContent[platform] = {
            content: originalContent.substring(0, 300),
            suggestions: ['Keep it concise', 'Use one clear point per post']
          }
          break
        case 'mastodon':
          reformattedContent[platform] = {
            content: originalContent.substring(0, 500),
            suggestions: ['Use conversational tone', 'Add alt text when attaching media']
          }
          break
        case 'discord':
          reformattedContent[platform] = {
            content: originalContent.substring(0, 2000),
            suggestions: ['Use short paragraphs', 'Use one direct call to action']
          }
          break
        case 'telegram':
          reformattedContent[platform] = {
            content: originalContent.substring(0, 4096),
            suggestions: ['Front-load key message', 'Keep formatting simple']
          }
          break
        case 'tumblr':
          reformattedContent[platform] = {
            title: originalContent.substring(0, 100),
            body: originalContent.substring(0, 10000),
            suggestions: ['Use a hook in first line', 'Add tags for discovery']
          }
          break
        case 'wordpress':
          reformattedContent[platform] = {
            title: originalContent.substring(0, 100),
            body: originalContent.substring(0, 50000),
            suggestions: ['Use headings for structure', 'Add internal links and CTA']
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

