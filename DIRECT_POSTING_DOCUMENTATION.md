# Direct Posting to Social Media Platforms - Complete Guide

## 📚 Overview

CreatorFlow's Direct Posting feature allows you to connect your social media accounts and post directly to platforms without leaving CreatorFlow. Once connected, you can publish posts immediately or schedule them to post automatically.

---

## 🎯 What is Direct Posting?

**Direct Posting** means CreatorFlow can post to your social media accounts automatically using platform APIs. Instead of copying content and posting manually, CreatorFlow handles it for you.

**Supported Platforms:**
- ✅ Twitter/X (Full support)
- ✅ LinkedIn (Full support)
- ✅ Instagram (Requires Business/Creator account)
- ⚠️ TikTok (Limited - may require partnership)
- ⚠️ YouTube (Video uploads only - complex)

---

## 🔧 How It Works

### Step 1: Connect Your Platform Account

1. **Navigate to Dashboard**
   - Go to your CreatorFlow dashboard
   - Look for "Platform Connections" or "Connect Accounts" section

2. **Click "Connect [Platform]"**
   - Example: "Connect Twitter"
   - This will redirect you to the platform's authorization page

3. **Authorize CreatorFlow**
   - Log in to your platform account
   - Review permissions requested
   - Click "Authorize" or "Allow"

4. **Return to CreatorFlow**
   - You'll be redirected back to CreatorFlow
   - Your account is now connected!

### Step 2: Create and Post Content

**Option A: Post Immediately**
1. Create your post in CreatorFlow
2. Select the connected platform
3. Click "Post Now" or set status to "Published"
4. CreatorFlow posts directly to the platform
5. You'll see confirmation with the platform post ID

**Option B: Schedule Post**
1. Create your post
2. Select date and time
3. Click "Schedule"
4. CreatorFlow automatically posts at the scheduled time
5. No manual action needed!

---

## 📖 Detailed Usage Guide

### Connecting Platforms

#### Twitter/X Connection

**Requirements:**
- Twitter account
- Twitter Developer account (free)
- OAuth app created

**Steps:**
1. Click "Connect Twitter" in dashboard
2. You'll be redirected to Twitter
3. Log in and authorize CreatorFlow
4. You'll be redirected back
5. Twitter is now connected!

**What CreatorFlow Can Do:**
- Post tweets (up to 280 characters)
- Schedule tweets
- Post with media (images)

**Limitations:**
- Rate limits apply (varies by Twitter API tier)
- Character limit: 280 characters
- Media upload requires separate step

---

#### LinkedIn Connection

**Requirements:**
- LinkedIn account
- LinkedIn Developer account (free)
- OAuth app created

**Steps:**
1. Click "Connect LinkedIn" in dashboard
2. You'll be redirected to LinkedIn
3. Log in and authorize CreatorFlow
4. You'll be redirected back
5. LinkedIn is now connected!

**What CreatorFlow Can Do:**
- Post to your LinkedIn feed
- Schedule LinkedIn posts
- Post with text content

**Limitations:**
- Personal profiles only (company pages require additional setup)
- Rate limit: ~100 posts/day
- Media attachments require additional API calls

---

#### Instagram Connection

**Requirements:**
- Instagram Business or Creator account (not personal)
- Facebook Page connected to Instagram
- Facebook Developer account
- Facebook App with Instagram permissions

**Steps:**
1. Ensure your Instagram is a Business/Creator account
2. Connect it to a Facebook Page
3. Click "Connect Instagram" in dashboard
4. You'll be redirected to Facebook
5. Authorize CreatorFlow to access your Instagram
6. Instagram is now connected!

**What CreatorFlow Can Do:**
- Post single images
- Post image carousels (up to 10 images)
- Post video reels (up to 15 minutes)
- Schedule posts

**Limitations:**
- Only Business/Creator accounts (not personal)
- Requires Facebook Page connection
- Rate limit: 25 posts per 24 hours
- App review may be required

---

### Creating Posts with Direct Posting

#### Method 1: Post Immediately

1. **Go to Create Post page**
   - Navigate to `/create` or click "Create Post"

2. **Select Connected Platform**
   - Choose a platform you've connected
   - You'll see a checkmark or "Connected" indicator

3. **Write Your Content**
   - Enter your post content
   - Add hashtags if desired
   - Upload media if needed

4. **Click "Post Now"**
   - Post is published immediately
   - You'll see confirmation
   - Post appears on the platform right away

---

#### Method 2: Schedule Post

1. **Create Your Post**
   - Write content as usual
   - Select connected platform

2. **Set Schedule**
   - Choose date and time
   - Use optimal time suggestions if available

3. **Click "Schedule"**
   - Post is saved with `status: 'scheduled'`
   - CreatorFlow will post automatically at scheduled time
   - No manual action needed!

4. **View Scheduled Posts**
   - Go to Calendar tab
   - See all scheduled posts
   - Edit or delete if needed

---

### Managing Platform Connections

#### View Connected Platforms

1. Go to Dashboard → Settings or Platform Connections
2. See list of all connected platforms
3. View connection status, username, last used date

#### Disconnect a Platform

1. Go to Platform Connections
2. Find the platform you want to disconnect
3. Click "Disconnect" or "Remove"
4. Confirm disconnection
5. Platform is disconnected (posts won't work until reconnected)

#### Reconnect a Platform

1. If connection expires or fails
2. Go to Platform Connections
3. Click "Reconnect [Platform]"
4. Follow OAuth flow again
5. Platform reconnected!

---

## ⚙️ Technical Details

### How OAuth Works

1. **User Initiates Connection**
   - Clicks "Connect Platform"
   - CreatorFlow redirects to platform OAuth page

2. **User Authorizes**
   - Logs in to platform
   - Reviews permissions
   - Grants access

3. **Platform Returns Token**
   - Platform redirects back with authorization code
   - CreatorFlow exchanges code for access token
   - Token stored securely in database

4. **Ready to Post**
   - Token used for API calls
   - CreatorFlow can post on user's behalf

### Token Management

- **Access Tokens:** Used for API calls
- **Refresh Tokens:** Used to get new access tokens when expired
- **Expiration:** Tokens expire (varies by platform)
- **Auto-Refresh:** CreatorFlow attempts to refresh expired tokens
- **Manual Refresh:** User may need to reconnect if auto-refresh fails

### Scheduled Posting System

1. **Post Created with Schedule**
   - Saved to database with `status: 'scheduled'`
   - `scheduled_at` timestamp set

2. **Cron Job Runs**
   - Background job runs every minute
   - Checks for posts scheduled in the past minute

3. **Posting Process**
   - Gets post from database
   - Checks platform connection
   - Calls platform API to post
   - Updates post status to 'published'
   - Stores platform post ID

4. **Error Handling**
   - If posting fails, status set to 'failed'
   - User notified of failure
   - Can retry or post manually

---

## 🚨 Troubleshooting

### "Platform not connected" Error

**Problem:** Trying to post but platform isn't connected

**Solution:**
1. Go to Platform Connections
2. Click "Connect [Platform]"
3. Complete OAuth flow
4. Try posting again

---

### "Token expired" Error

**Problem:** Platform connection expired

**Solution:**
1. Go to Platform Connections
2. Click "Reconnect [Platform]"
3. Re-authorize CreatorFlow
4. Connection refreshed

---

### Post Failed to Publish

**Problem:** Post created but didn't appear on platform

**Possible Causes:**
- Platform connection issue
- API rate limit exceeded
- Content violates platform rules
- Network error

**Solution:**
1. Check Platform Connections status
2. Try posting again
3. Check platform's error message
4. Verify content meets platform requirements
5. Contact support if issue persists

---

### Scheduled Post Didn't Post

**Problem:** Post scheduled but didn't post at scheduled time

**Possible Causes:**
- Cron job not running
- Platform connection expired
- API error

**Solution:**
1. Check if cron job is configured
2. Verify platform connection is active
3. Check post status in Calendar
4. Try posting manually if needed
5. Reschedule if necessary

---

### Instagram Connection Issues

**Problem:** Can't connect Instagram account

**Common Issues:**
- Personal account (needs Business/Creator)
- No Facebook Page connected
- App not approved by Facebook

**Solution:**
1. Convert Instagram to Business/Creator account
2. Connect Instagram to Facebook Page
3. Ensure Facebook App is approved
4. Try connecting again

---

## 📋 Best Practices

### 1. **Keep Connections Active**
- Check Platform Connections regularly
- Reconnect if tokens expire
- Don't disconnect unless necessary

### 2. **Test Before Scheduling**
- Post one test post immediately
- Verify it appears on platform
- Then schedule future posts

### 3. **Monitor Scheduled Posts**
- Check Calendar regularly
- Verify posts published successfully
- Fix any failed posts

### 4. **Respect Platform Limits**
- Don't exceed rate limits
- Follow platform content policies
- Don't spam or post too frequently

### 5. **Have Backup Plan**
- Keep manual posting as backup
- Don't rely 100% on automation
- Be ready to post manually if needed

---

## 🔒 Security & Privacy

### What CreatorFlow Can Access

**Twitter:**
- Read your profile
- Post tweets on your behalf
- View your tweets

**LinkedIn:**
- Read your profile
- Post to your feed
- View your posts

**Instagram:**
- Post to your Instagram
- View your Instagram profile
- Access your Instagram Business account

### What CreatorFlow Cannot Do

- ❌ Delete your posts
- ❌ Change your password
- ❌ Access your messages (unless specifically authorized)
- ❌ Access your payment information
- ❌ Post without your explicit action

### Data Storage

- **Tokens:** Encrypted and stored securely
- **Post Content:** Stored in CreatorFlow database
- **Platform Data:** Only what's needed for posting

### Revoking Access

- Disconnect platform anytime
- Tokens immediately invalidated
- CreatorFlow can no longer post
- Your platform account remains secure

---

## 📊 API Endpoints

### Connect Platform
```
GET /api/auth/connect/[platform]
```
- Initiates OAuth flow
- Redirects to platform authorization

### OAuth Callback
```
GET /api/auth/callback/[platform]
```
- Handles OAuth callback
- Stores connection
- Redirects to dashboard

### Get Connections
```
GET /api/platforms/connections
```
- Returns user's connected platforms
- Shows connection status

### Disconnect Platform
```
DELETE /api/platforms/connections?platform=[platform]
```
- Disconnects platform
- Removes tokens from database

### Process Scheduled Posts (Cron)
```
GET /api/cron/process-scheduled-posts
```
- Background job for scheduled posting
- Runs every minute
- Requires CRON_SECRET authentication

---

## 🎯 Use Cases

### Use Case 1: Daily Content Creator
**Scenario:** Post 3 times per day across platforms

**Workflow:**
1. Connect all platforms in morning
2. Create 3 posts for the day
3. Schedule them for optimal times
4. CreatorFlow posts automatically
5. Focus on creating content, not posting

---

### Use Case 2: Weekly Batch Scheduling
**Scenario:** Plan entire week of content

**Workflow:**
1. Connect platforms
2. Create all posts for the week
3. Schedule each post for specific day/time
4. CreatorFlow posts throughout the week
5. Review and adjust as needed

---

### Use Case 3: Multi-Platform Campaign
**Scenario:** Launch product across all platforms simultaneously

**Workflow:**
1. Connect all platforms
2. Create campaign post
3. Use Content Repurposing Bot to adapt for each platform
4. Schedule all posts for same time
5. Launch happens automatically across all platforms

---

## ❓ Frequently Asked Questions

**Q: Is it safe to connect my accounts?**  
A: Yes! CreatorFlow uses OAuth (same security as other apps). You can disconnect anytime.

**Q: Can CreatorFlow delete my posts?**  
A: No. CreatorFlow can only create posts, not delete them.

**Q: What if I disconnect a platform?**  
A: Scheduled posts for that platform won't post. You'll need to reconnect or post manually.

**Q: Do I need to keep CreatorFlow open?**  
A: No! Scheduled posts work even if you close CreatorFlow. The cron job runs on the server.

**Q: Can I edit posts after scheduling?**  
A: Yes! Go to Calendar, find the post, and edit it. Changes will be posted at scheduled time.

**Q: What happens if a post fails?**  
A: Post status changes to "failed". You'll be notified and can retry or post manually.

**Q: Can I post to multiple platforms at once?**  
A: Yes! Select multiple platforms when creating a post. Each will post separately.

**Q: Are there posting limits?**  
A: Yes, each platform has rate limits. CreatorFlow respects these limits automatically.

**Q: Can I schedule posts for months ahead?**  
A: Yes! Schedule as far ahead as you want. CreatorFlow will post at the scheduled time.

**Q: What if I want to cancel a scheduled post?**  
A: Go to Calendar, find the post, and delete it. It won't be posted.

---

## 🚀 Getting Started Checklist

- [ ] Review platform requirements (Business account for Instagram, etc.)
- [ ] Set up developer accounts if needed (Twitter, LinkedIn, etc.)
- [ ] Connect your first platform (start with Twitter - easiest)
- [ ] Test posting one post immediately
- [ ] Verify post appeared on platform
- [ ] Schedule a test post for later
- [ ] Verify scheduled post posted automatically
- [ ] Connect additional platforms
- [ ] Start scheduling your content!

---

## 📞 Need Help?

If you encounter issues:
1. Check this documentation
2. Review troubleshooting section
3. Check Platform Connections status
4. Try reconnecting the platform
5. Contact support if issue persists

---

**Last Updated:** January 2025  
**Status:** Active Feature - Ready to Use (with API credentials)

