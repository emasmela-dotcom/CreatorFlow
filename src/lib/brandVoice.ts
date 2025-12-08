/**
 * Brand Voice Analyzer & Maintainer
 * Learns and maintains consistent brand voice across all content
 */

import { db } from './db'

export interface BrandVoiceProfile {
  tone: string[]
  style: string[]
  commonPhrases: string[]
  wordChoice: string[]
  consistencyScore: number
}

/**
 * Analyze user's content to learn brand voice
 */
export async function analyzeBrandVoice(userId: string): Promise<BrandVoiceProfile> {
  try {
    // Get user's published posts
    const postsResult = await db.execute({
      sql: `
        SELECT content
        FROM content_posts
        WHERE user_id = ? 
          AND status = 'published'
          AND content IS NOT NULL
          AND LENGTH(content) > 20
        ORDER BY published_at DESC
        LIMIT 50
      `,
      args: [userId]
    })

    const posts = postsResult.rows as any[]

    if (posts.length < 5) {
      // Not enough data - return default profile
      return {
        tone: ['professional', 'friendly'],
        style: ['conversational'],
        commonPhrases: [],
        wordChoice: [],
        consistencyScore: 0
      }
    }

    // Analyze content patterns
    const allContent = posts.map((p: any) => p.content).join(' ').toLowerCase()
    
    // Extract tone indicators
    const toneIndicators: Record<string, number> = {
      professional: ['professional', 'business', 'industry', 'expert'].reduce((count, word) => 
        count + (allContent.match(new RegExp(word, 'g')) || []).length, 0),
      friendly: ['hello', 'hey', 'thanks', 'appreciate', 'love'].reduce((count, word) => 
        count + (allContent.match(new RegExp(word, 'g')) || []).length, 0),
      casual: ['lol', 'omg', 'tbh', 'tbh', 'ngl'].reduce((count, word) => 
        count + (allContent.match(new RegExp(word, 'g')) || []).length, 0),
      inspirational: ['motivate', 'inspire', 'achieve', 'dream', 'success'].reduce((count, word) => 
        count + (allContent.match(new RegExp(word, 'g')) || []).length, 0),
      educational: ['learn', 'teach', 'guide', 'tutorial', 'how'].reduce((count, word) => 
        count + (allContent.match(new RegExp(word, 'g')) || []).length, 0)
    }

    const dominantTones = Object.entries(toneIndicators)
      .filter(([_, count]) => count > 0)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 3)
      .map(([tone]) => tone)

    // Extract common phrases (2-3 word combinations)
    const phrases: Record<string, number> = {}
    posts.forEach((post: any) => {
      const words = post.content.toLowerCase().split(/\s+/)
      for (let i = 0; i < words.length - 1; i++) {
        const phrase = `${words[i]} ${words[i + 1]}`
        phrases[phrase] = (phrases[phrase] || 0) + 1
      }
    })

    const commonPhrases = Object.entries(phrases)
      .filter(([_, count]) => count >= 2)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 10)
      .map(([phrase]) => phrase)

    // Analyze style (sentence length, punctuation, emoji usage)
    const avgSentenceLength = posts.reduce((sum, post: any) => {
      const sentences = post.content.split(/[.!?]+/).filter((s: string) => s.trim().length > 0)
      const avg = sentences.reduce((s: number, sent: string) => s + sent.split(/\s+/).length, 0) / sentences.length
      return sum + avg
    }, 0) / posts.length

    const style: string[] = []
    if (avgSentenceLength < 15) style.push('concise')
    if (avgSentenceLength > 25) style.push('detailed')
    if (avgSentenceLength >= 15 && avgSentenceLength <= 25) style.push('balanced')

    const emojiUsage = posts.filter((p: any) => /[\u{1F300}-\u{1F9FF}]/u.test(p.content)).length / posts.length
    if (emojiUsage > 0.5) style.push('emojis')
    if (emojiUsage < 0.2) style.push('minimal-emoji')

    // Calculate consistency score
    const consistencyScore = Math.min(100, Math.round(
      (posts.length / 50) * 50 + // More posts = higher score
      (dominantTones.length > 0 ? 20 : 0) + // Has identifiable tone
      (commonPhrases.length > 0 ? 20 : 0) + // Has common phrases
      (style.length > 0 ? 10 : 0) // Has identifiable style
    ))

    return {
      tone: dominantTones.length > 0 ? dominantTones : ['professional'],
      style: style.length > 0 ? style : ['conversational'],
      commonPhrases,
      wordChoice: [], // Can be enhanced with word frequency analysis
      consistencyScore
    }
  } catch (error: any) {
    console.error('Error analyzing brand voice:', error)
    return {
      tone: ['professional'],
      style: ['conversational'],
      commonPhrases: [],
      wordChoice: [],
      consistencyScore: 0
    }
  }
}

/**
 * Check if content matches brand voice
 */
export async function checkBrandVoiceMatch(
  userId: string,
  content: string
): Promise<{
  matches: boolean
  score: number
  suggestions: string[]
}> {
  try {
    const profile = await analyzeBrandVoice(userId)
    
    if (profile.consistencyScore < 30) {
      return {
        matches: true,
        score: 50,
        suggestions: ['Not enough historical data to analyze brand voice']
      }
    }

    const contentLower = content.toLowerCase()
    let matchScore = 50 // Base score

    // Check tone match
    const toneMatches = profile.tone.some(tone => {
      const toneWords: Record<string, string[]> = {
        professional: ['professional', 'business', 'industry'],
        friendly: ['hello', 'thanks', 'appreciate'],
        casual: ['lol', 'omg', 'tbh'],
        inspirational: ['motivate', 'inspire', 'achieve'],
        educational: ['learn', 'teach', 'guide']
      }
      return (toneWords[tone] || []).some(word => contentLower.includes(word))
    })
    if (toneMatches) matchScore += 20

    // Check for common phrases
    const phraseMatches = profile.commonPhrases.filter(phrase => 
      contentLower.includes(phrase)
    ).length
    matchScore += Math.min(20, phraseMatches * 5)

    // Check style match (sentence length)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const avgLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length
    
    if (profile.style.includes('concise') && avgLength < 15) matchScore += 10
    if (profile.style.includes('detailed') && avgLength > 25) matchScore += 10
    if (profile.style.includes('balanced') && avgLength >= 15 && avgLength <= 25) matchScore += 10

    // Generate suggestions
    const suggestions: string[] = []
    if (matchScore < 60) {
      if (!toneMatches && profile.tone.length > 0) {
        suggestions.push(`Consider using a more ${profile.tone[0]} tone`)
      }
      if (phraseMatches === 0 && profile.commonPhrases.length > 0) {
        suggestions.push(`Try incorporating phrases like "${profile.commonPhrases[0]}"`)
      }
      if (profile.style.includes('emojis') && !/[\u{1F300}-\u{1F9FF}]/u.test(content)) {
        suggestions.push('Add emojis to match your brand style')
      }
    }

    return {
      matches: matchScore >= 60,
      score: Math.min(100, matchScore),
      suggestions: suggestions.length > 0 ? suggestions : ['Content matches your brand voice!']
    }
  } catch (error: any) {
    console.error('Error checking brand voice:', error)
    return {
      matches: true,
      score: 50,
      suggestions: ['Unable to analyze brand voice match']
    }
  }
}

/**
 * Save brand voice profile
 */
export async function saveBrandVoiceProfile(
  userId: string,
  profile: BrandVoiceProfile
): Promise<void> {
  try {
    await db.execute({
      sql: `
        INSERT INTO brand_voice_profiles (
          user_id, voice_characteristics, consistency_score, last_analyzed_at
        ) VALUES (?, ?, ?, NOW())
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          voice_characteristics = ?,
          consistency_score = ?,
          last_analyzed_at = NOW(),
          updated_at = NOW()
      `,
      args: [
        userId,
        JSON.stringify(profile),
        profile.consistencyScore,
        JSON.stringify(profile),
        profile.consistencyScore
      ]
    })
  } catch (error) {
    console.error('Error saving brand voice profile:', error)
  }
}

