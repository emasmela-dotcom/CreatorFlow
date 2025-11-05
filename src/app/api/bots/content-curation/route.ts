import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

/**
 * Content Curation Bot - Suggests content ideas and identifies gaps
 * FREE for all users, performance scales with plan tier
 */

interface ContentIdea {
  title: string
  description: string
  type: string
  reason: string
  hashtags: string[]
  engagement: string
}

interface ContentGap {
  category: string
  description: string
  opportunity: string
  suggestedHashtags: string[]
}

interface CurationAnalysis {
  contentIdeas: ContentIdea[]
  contentGaps: ContentGap[]
  recommendations: string[]
  nextPostSuggestions: string[]
}

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

async function analyzeUserContent(userId: string, platform: string): Promise<{ niche: string, topics: string[] }> {
  // Analyze user's past posts to determine content patterns
  const postsResult = await db.execute({
    sql: `SELECT content FROM content_posts 
          WHERE user_id = ? AND platform = ? 
          AND status = 'published'
          ORDER BY published_at DESC LIMIT 30`,
    args: [userId, platform]
  })

  const posts = postsResult.rows as any[]
  
  if (posts.length === 0) {
    return { niche: 'general', topics: [] }
  }

  const allContent = posts.map((p: any) => p.content?.toLowerCase() || '').join(' ')
  
  // Determine niche
  let niche = 'general'
  if (allContent.includes('fitness') || allContent.includes('workout')) niche = 'fitness'
  else if (allContent.includes('business') || allContent.includes('entrepreneur')) niche = 'business'
  else if (allContent.includes('tech') || allContent.includes('coding')) niche = 'technology'
  else if (allContent.includes('food') || allContent.includes('recipe')) niche = 'food'
  else if (allContent.includes('travel')) niche = 'travel'
  else if (allContent.includes('fashion') || allContent.includes('style')) niche = 'fashion'

  // Extract common topics from content
  const topics: string[] = []
  const commonWords = ['tips', 'guide', 'how', 'why', 'tutorial', 'review', 'ideas', 'ways']
  commonWords.forEach(word => {
    if (allContent.includes(word)) {
      topics.push(word)
    }
  })

  return { niche, topics: [...new Set(topics)] }
}

async function generateContentIdeas(niche: string, topics: string[], tier: string): Promise<ContentIdea[]> {
  // Rule-based content ideas (free tier)
  // Higher tiers could use AI for more personalized suggestions

  const ideasByNiche: Record<string, ContentIdea[]> = {
    fitness: [
      {
        title: '5-Minute Morning Routine',
        description: 'Quick workout routine for busy mornings',
        type: 'Educational',
        reason: 'High engagement, easy to consume',
        hashtags: ['#MorningWorkout', '#FitnessTips', '#QuickWorkout'],
        engagement: '12k+ avg'
      },
      {
        title: 'Nutrition Mistakes to Avoid',
        description: 'Common nutrition mistakes and how to fix them',
        type: 'Educational',
        reason: 'Problem-solving content performs well',
        hashtags: ['#Nutrition', '#HealthyEating', '#FitnessTips'],
        engagement: '15k+ avg'
      },
      {
        title: 'Home Workout Equipment Under $50',
        description: 'Affordable fitness gear recommendations',
        type: 'Product Guide',
        reason: 'Practical, shareable content',
        hashtags: ['#HomeWorkout', '#FitnessEquipment', '#FitnessOnABudget'],
        engagement: '10k+ avg'
      }
    ],
    business: [
      {
        title: 'Productivity Systems That Actually Work',
        description: 'Real productivity methods from successful entrepreneurs',
        type: 'Educational',
        reason: 'High-value content, saves time',
        hashtags: ['#Productivity', '#BusinessTips', '#Entrepreneurship'],
        engagement: '20k+ avg'
      },
      {
        title: 'Side Hustle Ideas for 2025',
        description: 'Profitable side hustle opportunities',
        type: 'List/Guide',
        reason: 'High interest, viral potential',
        hashtags: ['#SideHustle', '#MakeMoneyOnline', '#Entrepreneurship'],
        engagement: '25k+ avg'
      },
      {
        title: 'Common Business Mistakes (First Year)',
        description: 'What to avoid when starting a business',
        type: 'Educational',
        reason: 'Relatable, helpful content',
        hashtags: ['#BusinessTips', '#Entrepreneurship', '#Startup'],
        engagement: '18k+ avg'
      }
    ],
    technology: [
      {
        title: 'AI Tools That Will Change Your Workflow',
        description: 'Game-changing AI tools for productivity',
        type: 'Tool Review',
        reason: 'Hot topic, high engagement',
        hashtags: ['#AITools', '#Productivity', '#Tech'],
        engagement: '30k+ avg'
      },
      {
        title: 'Coding Tips That Save Hours',
        description: 'Developer shortcuts and best practices',
        type: 'Educational',
        reason: 'Practical, valuable content',
        hashtags: ['#CodingTips', '#Developer', '#Programming'],
        engagement: '15k+ avg'
      },
      {
        title: 'Tech Stack for Startups in 2025',
        description: 'Recommended tools and technologies',
        type: 'Guide',
        reason: 'Decision-making content',
        hashtags: ['#TechStack', '#Startup', '#Tech'],
        engagement: '12k+ avg'
      }
    ],
    general: [
      {
        title: 'Daily Habits of Successful People',
        description: 'Morning routines that lead to success',
        type: 'Lifestyle',
        reason: 'Universal appeal, always trending',
        hashtags: ['#Success', '#Productivity', '#Motivation'],
        engagement: '18k+ avg'
      },
      {
        title: 'Things I Wish I Knew Earlier',
        description: 'Lessons learned the hard way',
        type: 'Personal',
        reason: 'Relatable, shareable',
        hashtags: ['#LifeLessons', '#Wisdom', '#PersonalGrowth'],
        engagement: '15k+ avg'
      },
      {
        title: 'Quick Wins for Better Results',
        description: 'Small changes that make a big difference',
        type: 'Tips',
        reason: 'Actionable, easy to implement',
        hashtags: ['#Tips', '#Productivity', '#SelfImprovement'],
        engagement: '12k+ avg'
      }
    ]
  }

  return ideasByNiche[niche] || ideasByNiche.general
}

async function identifyContentGaps(niche: string, topics: string[]): Promise<ContentGap[]> {
  const gaps: ContentGap[] = []

  // Common content gaps across niches
  if (!topics.includes('tutorial')) {
    gaps.push({
      category: 'Educational Content',
      description: 'Tutorial-style content performs well',
      opportunity: 'Create step-by-step guides',
      suggestedHashtags: ['#Tutorial', '#HowTo', '#Guide']
    })
  }

  if (!topics.includes('tips')) {
    gaps.push({
      category: 'Tips & Advice',
      description: 'Quick tips get high engagement',
      opportunity: 'Share actionable tips',
      suggestedHashtags: ['#Tips', '#Advice', '#Helpful']
    })
  }

  gaps.push({
    category: 'Behind the Scenes',
    description: 'Personal content builds connection',
    opportunity: 'Show your process or journey',
    suggestedHashtags: ['#BehindTheScenes', '#DayInTheLife', '#Process']
  })

  return gaps
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { platform } = body

    if (!platform) {
      return NextResponse.json({ error: 'Platform is required' }, { status: 400 })
    }

    const tier = await getUserPlanTier(user.userId)
    const { niche, topics } = await analyzeUserContent(user.userId, platform)
    const contentIdeas = await generateContentIdeas(niche, topics, tier)
    const contentGaps = await identifyContentGaps(niche, topics)

    // Generate recommendations
    const recommendations: string[] = []
    recommendations.push(`Focus on ${contentIdeas[0]?.type || 'educational'} content - performs well in your niche`)
    recommendations.push(`Fill content gaps to reach new audiences`)
    recommendations.push(`Use suggested hashtags for better discoverability`)

    // Next post suggestions
    const nextPostSuggestions: string[] = []
    if (contentIdeas.length > 0) {
      nextPostSuggestions.push(contentIdeas[0].title)
      if (contentIdeas.length > 1) {
        nextPostSuggestions.push(contentIdeas[1].title)
      }
    }

    const analysis: CurationAnalysis = {
      contentIdeas,
      contentGaps,
      recommendations,
      nextPostSuggestions
    }

    return NextResponse.json({
      success: true,
      analysis,
      niche,
      tier
    })
  } catch (error: any) {
    console.error('Content Curation Bot error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to curate content'
    }, { status: 500 })
  }
}

