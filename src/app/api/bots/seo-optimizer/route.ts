import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { canMakeAICall, logAICall } from '@/lib/usageTracking'

/**
 * SEO Optimizer Bot - AI-powered SEO content optimization
 * Available for all tiers, performance scales with plan tier
 */

interface SEOAnalysis {
  seoScore: number // 0-100
  status: 'excellent' | 'good' | 'needs-improvement' | 'poor'
  keywordAnalysis: {
    primaryKeyword: string
    keywordDensity: number
    keywordPlacement: {
      inTitle: boolean
      inFirstParagraph: boolean
      inHeadings: boolean
      inMeta: boolean
    }
    keywordSuggestions: string[]
  }
  contentOptimization: {
    title: {
      current: string
      suggested: string
      length: number
      optimalLength: number
    }
    metaDescription: {
      current: string
      suggested: string
      length: number
      optimalLength: number
    }
    headings: {
      hasH1: boolean
      hasH2: boolean
      headingCount: number
      suggestions: string[]
    }
    contentLength: {
      current: number
      optimal: number
      status: 'too-short' | 'optimal' | 'too-long'
    }
    readability: {
      score: number
      level: 'easy' | 'medium' | 'hard'
      suggestions: string[]
    }
  }
  technicalSEO: {
    internalLinks: number
    externalLinks: number
    imageAltText: boolean
    suggestions: string[]
  }
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low'
    category: 'keyword' | 'content' | 'technical' | 'meta'
    issue: string
    suggestion: string
    actionable: string
  }>
}

/**
 * Get user's plan tier
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
 * Basic SEO analysis (all tiers)
 */
function analyzeSEOBasic(
  content: string,
  title: string,
  metaDescription: string,
  primaryKeyword: string
): SEOAnalysis {
  const wordCount = content.split(/\s+/).filter(w => w.trim()).length
  const recommendations: SEOAnalysis['recommendations'] = []
  let seoScore = 100

  // Extract headings from content
  const h1Matches = content.match(/^#\s+(.+)$/gm) || []
  const h2Matches = content.match(/^##\s+(.+)$/gm) || []
  const hasH1 = h1Matches.length > 0
  const hasH2 = h2Matches.length > 0
  const headingCount = h1Matches.length + h2Matches.length

  // Keyword analysis
  const keywordLower = primaryKeyword.toLowerCase()
  const contentLower = content.toLowerCase()
  const titleLower = title.toLowerCase()
  const metaLower = metaDescription.toLowerCase()

  const keywordCount = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length
  const keywordDensity = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0

  // Keyword placement
  const keywordPlacement = {
    inTitle: titleLower.includes(keywordLower),
    inFirstParagraph: contentLower.substring(0, 200).includes(keywordLower),
    inHeadings: (h1Matches.join(' ') + ' ' + h2Matches.join(' ')).toLowerCase().includes(keywordLower),
    inMeta: metaLower.includes(keywordLower)
  }

  // Title analysis
  const titleLength = title.length
  const optimalTitleLength = 50-60
  let titleStatus: 'too-short' | 'optimal' | 'too-long' = 'optimal'
  
  if (titleLength < 30) {
    titleStatus = 'too-short'
    seoScore -= 10
    recommendations.push({
      priority: 'high',
      category: 'meta',
      issue: 'Title is too short',
      suggestion: 'Add more descriptive words to your title',
      actionable: `Expand title to ${optimalTitleLength} characters for better SEO`
    })
  } else if (titleLength > 60) {
    titleStatus = 'too-long'
    seoScore -= 5
    recommendations.push({
      priority: 'medium',
      category: 'meta',
      issue: 'Title is too long',
      suggestion: 'Shorten title to avoid truncation in search results',
      actionable: `Reduce title to ${optimalTitleLength} characters`
    })
  }

  if (!keywordPlacement.inTitle) {
    seoScore -= 15
    recommendations.push({
      priority: 'high',
      category: 'keyword',
      issue: 'Primary keyword not in title',
      suggestion: 'Include primary keyword in title',
      actionable: `Add "${primaryKeyword}" to your title`
    })
  }

  // Meta description analysis
  const metaLength = metaDescription.length
  const optimalMetaLength = 150-160
  
  if (metaLength < 120) {
    seoScore -= 10
    recommendations.push({
      priority: 'high',
      category: 'meta',
      issue: 'Meta description is too short',
      suggestion: 'Expand meta description for better click-through rates',
      actionable: `Expand meta description to ${optimalMetaLength} characters`
    })
  } else if (metaLength > 160) {
    seoScore -= 5
    recommendations.push({
      priority: 'medium',
      category: 'meta',
      issue: 'Meta description is too long',
      suggestion: 'Shorten meta description to avoid truncation',
      actionable: `Reduce meta description to ${optimalMetaLength} characters`
    })
  }

  if (!keywordPlacement.inMeta) {
    seoScore -= 10
    recommendations.push({
      priority: 'high',
      category: 'keyword',
      issue: 'Primary keyword not in meta description',
      suggestion: 'Include primary keyword in meta description',
      actionable: `Add "${primaryKeyword}" to your meta description`
    })
  }

  // Content length analysis
  const optimalContentLength = 1000-2000
  let contentLengthStatus: 'too-short' | 'optimal' | 'too-long' = 'optimal'
  
  if (wordCount < 300) {
    contentLengthStatus = 'too-short'
    seoScore -= 20
    recommendations.push({
      priority: 'high',
      category: 'content',
      issue: 'Content is too short',
      suggestion: 'Longer content typically ranks better',
      actionable: `Expand content to at least ${optimalContentLength} words`
    })
  } else if (wordCount > 3000) {
    contentLengthStatus = 'too-long'
    seoScore -= 5
    recommendations.push({
      priority: 'low',
      category: 'content',
      issue: 'Content is very long',
      suggestion: 'Consider breaking into multiple pages or sections',
      actionable: 'Split content into multiple articles or add table of contents'
    })
  }

  // Keyword density
  if (keywordDensity < 0.5) {
    seoScore -= 10
    recommendations.push({
      priority: 'medium',
      category: 'keyword',
      issue: 'Keyword density too low',
      suggestion: 'Use primary keyword more naturally throughout content',
      actionable: `Increase keyword usage to 1-2% density (currently ${keywordDensity.toFixed(2)}%)`
    })
  } else if (keywordDensity > 3) {
    seoScore -= 15
    recommendations.push({
      priority: 'high',
      category: 'keyword',
      issue: 'Keyword density too high (keyword stuffing)',
      suggestion: 'Reduce keyword usage to avoid penalties',
      actionable: `Reduce keyword usage to 1-2% density (currently ${keywordDensity.toFixed(2)}%)`
    })
  }

  // Heading analysis
  if (!hasH1) {
    seoScore -= 10
    recommendations.push({
      priority: 'high',
      category: 'content',
      issue: 'No H1 heading found',
      suggestion: 'Add an H1 heading with your primary keyword',
      actionable: 'Add # Primary Keyword Heading at the top of your content'
    })
  }

  if (!hasH2 && wordCount > 500) {
    seoScore -= 5
    recommendations.push({
      priority: 'medium',
      category: 'content',
      issue: 'No H2 headings found',
      suggestion: 'Add H2 headings to structure your content',
      actionable: 'Add ## Subheading sections to organize your content'
    })
  }

  // First paragraph keyword check
  if (!keywordPlacement.inFirstParagraph) {
    seoScore -= 10
    recommendations.push({
      priority: 'high',
      category: 'keyword',
      issue: 'Primary keyword not in first paragraph',
      suggestion: 'Include primary keyword early in your content',
      actionable: `Add "${primaryKeyword}" to your first paragraph`
    })
  }

  // Readability (basic - Flesch Reading Ease approximation)
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0
  const avgCharsPerWord = wordCount > 0 ? content.replace(/\s/g, '').length / wordCount : 0
  
  let readabilityScore = 100
  let readabilityLevel: 'easy' | 'medium' | 'hard' = 'easy'
  
  if (avgWordsPerSentence > 20) {
    readabilityScore -= 20
    readabilityLevel = 'hard'
    recommendations.push({
      priority: 'medium',
      category: 'content',
      issue: 'Sentences are too long',
      suggestion: 'Break up long sentences for better readability',
      actionable: 'Split sentences longer than 20 words into shorter ones'
    })
  } else if (avgWordsPerSentence > 15) {
    readabilityScore -= 10
    readabilityLevel = 'medium'
  }

  if (avgCharsPerWord > 5) {
    readabilityScore -= 10
    if (readabilityLevel === 'easy') readabilityLevel = 'medium'
    recommendations.push({
      priority: 'low',
      category: 'content',
      issue: 'Using complex words',
      suggestion: 'Consider simpler alternatives for better readability',
      actionable: 'Replace complex words with simpler alternatives where possible'
    })
  }

  seoScore -= (100 - readabilityScore) * 0.1

  // Technical SEO
  const internalLinkMatches = content.match(/\[([^\]]+)\]\([^)]+\)/g) || []
  const externalLinkMatches = content.match(/https?:\/\/(?!yourdomain\.com)[^\s)]+/g) || []
  const imageMatches = content.match(/!\[([^\]]*)\]/g) || []
  const hasImageAltText = imageMatches.length > 0 && imageMatches.some(img => img.includes('[') && img.includes(']'))

  if (internalLinkMatches.length === 0 && wordCount > 500) {
    seoScore -= 5
    recommendations.push({
      priority: 'medium',
      category: 'technical',
      issue: 'No internal links found',
      suggestion: 'Add internal links to related content',
      actionable: 'Link to 2-3 related articles or pages within your content'
    })
  }

  if (!hasImageAltText && imageMatches.length > 0) {
    seoScore -= 5
    recommendations.push({
      priority: 'medium',
      category: 'technical',
      issue: 'Images missing alt text',
      suggestion: 'Add descriptive alt text to all images',
      actionable: 'Add alt text to images: ![Alt text description](image-url)'
    })
  }

  // Determine status
  let status: 'excellent' | 'good' | 'needs-improvement' | 'poor' = 'excellent'
  if (seoScore < 60) {
    status = 'poor'
  } else if (seoScore < 75) {
    status = 'needs-improvement'
  } else if (seoScore < 90) {
    status = 'good'
  }

  // Generate suggested title
  const suggestedTitle = keywordPlacement.inTitle 
    ? title 
    : `${primaryKeyword}: ${title.substring(0, 50 - primaryKeyword.length - 2)}`

  // Generate suggested meta description
  const suggestedMeta = keywordPlacement.inMeta
    ? metaDescription
    : `${metaDescription.substring(0, 120)} ${primaryKeyword}. ${metaDescription.substring(120, 150)}`

  return {
    seoScore: Math.max(0, Math.min(100, seoScore)),
    status,
    keywordAnalysis: {
      primaryKeyword,
      keywordDensity: Math.round(keywordDensity * 100) / 100,
      keywordPlacement,
      keywordSuggestions: [
        `${primaryKeyword} guide`,
        `best ${primaryKeyword}`,
        `how to ${primaryKeyword}`,
        `${primaryKeyword} tips`
      ]
    },
    contentOptimization: {
      title: {
        current: title,
        suggested: suggestedTitle,
        length: titleLength,
        optimalLength: optimalTitleLength
      },
      metaDescription: {
        current: metaDescription,
        suggested: suggestedMeta,
        length: metaLength,
        optimalLength: optimalMetaLength
      },
      headings: {
        hasH1,
        hasH2,
        headingCount,
        suggestions: hasH1 ? [] : [`# ${primaryKeyword} Guide`]
      },
      contentLength: {
        current: wordCount,
        optimal: optimalContentLength,
        status: contentLengthStatus
      },
      readability: {
        score: Math.max(0, Math.min(100, readabilityScore)),
        level: readabilityLevel,
        suggestions: readabilityLevel === 'hard' 
          ? ['Break up long sentences', 'Use shorter words', 'Add more paragraphs']
          : []
      }
    },
    technicalSEO: {
      internalLinks: internalLinkMatches.length,
      externalLinks: externalLinkMatches.length,
      imageAltText: hasImageAltText,
      suggestions: []
    },
    recommendations
  }
}

/**
 * Enhanced SEO analysis (Growth tier and above)
 */
function analyzeSEOEnhanced(
  content: string,
  title: string,
  metaDescription: string,
  primaryKeyword: string
): SEOAnalysis {
  const basic = analyzeSEOBasic(content, title, metaDescription, primaryKeyword)
  
  // Enhanced checks
  // Check for LSI keywords (related terms)
  const relatedTerms = [
    'guide', 'tips', 'how to', 'best', 'review', 'comparison',
    'benefits', 'advantages', 'examples', 'strategies'
  ]
  
  const hasRelatedTerms = relatedTerms.some(term => 
    content.toLowerCase().includes(term)
  )
  
  if (!hasRelatedTerms && basic.contentOptimization.contentLength.current > 500) {
    basic.recommendations.push({
      priority: 'low',
      category: 'keyword',
      issue: 'Consider adding related terms (LSI keywords)',
      suggestion: 'Include related terms to improve topical relevance',
      actionable: 'Add terms like "guide", "tips", "how to" naturally in your content'
    })
  }

  // Check for semantic structure
  const hasLists = content.match(/^[-*]\s/m) || content.match(/^\d+\.\s/m)
  if (!hasLists && basic.contentOptimization.contentLength.current > 800) {
    basic.recommendations.push({
      priority: 'low',
      category: 'content',
      issue: 'Consider adding lists or bullet points',
      suggestion: 'Lists improve readability and engagement',
      actionable: 'Add bullet points or numbered lists to break up content'
    })
  }

  return basic
}

/**
 * AI-powered SEO analysis (Pro tier and above)
 */
async function analyzeSEOAI(
  content: string,
  title: string,
  metaDescription: string,
  primaryKeyword: string,
  performanceLevel: string
): Promise<SEOAnalysis> {
  // Start with enhanced analysis
  const enhanced = analyzeSEOEnhanced(content, title, metaDescription, primaryKeyword)
  
  // For Pro+ tiers, could add AI-powered suggestions
  // For now, use enhanced (AI integration can be added later)
  
  return enhanced
}

/**
 * POST - Analyze content for SEO
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, title, metaDescription, primaryKeyword, url } = body

    if (!content || !title || !primaryKeyword) {
      return NextResponse.json({ 
        error: 'Content, title, and primaryKeyword are required' 
      }, { status: 400 })
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
    let analysis: SEOAnalysis

    if (performanceLevel === 'basic') {
      analysis = analyzeSEOBasic(content, title, metaDescription || '', primaryKeyword)
    } else if (performanceLevel === 'enhanced') {
      analysis = analyzeSEOEnhanced(content, title, metaDescription || '', primaryKeyword)
    } else {
      // AI, Advanced, Premium - use enhanced for now (AI can be added later)
      analysis = await analyzeSEOAI(content, title, metaDescription || '', primaryKeyword, performanceLevel)
    }

    // Save SEO analysis to database
    try {
      await db.execute({
        sql: `CREATE TABLE IF NOT EXISTS seo_analyses (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          url TEXT,
          title TEXT NOT NULL,
          primary_keyword VARCHAR(255) NOT NULL,
          seo_score INTEGER NOT NULL,
          analysis JSONB NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )`
      })

      await db.execute({
        sql: `
          INSERT INTO seo_analyses (
            user_id, url, title, primary_keyword, seo_score, analysis, created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, NOW())
        `,
        args: [
          user.userId,
          url || null,
          title,
          primaryKeyword,
          analysis.seoScore,
          JSON.stringify(analysis)
        ]
      })
    } catch (error) {
      console.error('Error saving SEO analysis:', error)
      // Continue even if save fails
    }

    // Log the AI call
    await logAICall(user.userId, 'SEO Optimizer', '/api/bots/seo-optimizer')

    return NextResponse.json({
      success: true,
      analysis,
      tier,
      performanceLevel,
      usage: {
        aiCalls: {
          current: limitCheck.current + 1,
          limit: limitCheck.limit
        }
      }
    })
  } catch (error: any) {
    console.error('SEO Optimizer Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to analyze SEO' 
    }, { status: 500 })
  }
}

/**
 * GET - Get SEO analysis history
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    try {
      const results = await db.execute({
        sql: `
          SELECT id, url, title, primary_keyword, seo_score, created_at
          FROM seo_analyses
          WHERE user_id = ?
          ORDER BY created_at DESC
          LIMIT ?
        `,
        args: [user.userId, limit]
      })

      return NextResponse.json({
        success: true,
        analyses: results.rows
      })
    } catch (error) {
      // Table might not exist yet
      return NextResponse.json({
        success: true,
        analyses: []
      })
    }
  } catch (error: any) {
    console.error('SEO Optimizer GET error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to get SEO analyses' 
    }, { status: 500 })
  }
}

