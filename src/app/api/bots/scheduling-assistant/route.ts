import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

/**
 * Scheduling Assistant Bot - Smart scheduling recommendations
 * FREE for all users, performance scales with plan tier
 * Serverless function - spins up on demand, shuts down when done
 */

interface SchedulingRecommendation {
  optimalTimes: Array<{
    day: string
    time: string
    score: number // 0-100
    reason: string
  }>
  weeklySchedule: Array<{
    day: string
    recommendedTimes: string[]
    bestTime: string
  }>
  insights: string[]
  nextBestTime: {
    date: string
    time: string
    score: number
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
 * Get user's historical engagement data
 */
async function getUserEngagementData(userId: string, platform: string) {
  try {
    // Get analytics data for this user and platform
    const analyticsResult = await db.execute({
      sql: `SELECT * FROM analytics 
            WHERE user_id = ? AND platform = ? 
            ORDER BY date DESC LIMIT 90`,
      args: [userId, platform]
    })

    // Get posts with engagement metrics
    const postsResult = await db.execute({
      sql: `SELECT * FROM content_posts 
            WHERE user_id = ? AND platform = ? 
            AND status = 'published'
            AND engagement_metrics IS NOT NULL
            ORDER BY published_at DESC LIMIT 50`,
      args: [userId, platform]
    })

    return {
      analytics: analyticsResult.rows,
      posts: postsResult.rows
    }
  } catch (error) {
    return { analytics: [], posts: [] }
  }
}

/**
 * Basic scheduling recommendations (Starter tier)
 * Uses industry-standard best times
 */
function getBasicScheduleRecommendations(platform: string): SchedulingRecommendation {
  // Industry-standard best posting times by platform
  const platformTimes: Record<string, Array<{ day: string; time: string; score: number; reason: string }>> = {
    instagram: [
      { day: 'Monday', time: '6:00 PM', score: 85, reason: 'Evening peak engagement' },
      { day: 'Tuesday', time: '7:00 PM', score: 90, reason: 'Highest engagement day' },
      { day: 'Wednesday', time: '6:30 PM', score: 88, reason: 'Mid-week engagement peak' },
      { day: 'Thursday', time: '7:00 PM', score: 87, reason: 'Pre-weekend activity' },
      { day: 'Friday', time: '5:00 PM', score: 85, reason: 'Weekend anticipation' },
      { day: 'Saturday', time: '11:00 AM', score: 80, reason: 'Weekend morning scroll' },
      { day: 'Sunday', time: '10:00 AM', score: 82, reason: 'Sunday relaxation time' }
    ],
    twitter: [
      { day: 'Monday', time: '12:00 PM', score: 88, reason: 'Lunch break engagement' },
      { day: 'Tuesday', time: '1:00 PM', score: 90, reason: 'Mid-day peak' },
      { day: 'Wednesday', time: '12:30 PM', score: 87, reason: 'Work break time' },
      { day: 'Thursday', time: '1:00 PM', score: 89, reason: 'High engagement window' },
      { day: 'Friday', time: '11:00 AM', score: 85, reason: 'Pre-weekend activity' },
      { day: 'Saturday', time: '10:00 AM', score: 80, reason: 'Weekend morning' },
      { day: 'Sunday', time: '9:00 AM', score: 78, reason: 'Sunday browsing' }
    ],
    linkedin: [
      { day: 'Monday', time: '8:00 AM', score: 92, reason: 'Monday morning professionals' },
      { day: 'Tuesday', time: '9:00 AM', score: 90, reason: 'Peak professional activity' },
      { day: 'Wednesday', time: '8:30 AM', score: 88, reason: 'Mid-week engagement' },
      { day: 'Thursday', time: '9:00 AM', score: 87, reason: 'Professional audience active' },
      { day: 'Friday', time: '8:00 AM', score: 85, reason: 'Friday morning check-in' },
      { day: 'Saturday', time: '10:00 AM', score: 70, reason: 'Lower weekend activity' },
      { day: 'Sunday', time: '10:00 AM', score: 68, reason: 'Minimal weekend engagement' }
    ],
    tiktok: [
      { day: 'Monday', time: '6:00 PM', score: 88, reason: 'Evening entertainment' },
      { day: 'Tuesday', time: '7:00 PM', score: 90, reason: 'Peak viewing time' },
      { day: 'Wednesday', time: '6:30 PM', score: 89, reason: 'Mid-week escape' },
      { day: 'Thursday', time: '7:00 PM', score: 87, reason: 'Pre-weekend browsing' },
      { day: 'Friday', time: '5:00 PM', score: 85, reason: 'Weekend anticipation' },
      { day: 'Saturday', time: '11:00 AM', score: 82, reason: 'Weekend morning scroll' },
      { day: 'Sunday', time: '10:00 AM', score: 80, reason: 'Sunday relaxation' }
    ],
    youtube: [
      { day: 'Monday', time: '2:00 PM', score: 85, reason: 'Afternoon viewing' },
      { day: 'Tuesday', time: '3:00 PM', score: 88, reason: 'Peak viewing window' },
      { day: 'Wednesday', time: '2:30 PM', score: 86, reason: 'Mid-week content consumption' },
      { day: 'Thursday', time: '3:00 PM', score: 87, reason: 'High engagement time' },
      { day: 'Friday', time: '1:00 PM', score: 84, reason: 'Pre-weekend viewing' },
      { day: 'Saturday', time: '10:00 AM', score: 80, reason: 'Weekend morning' },
      { day: 'Sunday', time: '9:00 AM', score: 78, reason: 'Sunday browsing' }
    ]
  }

  const optimalTimes = platformTimes[platform.toLowerCase()] || platformTimes.instagram
  
  // Create weekly schedule
  const weeklySchedule = optimalTimes.map(item => ({
    day: item.day,
    recommendedTimes: [
      item.time,
      // Add alternative times
      item.day === 'Monday' ? '11:00 AM' : '12:00 PM',
      item.day === 'Tuesday' ? '6:00 PM' : '7:00 PM'
    ],
    bestTime: item.time
  }))

  // Get next best time (today or tomorrow)
  const today = new Date()
  const dayOfWeek = today.getDay()
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const currentDay = days[dayOfWeek]
  
  const todaySchedule = optimalTimes.find(t => t.day === currentDay)
  const tomorrowSchedule = optimalTimes.find(t => t.day === days[(dayOfWeek + 1) % 7])

  const nextBestTime = todaySchedule || tomorrowSchedule || optimalTimes[0]

  return {
    optimalTimes,
    weeklySchedule,
    insights: [
      `${platform} typically performs best in the evening (6-9 PM)`,
      'Tuesday and Thursday show highest engagement',
      'Avoid posting too early (before 8 AM) or too late (after 10 PM)',
      'Weekend mornings (10-11 AM) can be effective for some platforms'
    ],
    nextBestTime: {
      date: todaySchedule ? 'Today' : 'Tomorrow',
      time: nextBestTime.time,
      score: nextBestTime.score
    }
  }
}

/**
 * Enhanced scheduling (Growth tier and above)
 * Analyzes user's historical data
 */
async function getEnhancedScheduleRecommendations(
  platform: string,
  userId: string
): Promise<SchedulingRecommendation> {
  const basic = getBasicScheduleRecommendations(platform)
  
  // Try to get user's historical data
  const userData = await getUserEngagementData(userId, platform)
  
  // If user has engagement data, analyze it
  if (userData.posts.length > 0) {
    // Analyze published posts to find best times
    const engagementByHour: Record<number, number> = {}
    const engagementByDay: Record<string, number> = {}
    
    userData.posts.forEach((post: any) => {
      if (post.published_at && post.engagement_metrics) {
        const publishedDate = new Date(post.published_at)
        const hour = publishedDate.getHours()
        const day = publishedDate.toLocaleDateString('en-US', { weekday: 'long' })
        
        const metrics = typeof post.engagement_metrics === 'string' 
          ? JSON.parse(post.engagement_metrics) 
          : post.engagement_metrics
        
        const engagement = (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0)
        
        engagementByHour[hour] = (engagementByHour[hour] || 0) + engagement
        engagementByDay[day] = (engagementByDay[day] || 0) + engagement
      }
    })
    
    // Find best hour from user's data
    const bestHour = Object.entries(engagementByHour).sort((a, b) => b[1] - a[1])[0]
    const bestDay = Object.entries(engagementByDay).sort((a, b) => b[1] - a[1])[0]
    
    if (bestHour) {
      basic.insights.push(
        `Your best performing hour is ${bestHour[0]}:00 based on your past posts`,
        `Your top engagement day is ${bestDay[0]} based on your data`
      )
      
      // Adjust recommendations based on user data
      const userBestHour = parseInt(bestHour[0])
      const userBestTime = `${userBestHour}:00 ${userBestHour >= 12 ? 'PM' : 'AM'}`
      
      basic.nextBestTime = {
        date: 'Today',
        time: userBestTime,
        score: 95
      }
    }
  }
  
  return basic
}

/**
 * POST - Get scheduling recommendations
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { platform } = body

    if (!platform) {
      return NextResponse.json({ error: 'Platform is required' }, { status: 400 })
    }

    // Get user's plan tier
    const tier = await getUserPlanTier(user.userId)
    const performanceLevel = getBotPerformanceLevel(tier)

    // Get recommendations based on tier
    let recommendations: SchedulingRecommendation

    if (performanceLevel === 'basic') {
      recommendations = getBasicScheduleRecommendations(platform)
    } else {
      // Enhanced and above - use user's data
      recommendations = await getEnhancedScheduleRecommendations(platform, user.userId)
    }

    return NextResponse.json({
      success: true,
      recommendations,
      tier,
      performanceLevel
    })
  } catch (error: any) {
    console.error('Scheduling Assistant Bot error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to get scheduling recommendations' 
    }, { status: 500 })
  }
}

