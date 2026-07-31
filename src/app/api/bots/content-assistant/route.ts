import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { canMakeAICall, logAICall } from '@/lib/usageTracking'
import { callLLM } from '@/lib/ai/llm'

/**
 * Content Assistant Bot - Real-time content analysis
 * FREE for all users, performance scales with plan tier
 * Serverless function - spins up on demand, shuts down when done
 */

interface BotAnalysis {
  score: number // 0-100
  status: 'good' | 'warning' | 'needs-work'
  suggestions: Array<{
    type: 'length' | 'hashtags' | 'tone' | 'engagement' | 'grammar' | 'platform'
    priority: 'high' | 'medium' | 'low'
    message: string
    actionable: string // What user should do
  }>
  metrics: {
    length: number
    hashtagCount: number
    wordCount: number
    emojiCount: number
  }
}

/**
 * Get user's plan tier for bot performance scaling
 */
async function getUserPlanTier(userId: string): Promise<string> {
  try {
    const userResult = await db.execute({
      sql: 'SELECT subscription_tier FROM users WHERE id = ?',
      args: [userId]
    })

    if (userResult.rows.length === 0) {
      return 'starter'
    }

    const tier = (userResult.rows[0] as any).subscription_tier
    return tier || 'starter'
  } catch (error) {
    return 'starter'
  }
}

/**
 * Get bot performance level based on plan tier
 */
function getBotPerformanceLevel(tier: string): 'basic' | 'enhanced' | 'ai' | 'advanced' | 'premium' {
  switch (tier) {
    case 'starter':
      return 'basic'
    case 'growth':
      return 'enhanced'
    case 'pro':
      return 'ai'
    case 'business':
      return 'advanced'
    case 'agency':
      return 'premium'
    default:
      return 'basic'
  }
}

/**
 * Analyze content - Rule-based (FREE, works for all tiers)
 */
function analyzeContentBasic(content: string, platform: string, hashtags: string): BotAnalysis {
  const hashtagList = hashtags.split(/\s+/).filter(h => h.trim().startsWith('#'))
  const hashtagCount = hashtagList.length
  const wordCount = content.split(/\s+/).filter(w => w.trim()).length
  const emojiCount = (content.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length
  
  const suggestions: BotAnalysis['suggestions'] = []
  let score = 100

  // Platform-specific length checks
  const platformLimits: Record<string, number> = {
    twitter: 280,
    instagram: 2200,
    linkedin: 3000,
    tiktok: 2200,
    youtube: 5000
  }

  const limit = platformLimits[platform.toLowerCase()] || 280
  
  // Length analysis
  if (content.length > limit) {
    score -= 30
    suggestions.push({
      type: 'length',
      priority: 'high',
      message: `Content is ${content.length} characters, exceeds ${platform} limit of ${limit}`,
      actionable: `Shorten by ${content.length - limit} characters`
    })
  } else if (content.length < 50) {
    score -= 15
    suggestions.push({
      type: 'length',
      priority: 'medium',
      message: 'Content is quite short. Consider adding more detail.',
      actionable: 'Add 2-3 more sentences to improve engagement'
    })
  }

  // Hashtag analysis
  const optimalHashtags: Record<string, { min: number; max: number }> = {
    instagram: { min: 5, max: 10 },
    twitter: { min: 1, max: 3 },
    linkedin: { min: 3, max: 5 },
    tiktok: { min: 3, max: 5 },
    youtube: { min: 3, max: 5 }
  }

  const hashtagRange = optimalHashtags[platform.toLowerCase()] || { min: 3, max: 5 }
  
  if (hashtagCount < hashtagRange.min) {
    score -= 10
    suggestions.push({
      type: 'hashtags',
      priority: 'medium',
      message: `Only ${hashtagCount} hashtag(s). ${platform} typically performs better with ${hashtagRange.min}-${hashtagRange.max} hashtags.`,
      actionable: `Add ${hashtagRange.min - hashtagCount} more relevant hashtags`
    })
  } else if (hashtagCount > hashtagRange.max) {
    score -= 5
    suggestions.push({
      type: 'hashtags',
      priority: 'low',
      message: `${hashtagCount} hashtags may be too many. Consider using ${hashtagRange.max} or fewer.`,
      actionable: `Remove ${hashtagCount - hashtagRange.max} hashtags for better focus`
    })
  }

  // Engagement checks
  if (wordCount < 10) {
    score -= 10
    suggestions.push({
      type: 'engagement',
      priority: 'medium',
      message: 'Very short content may not engage well',
      actionable: 'Add a question or call-to-action to encourage engagement'
    })
  }

  // Check for call-to-action
  const ctaKeywords = ['click', 'link', 'comment', 'share', 'follow', 'check', 'visit', 'learn']
  const hasCTA = ctaKeywords.some(keyword => content.toLowerCase().includes(keyword))
  
  if (!hasCTA && wordCount > 20) {
    score -= 5
    suggestions.push({
      type: 'engagement',
      priority: 'low',
      message: 'No clear call-to-action found',
      actionable: 'Add a question or invitation to engage (e.g., "What do you think?")'
    })
  }

  // Determine status
  let status: 'good' | 'warning' | 'needs-work' = 'good'
  if (score < 70) {
    status = 'needs-work'
  } else if (score < 85) {
    status = 'warning'
  }

  return {
    score: Math.max(0, score),
    status,
    suggestions,
    metrics: {
      length: content.length,
      hashtagCount,
      wordCount,
      emojiCount
    }
  }
}

/**
 * Enhanced analysis (Growth tier and above)
 */
function analyzeContentEnhanced(content: string, platform: string, hashtags: string, userContentHistory?: any[]): BotAnalysis {
  const basic = analyzeContentBasic(content, platform, hashtags)
  
  // Enhanced checks for Growth+ tiers
  // Check for common mistakes
  if (content.includes('  ')) {
    basic.suggestions.push({
      type: 'grammar',
      priority: 'low',
      message: 'Double spaces detected',
      actionable: 'Remove extra spaces for cleaner formatting'
    })
    basic.score -= 2
  }

  // Check capitalization consistency
  const firstChar = content.trim().charAt(0)
  if (firstChar && firstChar === firstChar.toLowerCase() && firstChar.match(/[a-z]/)) {
    basic.suggestions.push({
      type: 'grammar',
      priority: 'low',
      message: 'Consider starting with a capital letter',
      actionable: 'Capitalize the first letter'
    })
    basic.score -= 3
  }

  // Recalculate status
  if (basic.score < 70) {
    basic.status = 'needs-work'
  } else if (basic.score < 85) {
    basic.status = 'warning'
  }

  return basic
}

/**
 * Analyze content with live AI when keys are configured
 */
async function analyzeContentWithLLM(
  content: string,
  platform: string,
  hashtags: string,
  userId: string
): Promise<
  | { ok: true; analysis: BotAnalysis; provider: 'groq' | 'grok' | 'openai' }
  | { ok: false; code: 'NOT_CONFIGURED' | 'PROVIDER_ERROR' | 'USAGE_LIMIT' | 'PARSE_ERROR'; error?: string }
> {
  const result = await callLLM({
    messages: [
      {
        role: 'system',
        content:
          'You are a content analyst for CreatorFlow365. Analyze the user\'s existing post — do not rewrite it or invent facts. Return ONLY valid JSON with this exact shape: {"score":number,"status":"good"|"warning"|"needs-work","suggestions":[{"type":"length"|"hashtags"|"tone"|"engagement"|"grammar"|"platform","priority":"high"|"medium"|"low","message":string,"actionable":string}],"metrics":{"length":number,"hashtagCount":number,"wordCount":number,"emojiCount":number}}',
      },
      {
        role: 'user',
        content: `Platform: ${platform}\nHashtags: ${hashtags || 'none'}\n\nContent:\n${content}`,
      },
    ],
    userId,
    temperature: 0.3,
    maxTokens: 1500,
  })

  if (!result.ok) {
    return { ok: false, code: result.code, error: result.error }
  }

  try {
    const cleaned = result.text.replace(/```json\n?|\n?```/g, '').trim()
    const parsed = JSON.parse(cleaned) as BotAnalysis
    if (
      typeof parsed.score === 'number' &&
      Array.isArray(parsed.suggestions) &&
      parsed.metrics &&
      typeof parsed.metrics.length === 'number'
    ) {
      return { ok: true, analysis: parsed, provider: result.provider }
    }
  } catch {
    // fall through
  }

  return { ok: false, code: 'PARSE_ERROR', error: 'AI returned an invalid analysis format.' }
}

/**
 * AI-powered analysis (Pro tier and above)
 * Uses live LLM when configured, otherwise falls back to enhanced rules
 */
async function analyzeContentAI(
  content: string,
  platform: string,
  hashtags: string,
  performanceLevel: string,
  userId: string
): Promise<{ analysis: BotAnalysis; aiMode: 'template' | 'live'; provider?: 'groq' | 'grok' | 'openai' }> {
  const llm = await analyzeContentWithLLM(content, platform, hashtags, userId)
  if (llm.ok) {
    return { analysis: llm.analysis, aiMode: 'live', provider: llm.provider }
  }

  if (llm.code === 'NOT_CONFIGURED' || llm.code === 'PARSE_ERROR') {
    return { analysis: analyzeContentEnhanced(content, platform, hashtags), aiMode: 'template' }
  }

  throw new Error(llm.error || 'AI analysis failed')
}

/**
 * POST - Analyze content in real-time
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, platform, hashtags } = body

    if (!content || !platform) {
      return NextResponse.json({ error: 'Content and platform are required' }, { status: 400 })
    }

    // Check AI call limit
    const limitCheck = await canMakeAICall(user.userId)
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: limitCheck.message || 'AI call limit exceeded',
        current: limitCheck.current,
        limit: limitCheck.limit,
        upgradeRequired: true
      }, { status: 403 })
    }

    // Get user's plan tier
    const tier = await getUserPlanTier(user.userId)
    const performanceLevel = getBotPerformanceLevel(tier)

    // Analyze based on tier
    let analysis: BotAnalysis
    let aiMode: 'template' | 'live' = 'template'
    let aiProvider: 'groq' | 'grok' | 'openai' | undefined

    if (performanceLevel === 'basic') {
      analysis = analyzeContentBasic(content, platform, hashtags || '')
    } else if (performanceLevel === 'enhanced') {
      analysis = analyzeContentEnhanced(content, platform, hashtags || '')
    } else {
      const aiResult = await analyzeContentAI(
        content,
        platform,
        hashtags || '',
        performanceLevel,
        user.userId
      )
      analysis = aiResult.analysis
      aiMode = aiResult.aiMode
      aiProvider = aiResult.provider
    }

    // Log the AI call
    await logAICall(user.userId, 'Content Assistant', '/api/bots/content-assistant')

    return NextResponse.json({
      success: true,
      analysis,
      tier,
      performanceLevel,
      aiMode,
      ...(aiProvider ? { provider: aiProvider } : {}),
      usage: {
        aiCalls: {
          current: limitCheck.current + 1,
          limit: limitCheck.limit
        }
      }
    })
  } catch (error: any) {
    console.error('Content Assistant Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to analyze content' 
    }, { status: 500 })
  }
}

