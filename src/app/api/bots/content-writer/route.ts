import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { canMakeAICall, logAICall } from '@/lib/usageTracking'

/**
 * Content Writer Bot - AI-powered content generation
 * Available for all tiers
 * Note: This complements the existing Content Assistant Bot
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
 * Generate content based on type, topic, and parameters
 */
function generateContent(
  topic: string,
  type: string,
  tone: string,
  length: number | null,
  platform: string | null,
  keywords: string[]
): string {
  const contentType = type.toLowerCase()
  const targetLength = length || getDefaultLength(contentType, platform)
  
  // Generate content based on type
  switch (contentType) {
    case 'blog-post':
    case 'article':
      return generateBlogPost(topic, tone, targetLength, keywords)
    
    case 'social-media':
    case 'social-post':
    case 'post':
      return generateSocialMediaPost(topic, tone, platform || 'instagram', keywords)
    
    case 'instagram':
    case 'instagram-post':
      return generateInstagramPost(topic, tone, keywords)
    
    case 'twitter':
    case 'tweet':
    case 'x':
      return generateTwitterPost(topic, tone, keywords)
    
    case 'linkedin':
    case 'linkedin-post':
      return generateLinkedInPost(topic, tone, keywords)
    
    case 'tiktok':
    case 'tiktok-caption':
      return generateTikTokCaption(topic, tone, keywords)
    
    case 'youtube':
    case 'youtube-description':
      return generateYouTubeDescription(topic, tone, keywords)
    
    case 'email':
    case 'newsletter':
      return generateEmailContent(topic, tone, targetLength, keywords)
    
    case 'product-description':
      return generateProductDescription(topic, tone, keywords)
    
    case 'landing-page':
      return generateLandingPageContent(topic, tone, keywords)
    
    default:
      return generateGenericContent(topic, tone, targetLength, keywords)
  }
}

/**
 * Get default length based on content type and platform
 */
function getDefaultLength(type: string, platform: string | null): number {
  if (platform) {
    const platformLimits: Record<string, number> = {
      twitter: 280,
      instagram: 500,
      linkedin: 1300,
      tiktok: 300,
      youtube: 5000
    }
    return platformLimits[platform.toLowerCase()] || 500
  }
  
  const typeLimits: Record<string, number> = {
    'blog-post': 1000,
    'article': 1500,
    'social-media': 300,
    'email': 500,
    'product-description': 200,
    'landing-page': 800
  }
  
  return typeLimits[type.toLowerCase()] || 500
}

/**
 * Generate blog post content
 */
function generateBlogPost(topic: string, tone: string, length: number, keywords: string[]): string {
  const intro = getToneBasedIntro(topic, tone)
  const body = generateBodyContent(topic, keywords, length - 200)
  const conclusion = getToneBasedConclusion(topic, tone)
  
  return `${intro}\n\n${body}\n\n${conclusion}`
}

/**
 * Generate social media post (generic)
 */
function generateSocialMediaPost(topic: string, tone: string, platform: string, keywords: string[]): string {
  const platformLower = platform.toLowerCase()
  switch (platformLower) {
    case 'instagram':
      return generateInstagramPost(topic, tone, keywords)
    case 'twitter':
    case 'x':
      return generateTwitterPost(topic, tone, keywords)
    case 'linkedin':
      return generateLinkedInPost(topic, tone, keywords)
    case 'tiktok':
      return generateTikTokCaption(topic, tone, keywords)
    case 'youtube':
      return generateYouTubeDescription(topic, tone, keywords)
    default:
      return generateInstagramPost(topic, tone, keywords)
  }
}

/**
 * Generate Instagram post
 */
function generateInstagramPost(topic: string, tone: string, keywords: string[]): string {
  const hooks = [
    `✨ ${topic} - here's what you need to know!`,
    `💡 Let's talk about ${topic.toLowerCase()}`,
    `🎯 Want to master ${topic.toLowerCase()}?`,
    `🔥 The truth about ${topic.toLowerCase()}`,
    `💪 Ready to level up your ${topic.toLowerCase()}?`
  ]
  
  const hook = hooks[Math.floor(Math.random() * hooks.length)]
  const content = generateShortContent(topic, keywords, 200)
  const cta = getCTA(tone)
  
  return `${hook}\n\n${content}\n\n${cta}`
}

/**
 * Generate Twitter/X post
 */
function generateTwitterPost(topic: string, tone: string, keywords: string[]): string {
  const hooks = [
    `${topic}:`,
    `Thoughts on ${topic.toLowerCase()}:`,
    `${topic} is...`,
    `Hot take: ${topic.toLowerCase()}`
  ]
  
  const hook = hooks[Math.floor(Math.random() * hooks.length)]
  const content = generateShortContent(topic, keywords, 200)
  
  return `${hook} ${content}`
}

/**
 * Generate LinkedIn post
 */
function generateLinkedInPost(topic: string, tone: string, keywords: string[]): string {
  const intro = `I've been thinking a lot about ${topic.toLowerCase()} lately.`
  const content = generateShortContent(topic, keywords, 800)
  const question = `What are your thoughts on ${topic.toLowerCase()}?`
  
  return `${intro}\n\n${content}\n\n${question}`
}

/**
 * Generate TikTok caption
 */
function generateTikTokCaption(topic: string, tone: string, keywords: string[]): string {
  const hooks = [
    `POV: ${topic.toLowerCase()}`,
    `When ${topic.toLowerCase()} hits different`,
    `${topic} but make it...`,
    `Tell me you ${topic.toLowerCase()} without telling me`
  ]
  
  const hook = hooks[Math.floor(Math.random() * hooks.length)]
  const content = generateShortContent(topic, keywords, 150)
  
  return `${hook}\n\n${content}`
}

/**
 * Generate YouTube description
 */
function generateYouTubeDescription(topic: string, tone: string, keywords: string[]): string {
  const intro = `In this video, we're diving deep into ${topic.toLowerCase()}.`
  const content = generateShortContent(topic, keywords, 300)
  const outro = `Don't forget to like, subscribe, and hit the notification bell for more content!`
  
  return `${intro}\n\n${content}\n\n${outro}`
}

/**
 * Generate email content
 */
function generateEmailContent(topic: string, tone: string, length: number, keywords: string[]): string {
  const greeting = getToneBasedGreeting(tone)
  const intro = `I wanted to share something important about ${topic.toLowerCase()}.`
  const body = generateBodyContent(topic, keywords, length - 150)
  const closing = getToneBasedClosing(tone)
  
  return `${greeting}\n\n${intro}\n\n${body}\n\n${closing}`
}

/**
 * Generate product description
 */
function generateProductDescription(topic: string, tone: string, keywords: string[]): string {
  const intro = `Introducing ${topic} - the solution you've been waiting for.`
  const features = keywords.length > 0 
    ? `Key features: ${keywords.slice(0, 3).join(', ')}.`
    : 'Designed with quality and performance in mind.'
  const cta = 'Get yours today!'
  
  return `${intro}\n\n${features}\n\n${cta}`
}

/**
 * Generate landing page content
 */
function generateLandingPageContent(topic: string, tone: string, keywords: string[]): string {
  const headline = `${topic}: Transform Your Results Today`
  const subheadline = `Discover the power of ${topic.toLowerCase()} and unlock your potential.`
  const benefits = keywords.length > 0
    ? `Benefits include: ${keywords.slice(0, 5).join(', ')}.`
    : 'Experience proven results and join thousands of satisfied users.'
  const cta = 'Get Started Now'
  
  return `${headline}\n\n${subheadline}\n\n${benefits}\n\n${cta}`
}

/**
 * Generate generic content
 */
function generateGenericContent(topic: string, tone: string, length: number, keywords: string[]): string {
  const intro = getToneBasedIntro(topic, tone)
  const body = generateBodyContent(topic, keywords, length - 100)
  
  return `${intro}\n\n${body}`
}

/**
 * Generate short content (for social media)
 */
function generateShortContent(topic: string, keywords: string[], maxLength: number): string {
  const sentences = [
    `${topic} is one of the most important aspects to consider.`,
    `When it comes to ${topic.toLowerCase()}, there are several key points to remember.`,
    `Understanding ${topic.toLowerCase()} can make a huge difference.`,
    `Many people overlook the importance of ${topic.toLowerCase()}.`,
    `${topic} requires careful attention and planning.`
  ]
  
  let content = sentences[Math.floor(Math.random() * sentences.length)]
  
  if (keywords.length > 0) {
    const keywordSentence = `Key factors include ${keywords.slice(0, 2).join(' and ')}.`
    content += ` ${keywordSentence}`
  }
  
  // Add more sentences if we have room
  if (content.length < maxLength - 50) {
    const additional = [
      `This approach has proven effective for many.`,
      `The results speak for themselves.`,
      `It's worth taking the time to get this right.`
    ]
    content += ` ${additional[Math.floor(Math.random() * additional.length)]}`
  }
  
  return content.substring(0, maxLength)
}

/**
 * Generate body content for longer pieces
 */
function generateBodyContent(topic: string, keywords: string[], targetLength: number): string {
  const paragraphs: string[] = []
  let currentLength = 0
  
  // First paragraph
  const para1 = `When it comes to ${topic.toLowerCase()}, understanding the fundamentals is crucial. ${topic} encompasses various aspects that work together to create success. Whether you're just starting out or looking to improve your current approach, having a solid foundation is key.`
  paragraphs.push(para1)
  currentLength += para1.length
  
  // Second paragraph (if we have keywords)
  if (keywords.length > 0 && currentLength < targetLength - 200) {
    const para2 = `Key elements to consider include ${keywords.slice(0, 3).join(', ')}, and ${keywords.length > 3 ? keywords[3] : 'more'}. Each of these plays an important role in achieving your goals. By focusing on these areas, you can create a comprehensive strategy that addresses all aspects of ${topic.toLowerCase()}.`
    paragraphs.push(para2)
    currentLength += para2.length
  }
  
  // Third paragraph
  if (currentLength < targetLength - 150) {
    const para3 = `The benefits of implementing a well-thought-out approach to ${topic.toLowerCase()} are numerous. You'll see improvements in efficiency, effectiveness, and overall results. Many have found that taking the time to properly plan and execute their strategy pays dividends in the long run.`
    paragraphs.push(para3)
    currentLength += para3.length
  }
  
  // Add more paragraphs if needed
  while (currentLength < targetLength - 100 && paragraphs.length < 5) {
    const additional = [
      `Remember, ${topic.toLowerCase()} is an ongoing process. Continuous improvement and adaptation are essential for long-term success.`,
      `It's important to stay informed about the latest developments and best practices related to ${topic.toLowerCase()}.`,
      `Don't be afraid to experiment and find what works best for your specific situation when it comes to ${topic.toLowerCase()}.`
    ]
    const newPara = additional[Math.floor(Math.random() * additional.length)]
    paragraphs.push(newPara)
    currentLength += newPara.length
  }
  
  return paragraphs.join('\n\n')
}

/**
 * Get tone-based introduction
 */
function getToneBasedIntro(topic: string, tone: string): string {
  const intros: Record<string, string[]> = {
    professional: [
      `In this comprehensive guide, we'll explore ${topic.toLowerCase()} and its various applications.`,
      `${topic} is a critical topic that deserves careful examination.`,
      `Understanding ${topic.toLowerCase()} is essential for success in today's landscape.`
    ],
    casual: [
      `Let's dive into ${topic.toLowerCase()} and see what it's all about!`,
      `So, you want to know about ${topic.toLowerCase()}? You're in the right place.`,
      `Hey there! Today we're talking about ${topic.toLowerCase()}.`
    ],
    friendly: [
      `Welcome! Today we're exploring ${topic.toLowerCase()} together.`,
      `I'm excited to share everything I know about ${topic.toLowerCase()} with you.`,
      `Let's explore ${topic.toLowerCase()} in a way that's easy to understand.`
    ],
    authoritative: [
      `${topic} represents a fundamental shift in how we approach this field.`,
      `The significance of ${topic.toLowerCase()} cannot be overstated.`,
      `When examining ${topic.toLowerCase()}, we must consider multiple critical factors.`
    ]
  }
  
  const toneIntros = intros[tone.toLowerCase()] || intros.professional
  return toneIntros[Math.floor(Math.random() * toneIntros.length)]
}

/**
 * Get tone-based conclusion
 */
function getToneBasedConclusion(topic: string, tone: string): string {
  const conclusions: Record<string, string[]> = {
    professional: [
      `In conclusion, ${topic.toLowerCase()} offers significant opportunities for those willing to invest the time and effort.`,
      `To summarize, understanding and implementing ${topic.toLowerCase()} can lead to substantial improvements.`,
      `As we've seen, ${topic.toLowerCase()} is a valuable area to focus on for long-term success.`
    ],
    casual: [
      `So there you have it - ${topic.toLowerCase()} in a nutshell!`,
      `That's everything you need to know about ${topic.toLowerCase()}.`,
      `Hope this helps you get started with ${topic.toLowerCase()}!`
    ],
    friendly: [
      `I hope this guide helps you on your journey with ${topic.toLowerCase()}!`,
      `Remember, ${topic.toLowerCase()} is a journey, not a destination.`,
      `Feel free to reach out if you have questions about ${topic.toLowerCase()}!`
    ],
    authoritative: [
      `The evidence clearly demonstrates the importance of ${topic.toLowerCase()}.`,
      `In summary, ${topic.toLowerCase()} is not just a trend, but a fundamental shift.`,
      `The data supports the critical role of ${topic.toLowerCase()} in achieving success.`
    ]
  }
  
  const toneConclusions = conclusions[tone.toLowerCase()] || conclusions.professional
  return toneConclusions[Math.floor(Math.random() * toneConclusions.length)]
}

/**
 * Get tone-based greeting
 */
function getToneBasedGreeting(tone: string): string {
  const greetings: Record<string, string[]> = {
    professional: ['Dear Reader,', 'Hello,', 'Greetings,'],
    casual: ['Hey!', 'Hi there!', "What's up!"],
    friendly: ['Hi friend!', 'Hello!', 'Hey there!'],
    authoritative: ['To Whom It May Concern,', 'Dear Colleague,', 'Greetings,']
  }
  
  const toneGreetings = greetings[tone.toLowerCase()] || greetings.professional
  return toneGreetings[Math.floor(Math.random() * toneGreetings.length)]
}

/**
 * Get tone-based closing
 */
function getToneBasedClosing(tone: string): string {
  const closings: Record<string, string[]> = {
    professional: ['Best regards,', 'Sincerely,', 'Regards,'],
    casual: ['Cheers!', 'Talk soon!', 'Catch you later!'],
    friendly: ['Take care!', 'All the best!', 'Wishing you well!'],
    authoritative: ['Respectfully,', 'Sincerely,', 'Best regards,']
  }
  
  const toneClosings = closings[tone.toLowerCase()] || closings.professional
  return toneClosings[Math.floor(Math.random() * toneClosings.length)]
}

/**
 * Get call-to-action
 */
function getCTA(tone: string): string {
  const ctas: Record<string, string[]> = {
    professional: [
      'What are your thoughts on this topic?',
      "I'd love to hear your perspective.",
      'Feel free to share your experiences.'
    ],
    casual: [
      'What do you think?',
      'Drop a comment below!',
      'Let me know your thoughts!'
    ],
    friendly: [
      "What's your take on this?",
      "I'd love to hear from you!",
      'Share your thoughts below!'
    ],
    authoritative: [
      'I welcome your feedback and insights.',
      'Your perspective would be valuable.',
      'Please share your professional opinion.'
    ]
  }
  
  const toneCTAs = ctas[tone.toLowerCase()] || ctas.professional
  return toneCTAs[Math.floor(Math.random() * toneCTAs.length)]
}

/**
 * POST - Generate content
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    // All tiers can use Content Writer Bot
    const tier = await getUserPlanTier(user.userId)

    const body = await request.json()
    const { topic, type, tone, length, platform, keywords } = body

    if (!topic || !type) {
      return NextResponse.json({ 
        error: 'Topic and type are required' 
      }, { status: 400 })
    }

    // Generate content based on type and parameters
    const content = generateContent(topic, type, tone || 'professional', length, platform, keywords || [])

    // Ensure table exists (fallback)
    try {
      // Try to add missing columns if table exists
      try {
        await db.execute({ sql: `ALTER TABLE generated_content ADD COLUMN IF NOT EXISTS type VARCHAR(50)` })
      } catch (e) {}
      try {
        await db.execute({ sql: `ALTER TABLE generated_content ADD COLUMN IF NOT EXISTS content_type VARCHAR(50)` })
      } catch (e) {}
      try {
        await db.execute({ sql: `ALTER TABLE generated_content ADD COLUMN IF NOT EXISTS length INTEGER` })
      } catch (e) {}
      try {
        await db.execute({ sql: `ALTER TABLE generated_content ADD COLUMN IF NOT EXISTS platform VARCHAR(50)` })
      } catch (e) {}
      try {
        await db.execute({ sql: `ALTER TABLE generated_content ADD COLUMN IF NOT EXISTS keywords TEXT` })
      } catch (e) {}
      
      await db.execute({ sql: `CREATE TABLE IF NOT EXISTS generated_content (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        topic TEXT NOT NULL,
        type VARCHAR(50),
        content_type VARCHAR(50) DEFAULT 'blog-post',
        tone VARCHAR(50),
        length INTEGER,
        platform VARCHAR(50),
        keywords TEXT,
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )` })
    } catch (e) {}

    // Save generated content
    const result = await db.execute({
      sql: `
        INSERT INTO generated_content (
          user_id, topic, type, content_type, tone, length, platform, keywords, content, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        RETURNING *
      `,
      args: [
        user.userId,
        topic,
        type,
        type || 'blog-post', // content_type defaults to type
        tone || 'professional',
        length || null,
        platform || null,
        JSON.stringify(keywords || []),
        content
      ]
    })

    // Log the AI call
    await logAICall(user.userId, 'Content Writer', '/api/bots/content-writer')

    return NextResponse.json({
      success: true,
      content: result.rows[0],
      tier,
      usage: {
        aiCallsUsed: limitCheck.current + 1,
        aiCallsLimit: limitCheck.limit
      }
    })
  } catch (error: any) {
    console.error('Content Writer Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to generate content' 
    }, { status: 500 })
  }
}

