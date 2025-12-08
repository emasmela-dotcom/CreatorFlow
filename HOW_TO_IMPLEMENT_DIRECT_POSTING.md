# How CreatorFlow Can Post Directly to Social Media Platforms

## 🔍 Current State

**What Happens Now:**
- User creates post in CreatorFlow
- Post is saved to database with `status: 'scheduled'`
- User must manually go to platform and post
- No automatic posting happens

**What We Need:**
- OAuth authentication with each platform
- API integrations to post directly
- Background job scheduler to post at scheduled times
- Error handling and retry logic

---

## 🏗️ Technical Architecture

### 1. **OAuth Authentication Flow**

Each platform requires OAuth to get user's permission to post on their behalf.

```
User → CreatorFlow → Platform OAuth → User Authorizes → Platform Returns Access Token → CreatorFlow Stores Token
```

**Database Schema Addition:**
```sql
CREATE TABLE platform_connections (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL, -- 'instagram', 'twitter', etc.
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  platform_user_id VARCHAR(255), -- User's ID on that platform
  platform_username VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, platform)
)
```

---

## 📱 Platform-by-Platform Implementation

### 1. **Instagram** (via Facebook Graph API)

**Requirements:**
- Facebook Developer Account
- Facebook App created
- Instagram Business or Creator account
- App Review for `instagram_basic` and `pages_show_list` permissions

**OAuth Flow:**
1. User clicks "Connect Instagram"
2. Redirect to Facebook OAuth: `https://www.facebook.com/v18.0/dialog/oauth?client_id=YOUR_APP_ID&redirect_uri=YOUR_CALLBACK&scope=instagram_basic,pages_show_list`
3. User authorizes
4. Exchange code for access token
5. Get Instagram Business Account ID
6. Store tokens in database

**Posting API:**
```typescript
// POST to Instagram
async function postToInstagram(accessToken: string, instagramAccountId: string, content: string, imageUrl: string) {
  // 1. Upload image to Instagram
  const imageContainer = await fetch(
    `https://graph.facebook.com/v18.0/${instagramAccountId}/media`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: content
      })
    }
  )
  
  const { id: creationId } = await imageContainer.json()
  
  // 2. Publish the post
  const publish = await fetch(
    `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        creation_id: creationId
      })
    }
  )
  
  return await publish.json()
}
```

**Limitations:**
- Only Business/Creator accounts (not personal)
- Requires Facebook Page connection
- App review required
- Rate limits: 25 posts per 24 hours per account

---

### 2. **Twitter/X API**

**Requirements:**
- Twitter Developer Account
- Twitter App created
- OAuth 2.0 setup
- API v2 access

**OAuth Flow:**
1. User clicks "Connect Twitter"
2. Redirect to Twitter OAuth: `https://twitter.com/i/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_CALLBACK&scope=tweet.read%20tweet.write%20users.read&response_type=code`
3. User authorizes
4. Exchange code for access token
5. Store tokens

**Posting API:**
```typescript
// POST to Twitter/X
async function postToTwitter(accessToken: string, content: string, mediaIds?: string[]) {
  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: content,
      ...(mediaIds && { media: { media_ids: mediaIds } })
    })
  })
  
  return await response.json()
}
```

**Limitations:**
- API v2 required (paid tiers available)
- Rate limits: Varies by tier (Free: 1,500 tweets/month)
- Character limit: 280 characters
- Media upload requires separate endpoint

---

### 3. **LinkedIn API**

**Requirements:**
- LinkedIn Developer Account
- LinkedIn App created
- OAuth 2.0 setup
- Marketing Developer Platform access

**OAuth Flow:**
1. User clicks "Connect LinkedIn"
2. Redirect to LinkedIn OAuth: `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_CALLBACK&scope=w_member_social`
3. User authorizes
4. Exchange code for access token
5. Store tokens

**Posting API:**
```typescript
// POST to LinkedIn
async function postToLinkedIn(accessToken: string, personUrn: string, content: string) {
  // 1. Register upload (if media)
  // 2. Create post
  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0'
    },
    body: JSON.stringify({
      author: `urn:li:person:${personUrn}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    })
  })
  
  return await response.json()
}
```

**Limitations:**
- Requires Marketing Developer Platform access
- Personal profiles only (not company pages without additional setup)
- Rate limits: 100 posts/day per user
- Complex API structure

---

### 4. **TikTok API**

**Requirements:**
- TikTok Developer Account
- TikTok App created
- OAuth 2.0 setup
- Business account required

**OAuth Flow:**
1. User clicks "Connect TikTok"
2. Redirect to TikTok OAuth
3. User authorizes
4. Exchange code for access token
5. Store tokens

**Posting API:**
```typescript
// POST to TikTok (Note: TikTok API is limited)
async function postToTikTok(accessToken: string, videoData: Buffer, description: string) {
  // TikTok API for posting is very limited
  // May require using TikTok's Content Publishing API
  // This is more complex and may require partnership
}
```

**Limitations:**
- Very limited API access
- May require TikTok partnership
- Primarily for video content
- Not all features available via API

---

### 5. **YouTube API**

**Requirements:**
- Google Cloud Console project
- YouTube Data API v3 enabled
- OAuth 2.0 credentials
- User must have YouTube channel

**OAuth Flow:**
1. User clicks "Connect YouTube"
2. Redirect to Google OAuth: `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_CALLBACK&scope=https://www.googleapis.com/auth/youtube.upload&response_type=code`
3. User authorizes
4. Exchange code for access token
5. Store tokens

**Posting API:**
```typescript
// POST to YouTube (for video uploads)
async function uploadToYouTube(accessToken: string, videoFile: Buffer, title: string, description: string) {
  // YouTube requires multipart upload
  // More complex - requires video file handling
  // See YouTube Data API v3 documentation
}
```

**Limitations:**
- Primarily for video uploads
- Complex upload process
- Large file handling required
- Rate limits: 6,000 units/day (quota system)

---

## 🔧 Implementation Steps

### Step 1: Create OAuth Routes

**File: `src/app/api/auth/connect/[platform]/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const platform = params.platform
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/${platform}`
  
  // Platform-specific OAuth URLs
  const oauthUrls: Record<string, string> = {
    instagram: `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${redirectUri}&scope=instagram_basic,pages_show_list`,
    twitter: `https://twitter.com/i/oauth2/authorize?client_id=${process.env.TWITTER_CLIENT_ID}&redirect_uri=${redirectUri}&scope=tweet.read%20tweet.write%20users.read&response_type=code`,
    linkedin: `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${redirectUri}&scope=w_member_social`,
    // ... etc
  }

  const oauthUrl = oauthUrls[platform]
  if (!oauthUrl) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
  }

  // Redirect to OAuth
  return NextResponse.redirect(oauthUrl)
}
```

---

### Step 2: Create OAuth Callback Handler

**File: `src/app/api/auth/callback/[platform]/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') // Should contain user ID
  
  if (!code || !state) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?error=oauth_failed`)
  }

  const userId = state // Extract from state
  const platform = params.platform

  try {
    // Exchange code for access token (platform-specific)
    const accessToken = await exchangeCodeForToken(platform, code)
    
    // Get user info from platform
    const userInfo = await getPlatformUserInfo(platform, accessToken)
    
    // Store in database
    await db.execute({
      sql: `
        INSERT INTO platform_connections 
        (user_id, platform, access_token, platform_user_id, platform_username, is_active)
        VALUES (?, ?, ?, ?, ?, TRUE)
        ON CONFLICT (user_id, platform) 
        DO UPDATE SET 
          access_token = EXCLUDED.access_token,
          platform_user_id = EXCLUDED.platform_user_id,
          platform_username = EXCLUDED.platform_username,
          updated_at = NOW()
      `,
      args: [userId, platform, accessToken, userInfo.id, userInfo.username]
    })

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?connected=${platform}`)
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?error=oauth_failed`)
  }
}
```

---

### Step 3: Create Posting Service

**File: `src/lib/platformPosting.ts`**

```typescript
import { db } from './db'

interface PostData {
  content: string
  mediaUrls?: string[]
  scheduledAt?: string
}

export async function postToPlatform(
  userId: string,
  platform: string,
  postData: PostData
): Promise<{ success: boolean; postId?: string; error?: string }> {
  // Get user's platform connection
  const connection = await db.execute({
    sql: 'SELECT * FROM platform_connections WHERE user_id = ? AND platform = ? AND is_active = TRUE',
    args: [userId, platform]
  })

  if (connection.rows.length === 0) {
    return { success: false, error: 'Platform not connected' }
  }

  const { access_token } = connection.rows[0] as any

  // Platform-specific posting logic
  switch (platform) {
    case 'instagram':
      return await postToInstagram(access_token, postData)
    case 'twitter':
      return await postToTwitter(access_token, postData)
    case 'linkedin':
      return await postToLinkedIn(access_token, postData)
    // ... etc
    default:
      return { success: false, error: 'Platform not supported' }
  }
}

async function postToInstagram(accessToken: string, postData: PostData) {
  // Implementation from above
}

async function postToTwitter(accessToken: string, postData: PostData) {
  // Implementation from above
}

async function postToLinkedIn(accessToken: string, postData: PostData) {
  // Implementation from above
}
```

---

### Step 4: Create Background Job Scheduler

**File: `src/lib/scheduler.ts`**

```typescript
import { db } from './db'
import { postToPlatform } from './platformPosting'

// Run this as a cron job (every minute)
export async function processScheduledPosts() {
  const now = new Date()
  
  // Get posts scheduled for now (within last minute)
  const scheduledPosts = await db.execute({
    sql: `
      SELECT * FROM content_posts 
      WHERE status = 'scheduled' 
        AND scheduled_at <= ?
        AND scheduled_at >= ? - INTERVAL '1 minute'
    `,
    args: [now, now]
  })

  for (const post of scheduledPosts.rows) {
    try {
      const result = await postToPlatform(
        post.user_id,
        post.platform,
        {
          content: post.content,
          mediaUrls: JSON.parse(post.media_urls || '[]')
        }
      )

      if (result.success) {
        // Update post status
        await db.execute({
          sql: 'UPDATE content_posts SET status = ?, published_at = NOW() WHERE id = ?',
          args: ['published', post.id]
        })
      } else {
        // Mark as failed
        await db.execute({
          sql: 'UPDATE content_posts SET status = ? WHERE id = ?',
          args: ['failed', post.id]
        })
      }
    } catch (error) {
      console.error(`Failed to post ${post.id}:`, error)
      await db.execute({
        sql: 'UPDATE content_posts SET status = ? WHERE id = ?',
        args: ['failed', post.id]
      })
    }
  }
}
```

**Cron Job Setup (Vercel Cron or external service):**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/process-scheduled-posts",
    "schedule": "*/1 * * * *"
  }]
}
```

---

### Step 5: Update Post Creation to Support Direct Posting

**File: `src/app/api/posts/route.ts`** (modify existing)

```typescript
// When status is 'published', post immediately
if (status === 'published') {
  const result = await postToPlatform(userId, platform, {
    content,
    mediaUrls: media_urls || []
  })
  
  if (!result.success) {
    return NextResponse.json({ 
      error: result.error || 'Failed to post to platform' 
    }, { status: 500 })
  }
}
```

---

## 🔐 Security Considerations

1. **Token Storage:**
   - Encrypt access tokens in database
   - Store refresh tokens securely
   - Implement token refresh logic

2. **Rate Limiting:**
   - Respect platform rate limits
   - Implement queuing for high-volume users
   - Add retry logic with exponential backoff

3. **Error Handling:**
   - Handle expired tokens
   - Handle revoked permissions
   - Notify users of posting failures

4. **User Permissions:**
   - Clear consent for platform access
   - Easy disconnect option
   - Show what permissions are requested

---

## 📋 Implementation Checklist

### Phase 1: Foundation
- [ ] Create `platform_connections` table
- [ ] Set up OAuth routes for each platform
- [ ] Create OAuth callback handlers
- [ ] Test OAuth flows

### Phase 2: Posting
- [ ] Implement posting functions for each platform
- [ ] Add error handling and retry logic
- [ ] Test posting for each platform

### Phase 3: Scheduling
- [ ] Create background job scheduler
- [ ] Set up cron job (Vercel Cron or external)
- [ ] Test scheduled posting

### Phase 4: UI Integration
- [ ] Add "Connect Platform" buttons in dashboard
- [ ] Show connection status
- [ ] Add "Post Now" option
- [ ] Show posting status/errors

### Phase 5: Advanced Features
- [ ] Token refresh logic
- [ ] Media upload handling
- [ ] Post editing/deletion
- [ ] Analytics integration

---

## 💰 Costs & Requirements

### Developer Accounts Needed:
- Facebook Developer (Free)
- Twitter Developer (Free, but API access may be paid)
- LinkedIn Developer (Free)
- TikTok Developer (Free, but limited)
- Google Cloud Console (Free tier available)

### API Costs:
- **Instagram/Facebook:** Free (within limits)
- **Twitter:** Free tier limited, paid tiers available
- **LinkedIn:** Free (within limits)
- **TikTok:** Varies
- **YouTube:** Free (within quota)

### Infrastructure:
- Background job service (Vercel Cron or external like Upstash QStash)
- Token storage (encrypted)
- Error monitoring

---

## 🚀 Quick Start Approach

**Option 1: Start with One Platform**
- Implement Instagram first (most requested)
- Test thoroughly
- Add other platforms incrementally

**Option 2: Use Third-Party Service**
- Services like Buffer API, Hootsuite API, or SocialBee API
- Faster implementation
- Higher cost per user
- Less control

**Option 3: Hybrid Approach**
- Direct API for Instagram, Twitter
- Third-party for TikTok, YouTube (complex APIs)

---

## 📚 Resources

- **Instagram:** https://developers.facebook.com/docs/instagram-api
- **Twitter:** https://developer.twitter.com/en/docs
- **LinkedIn:** https://docs.microsoft.com/en-us/linkedin/
- **TikTok:** https://developers.tiktok.com/
- **YouTube:** https://developers.google.com/youtube/v3

---

**Last Updated:** January 2025  
**Status:** Implementation Guide

