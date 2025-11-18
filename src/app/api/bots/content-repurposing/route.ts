import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

/**
 * Content Repurposing Bot - Automatically repurpose content across platforms
 * Available for all tiers
 */

async function getUserPlanTier(userId: string): Promise<string> {
  try {
    const userResult = await db.execute({
      sql: 'SELECT subscription_tier FROM users WHERE id = ?',
      args: [userId]
    })
    if (userResult.rows.length === 0) return 'starter'
    const tier = (userResult.rows[0] as any).subscription_tier
    return tier || 'starter'
  } catch (error) {
    return 'starter'
  }
}

/**
 * POST - Repurpose content for different platforms
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // All tiers can use Content Repurposing Bot
    const tier = await getUserPlanTier(user.userId)

    const body = await request.json()
    const { originalContent, contentType, targetPlatforms } = body

    if (!originalContent || !contentType) {
      return NextResponse.json({ 
        error: 'Original content and content type are required' 
      }, { status: 400 })
    }

    const platforms = targetPlatforms || ['instagram', 'twitter', 'linkedin', 'tiktok', 'youtube']

    // Ensure table exists (fallback)
    try {
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS repurposed_content (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        original_content TEXT NOT NULL,
        original_type VARCHAR(50) NOT NULL,
        platform VARCHAR(50) NOT NULL,
        repurposed_content TEXT NOT NULL,
        format_type VARCHAR(50),
        character_count INTEGER,
        hashtags TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
    } catch (e) {}

    // Generate repurposed content for each platform
    const repurposedResults: any[] = []

    for (const platform of platforms) {
      let repurposed = ''
      let formatType = ''
      let hashtags = ''
      let characterCount = 0

      // Platform-specific repurposing logic
      switch (platform.toLowerCase()) {
        case 'instagram':
          // Instagram: Carousel post format
          repurposed = `📱 Instagram Carousel Post\n\n${originalContent.substring(0, 200)}...\n\n💡 Key Points:\n${originalContent.split('.').slice(0, 3).map((p, i) => `${i + 1}. ${p.trim()}`).join('\n')}\n\n✨ Call to Action: Check out the full content in our bio!`
          formatType = 'carousel'
          hashtags = '#content #creators #socialmedia #instagram'
          characterCount = repurposed.length
          break

        case 'twitter':
        case 'x':
          // Twitter: Thread format
          const sentences = originalContent.split('.').filter(s => s.trim().length > 10)
          const threadParts = sentences.slice(0, 5).map((s, i) => `${i + 1}/5 ${s.trim()}`)
          repurposed = threadParts.join('\n\n')
          formatType = 'thread'
          hashtags = '#ContentCreator #TwitterThread'
          characterCount = repurposed.length
          break

        case 'linkedin':
          // LinkedIn: Professional article format
          repurposed = `🚀 ${originalContent.substring(0, 100)}...\n\n${originalContent}\n\n💼 Key Takeaways:\n${originalContent.split('.').slice(0, 4).map((p, i) => `• ${p.trim()}`).join('\n')}\n\nWhat are your thoughts on this? Let's discuss in the comments! 👇`
          formatType = 'article'
          hashtags = '#LinkedIn #ProfessionalDevelopment #ContentCreation'
          characterCount = repurposed.length
          break

        case 'tiktok':
          // TikTok: Hook + main content format
          repurposed = `🎬 HOOK: "You won't believe this..."\n\n${originalContent.substring(0, 150)}...\n\n💥 The part that will blow your mind:\n${originalContent.split('.').slice(0, 2).join('.')}\n\nFollow for more! 👆`
          formatType = 'video-script'
          hashtags = '#fyp #contentcreator #viral #tiktok'
          characterCount = repurposed.length
          break

        case 'youtube':
          // YouTube: Video script format
          repurposed = `🎥 YouTube Video Script\n\n[INTRO - 0:00-0:15]\nHey everyone! Today we're diving into: ${originalContent.substring(0, 50)}...\n\n[MAIN CONTENT - 0:15-5:00]\n${originalContent}\n\n[KEY POINTS]\n${originalContent.split('.').slice(0, 5).map((p, i) => `${i + 1}. ${p.trim()}`).join('\n')}\n\n[OUTRO - 5:00-5:15]\nIf you found this helpful, smash that like button and subscribe for more!`
          formatType = 'video-script'
          hashtags = '#YouTube #ContentCreator #Tutorial'
          characterCount = repurposed.length
          break

        case 'pinterest':
          // Pinterest: Pin description format
          repurposed = `${originalContent.substring(0, 100)}...\n\n📌 Save this for later!\n\n${originalContent.split('.').slice(0, 3).map(p => `• ${p.trim()}`).join('\n')}`
          formatType = 'pin-description'
          hashtags = '#Pinterest #DIY #Tips #Ideas'
          characterCount = repurposed.length
          break

        default:
          // Generic format
          repurposed = originalContent
          formatType = 'generic'
          characterCount = repurposed.length
      }

      // Save repurposed content
      const result = await db.execute({
        sql: `
          INSERT INTO repurposed_content (
            user_id, original_content, original_type, platform, 
            repurposed_content, format_type, character_count, hashtags, created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
          RETURNING *
        `,
        args: [
          user.userId,
          originalContent,
          contentType,
          platform,
          repurposed,
          formatType,
          characterCount,
          hashtags
        ]
      })

      repurposedResults.push({
        platform,
        content: repurposed,
        formatType,
        characterCount,
        hashtags: hashtags.split(' ').filter(h => h.startsWith('#'))
      })
    }

    return NextResponse.json({
      success: true,
      originalContent,
      originalType: contentType,
      repurposed: repurposedResults,
      tier
    })
  } catch (error: any) {
    console.error('Content Repurposing Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to repurpose content' 
    }, { status: 500 })
  }
}

/**
 * GET - Get repurposed content history
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tier = await getUserPlanTier(user.userId)
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let sqlQuery = 'SELECT * FROM repurposed_content WHERE user_id = ?'
    const args: any[] = [user.userId]

    if (platform) {
      sqlQuery += ' AND platform = ?'
      args.push(platform)
    }

    sqlQuery += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    args.push(limit, offset)

    const result = await db.execute({ sql: sqlQuery, args })

    return NextResponse.json({
      success: true,
      repurposed: result.rows,
      tier
    })
  } catch (error: any) {
    console.error('Content Repurposing Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch repurposed content' 
    }, { status: 500 })
  }
}

