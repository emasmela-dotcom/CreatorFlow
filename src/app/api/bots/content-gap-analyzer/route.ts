import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

/**
 * Content Gap Analyzer Bot - Identify content opportunities your competitors are missing
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
 * POST - Analyze content gaps
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // All tiers can use Content Gap Analyzer Bot
    const tier = await getUserPlanTier(user.userId)

    const body = await request.json()
    const { 
      competitorTopics, 
      competitorFormats, 
      yourTopics, 
      yourFormats,
      niche,
      targetAudience 
    } = body

    if (!competitorTopics || competitorTopics.length === 0) {
      return NextResponse.json({ 
        error: 'At least one competitor topic is required' 
      }, { status: 400 })
    }

    // Ensure tables exist (fallback)
    try {
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS content_gap_analysis (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        niche VARCHAR(255),
        target_audience TEXT,
        competitor_topics TEXT,
        your_topics TEXT,
        gap_topics TEXT,
        recommended_formats TEXT,
        priority_score INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
      
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS content_gap_suggestions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        analysis_id INTEGER,
        topic VARCHAR(255) NOT NULL,
        format_type VARCHAR(50),
        angle TEXT,
        priority_score INTEGER,
        reason TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
    } catch (e) {}

    // Analyze gaps
    const competitorTopicsSet = new Set(competitorTopics.map((t: string) => t.toLowerCase().trim()))
    const yourTopicsSet = new Set((yourTopics || []).map((t: string) => t.toLowerCase().trim()))
    
    // Find topics competitors cover but you don't
    const gapTopics = competitorTopics.filter((topic: string) => 
      !yourTopicsSet.has(topic.toLowerCase().trim())
    )

    // Find topics you cover but competitors don't (your unique advantage)
    const yourUniqueTopics = (yourTopics || []).filter((topic: string) => 
      !competitorTopicsSet.has(topic.toLowerCase().trim())
    )

    // Analyze format gaps
    const competitorFormatsSet = new Set((competitorFormats || []).map((f: string) => f.toLowerCase().trim()))
    const yourFormatsSet = new Set((yourFormats || []).map((f: string) => f.toLowerCase().trim()))
    
    const formatGaps = (competitorFormats || []).filter((format: string) => 
      !yourFormatsSet.has(format.toLowerCase().trim())
    )

    // Generate content suggestions with priority scores
    const suggestions = gapTopics.map((topic: string, index: number) => {
      // Priority based on how many competitors cover it and how unique it is
      const priorityScore = Math.min(90, 50 + (gapTopics.length - index) * 5)
      
      // Recommend best format based on topic keywords
      let recommendedFormat = 'blog-post'
      const topicLower = topic.toLowerCase()
      if (topicLower.includes('how to') || topicLower.includes('tutorial') || topicLower.includes('guide')) {
        recommendedFormat = 'video-tutorial'
      } else if (topicLower.includes('review') || topicLower.includes('comparison')) {
        recommendedFormat = 'comparison-post'
      } else if (topicLower.includes('news') || topicLower.includes('update')) {
        recommendedFormat = 'news-article'
      } else if (topicLower.includes('tips') || topicLower.includes('hacks')) {
        recommendedFormat = 'tips-carousel'
      } else if (formatGaps.length > 0) {
        recommendedFormat = formatGaps[0]
      }

      // Generate angle suggestions
      const angles = [
        `Beginner-friendly approach to ${topic}`,
        `${topic} from a unique perspective`,
        `Advanced strategies for ${topic}`,
        `${topic} mistakes to avoid`,
        `Quick wins with ${topic}`
      ]

      return {
        topic,
        format: recommendedFormat,
        angle: angles[index % angles.length],
        priorityScore,
        reason: `Competitors are covering this but you haven't yet. High engagement potential.`
      }
    })

    // Sort by priority
    suggestions.sort((a: any, b: any) => b.priorityScore - a.priorityScore)

    // Save analysis
    const analysisResult = await db.execute({
      sql: `
        INSERT INTO content_gap_analysis (
          user_id, niche, target_audience, competitor_topics, your_topics,
          gap_topics, recommended_formats, priority_score, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        RETURNING *
      `,
      args: [
        user.userId,
        niche || null,
        targetAudience || null,
        JSON.stringify(competitorTopics),
        JSON.stringify(yourTopics || []),
        JSON.stringify(gapTopics),
        JSON.stringify(formatGaps),
        suggestions.length > 0 ? suggestions[0].priorityScore : 0
      ]
    })

    const analysisId = analysisResult.rows[0]?.id

    // Save suggestions
    for (const suggestion of suggestions) {
      await db.execute({
        sql: `
          INSERT INTO content_gap_suggestions (
            user_id, analysis_id, topic, format_type, angle, priority_score, reason, created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `,
        args: [
          user.userId,
          analysisId,
          suggestion.topic,
          suggestion.format,
          suggestion.angle,
          suggestion.priorityScore,
          suggestion.reason
        ]
      })
    }

    return NextResponse.json({
      success: true,
      analysis: {
        id: analysisId,
        niche: niche || 'General',
        totalCompetitorTopics: competitorTopics.length,
        yourTopicsCount: (yourTopics || []).length,
        gapCount: gapTopics.length,
        uniqueAdvantageCount: yourUniqueTopics.length
      },
      gaps: {
        topics: gapTopics,
        formats: formatGaps,
        yourUniqueTopics
      },
      suggestions: suggestions.slice(0, 10), // Top 10 suggestions
      insights: [
        `You're missing ${gapTopics.length} topics that competitors are covering`,
        `You have ${yourUniqueTopics.length} unique topics that competitors aren't covering - leverage these!`,
        formatGaps.length > 0 ? `Consider trying these formats: ${formatGaps.join(', ')}` : `You're covering all the formats competitors use`,
        `Priority focus: ${suggestions[0]?.topic || 'No gaps found'}`
      ],
      tier
    })
  } catch (error: any) {
    console.error('Content Gap Analyzer Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to analyze content gaps' 
    }, { status: 500 })
  }
}

/**
 * GET - Get content gap analysis history
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tier = await getUserPlanTier(user.userId)
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const result = await db.execute({
      sql: `
        SELECT * FROM content_gap_analysis 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `,
      args: [user.userId, limit, offset]
    })

    // Get suggestions for each analysis
    const analysesWithSuggestions = await Promise.all(
      result.rows.map(async (analysis: any) => {
        const suggestionsResult = await db.execute({
          sql: `
            SELECT * FROM content_gap_suggestions 
            WHERE user_id = ? AND analysis_id = ?
            ORDER BY priority_score DESC
          `,
          args: [user.userId, analysis.id]
        })
        return {
          ...analysis,
          suggestions: suggestionsResult.rows
        }
      })
    )

    return NextResponse.json({
      success: true,
      analyses: analysesWithSuggestions,
      tier
    })
  } catch (error: any) {
    console.error('Content Gap Analyzer Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch content gap analysis' 
    }, { status: 500 })
  }
}

