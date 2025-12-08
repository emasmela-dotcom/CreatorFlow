# CreatorFlow Complete Tool Documentation

## 📚 Overview

This document provides comprehensive documentation for **all tools and features** in CreatorFlow. Every tool includes:
- **What it is** - Clear description
- **Who it's for** - Use cases and target users
- **How to use it** - Step-by-step instructions
- **API endpoint** - For developers (if applicable)

---

## 🤖 AI-Powered Bots (18 Total)

All bots are **FREE** and included in every plan. Performance scales with your subscription tier.

### 1. Content Assistant Bot

**What it is:** Real-time content analysis and optimization suggestions as you type your posts.

**Who it's for:** All content creators who want to improve their post quality before publishing.

**How to use:**
1. Navigate to Create Post page (`/create`)
2. Select your platform (Instagram, Twitter, LinkedIn, etc.)
3. Start typing your post content
4. Watch the bot analyze in real-time:
   - Content score (0-100)
   - Word count, hashtag count, emoji usage
   - Platform-specific recommendations
5. Follow the suggestions:
   - Green indicators = Good
   - Yellow warnings = Needs improvement
   - Red alerts = Important fixes needed

**What it analyzes:**
- Length: Optimal character/word count for your platform
- Hashtags: Number and relevance (Instagram: 3-5 recommended)
- Tone: Engagement-friendly language
- Grammar: Basic spelling and readability
- Platform Optimization: Best practices for each social platform

**API Endpoint:** `POST /api/bots/content-assistant`

**Example Request:**
```json
{
  "content": "Your post content here",
  "platform": "instagram"
}
```

---

### 2. Scheduling Assistant Bot

**What it is:** AI-powered suggestions for optimal posting times based on your audience engagement patterns.

**Who it's for:** Creators who want to maximize engagement by posting at the right times.

**How to use:**
1. Navigate to Dashboard → AI Bots tab, or Create Post page
2. Select your platform
3. View optimal times displayed by day and time slot
4. Click a suggested time to auto-fill your schedule
5. Review the recommendations:
   - Best days of the week
   - Peak engagement hours
   - Platform-specific timing

**What it analyzes:**
- Your historical posting data
- Engagement patterns by day/time
- Platform-specific best practices
- Your audience's active hours

**API Endpoint:** `POST /api/bots/scheduling-assistant`

**Example Request:**
```json
{
  "platform": "instagram",
  "timezone": "America/New_York"
}
```

---

### 3. Engagement Analyzer Bot

**What it is:** Analyzes your past post performance to identify what content works best.

**Who it's for:** Creators who want to understand their audience and improve content strategy.

**How to use:**
1. Navigate to Dashboard → AI Bots tab
2. Select your platform
3. View analysis of your recent posts:
   - Average engagement rate
   - Best performing posts
   - Trends (best days, times, hashtags)
   - Content type performance
4. Review insights and recommendations
5. Use insights to create better content

**What it analyzes:**
- Post engagement metrics (likes, comments, shares)
- Best performing content types
- Optimal posting times
- Hashtag performance
- Content patterns

**API Endpoint:** `POST /api/bots/engagement-analyzer`

**Example Request:**
```json
{
  "platform": "instagram",
  "timeframe": "30days"
}
```

---

### 4. Trend Scout Bot

**What it is:** Identifies trending topics and viral opportunities in your niche.

**Who it's for:** Creators who want to stay current and jump on trending topics.

**How to use:**
1. Navigate to Dashboard → AI Bots tab
2. Select your platform and niche
3. View trending topics and hashtags
4. Review opportunities and recommendations
5. Create content based on trending topics
6. Check best time to post for trends

**What it identifies:**
- Trending hashtags in your niche
- Viral content opportunities
- Competitor content gaps
- Emerging topics

**API Endpoint:** `POST /api/bots/trend-scout`

**Example Request:**
```json
{
  "platform": "instagram",
  "niche": "fitness"
}
```

---

### 5. Content Curation Bot

**What it is:** Suggests content ideas and identifies gaps in your content strategy.

**Who it's for:** Creators struggling with "what to create next" or wanting to diversify content.

**How to use:**
1. Navigate to Dashboard → AI Bots tab
2. Select your platform
3. View content ideas based on your niche
4. Review content gaps (what you're missing)
5. Get recommendations for next posts
6. Create content based on suggestions

**What it provides:**
- Content ideas with descriptions
- Content type suggestions
- Hashtag recommendations
- Engagement potential estimates
- Content gap analysis

**API Endpoint:** `POST /api/bots/content-curation`

**Example Request:**
```json
{
  "platform": "instagram",
  "niche": "business"
}
```

---

### 6. Analytics Coach Bot

**What it is:** Provides personalized growth insights and strategies based on your analytics.

**Who it's for:** Creators who want actionable growth strategies, not just data.

**How to use:**
1. Navigate to Dashboard → AI Bots tab
2. Select your platform
3. View personalized insights:
   - Growth metrics and trends
   - Strategy recommendations
   - Performance predictions
   - Actionable recommendations
4. Review growth score (0-100)
5. Implement suggested strategies

**What it provides:**
- Growth insights with trends
- Strategy recommendations by area
- Performance predictions
- Actionable growth strategies
- Growth score calculation

**API Endpoint:** `POST /api/bots/analytics-coach`

**Example Request:**
```json
{
  "platform": "instagram",
  "timeframe": "30days"
}
```

---

### 7. Content Writer Bot

**What it is:** AI-powered content generation tool that creates blog posts, articles, social media content, and more.

**Who it's for:** Content creators, marketers, bloggers, and businesses that need to produce high-quality content consistently.

**How to use:**
1. Navigate to Dashboard → AI Bots tab
2. Provide topic, content type (blog post, article, social post), and tone
3. Specify length, platform, and target keywords
4. Bot generates content based on your requirements
5. Review and edit generated content
6. Save drafts and publish when ready
7. Track content performance and optimize

**API Endpoint:** `POST /api/bots/content-writer`

**Example Request:**
```json
{
  "topic": "AI Technology Trends",
  "type": "blog-post",
  "tone": "professional",
  "length": 1000,
  "platform": "blog",
  "keywords": ["AI", "technology", "trends"]
}
```

---

### 8. Content Repurposing Bot

**What it is:** Automatically transforms one piece of content into multiple platform-specific formats.

**Who it's for:** Content creators, marketers, and businesses that create content once but need to adapt it for multiple platforms.

**How to use:**
1. Navigate to Dashboard → AI Bots tab
2. Paste your original content (blog post, article, video script, etc.)
3. Select the content type (blog-post, article, video-script, etc.)
4. Choose target platforms (Instagram, Twitter, LinkedIn, TikTok, YouTube, Pinterest)
5. Bot automatically formats content for each platform
6. Copy and use the repurposed content directly on each platform
7. View repurposing history in your dashboard

**API Endpoint:** `POST /api/bots/content-repurposing`

**Example Request:**
```json
{
  "originalContent": "Your blog post content here...",
  "contentType": "blog-post",
  "targetPlatforms": ["instagram", "twitter", "linkedin", "tiktok", "youtube"]
}
```

---

### 9. Content Gap Analyzer Bot

**What it is:** Identifies content opportunities your competitors are missing.

**Who it's for:** Content creators, marketers, and businesses who want to stay ahead of the competition.

**How to use:**
1. Navigate to Dashboard → AI Bots tab
2. Enter competitor topics (what they're covering)
3. Enter your existing topics (what you've already covered)
4. Optionally add niche, target audience, and format preferences
5. Bot analyzes gaps and identifies missing topics
6. Get prioritized content suggestions with recommended formats and angles
7. Discover your unique advantages (topics you cover that competitors don't)
8. View analysis history to track your content strategy evolution

**API Endpoint:** `POST /api/bots/content-gap-analyzer`

**Example Request:**
```json
{
  "competitorTopics": ["How to start a business", "Marketing strategies"],
  "yourTopics": ["Social media marketing"],
  "niche": "Business",
  "targetAudience": "Entrepreneurs"
}
```

---

### 10. Social Media Manager Bot

**What it is:** Advanced social media management tool for creating, scheduling, and managing posts across multiple platforms.

**Who it's for:** Social media managers, marketers, and businesses that manage multiple social media accounts.

**How to use:**
1. Navigate to Dashboard → AI Bots tab
2. Create posts for Instagram, Twitter, LinkedIn, TikTok, or YouTube
3. Add media (images, videos) and hashtags
4. Schedule posts for optimal posting times
5. View all posts in calendar view
6. Track post performance and engagement
7. Bulk schedule multiple posts at once

**API Endpoint:** `POST /api/bots/social-media-manager`

**Example Request:**
```json
{
  "platform": "instagram",
  "content": "Check out our new product! #newproduct #innovation",
  "mediaUrls": ["https://example.com/image.jpg"],
  "scheduledAt": "2024-01-20T14:00:00Z",
  "hashtags": ["newproduct", "innovation"]
}
```

---

### 11. Expense Tracker Bot

**What it is:** Track and manage all your business expenses with automatic categorization, budget management, and financial reporting.

**Who it's for:** Freelancers, small businesses, and anyone who needs to track expenses for tax purposes or budget management.

**How to use:**
1. Navigate to Dashboard → AI Bots tab
2. Add expenses by providing date, amount, description, and optional category
3. Set budgets by category to track spending limits
4. View expense reports and analytics
5. Export data for accounting or tax purposes
6. Track recurring expenses automatically

**API Endpoint:** `POST /api/bots/expense-tracker`

**Example Request:**
```json
{
  "expenseDate": "2024-01-15",
  "amount": 50.00,
  "description": "Office supplies",
  "categoryId": 1
}
```

---

### 12. Invoice Generator Bot

**What it is:** Create professional invoices, track payments, manage clients, and automate your billing process.

**Who it's for:** Freelancers, consultants, agencies, and small businesses that need to invoice clients regularly.

**How to use:**
1. Navigate to Dashboard → AI Bots tab
2. Add clients to your client database
3. Create invoices with line items, tax, and discounts
4. Track invoice status (draft, sent, paid, overdue)
5. Record payments and view outstanding balances
6. Generate financial reports and aging reports
7. Set up automatic payment reminders

**API Endpoint:** `POST /api/bots/invoice-generator`

**Example Request:**
```json
{
  "clientId": 1,
  "invoiceDate": "2024-01-15",
  "dueDate": "2024-02-15",
  "items": [{"description": "Web Design", "quantity": 10, "unit_price": 100}]
}
```

---

### 13. Email Sorter Bot

**What it is:** Automatically categorize and prioritize your emails using AI, so you can focus on what matters most.

**Who it's for:** Busy professionals who receive many emails and need automatic organization and prioritization.

**How to use:**
1. Navigate to Dashboard → AI Bots tab
2. Send email data (from, subject, body) to the API
3. Bot automatically categorizes emails (urgent, sales, support, etc.)
4. Get priority level (low, normal, high, urgent)
5. View sorted emails by category or priority
6. Set up custom categories for your business needs

**API Endpoint:** `POST /api/bots/email-sorter`

**Example Request:**
```json
{
  "from": "client@example.com",
  "subject": "Urgent: Project Update",
  "body": "We need to discuss the project..."
}
```

---

### 14. Customer Service Bot

**What it is:** AI-powered customer support chatbot that handles inquiries, answers questions, and escalates when needed.

**Who it's for:** Businesses that want 24/7 customer support without hiring a full support team.

**How to use:**
1. Navigate to Dashboard → AI Bots tab
2. Add knowledge base entries with common questions and answers
3. Configure bot settings (greeting message, escalation rules)
4. Chat widget automatically responds to customer inquiries
5. View all conversations in the admin dashboard
6. Bot escalates to human support when needed
7. Track analytics and customer satisfaction

**API Endpoint:** `POST /api/bots/customer-service`

**Example Request:**
```json
{
  "message": "What are your business hours?",
  "conversationId": "conv_123",
  "customerName": "John Doe"
}
```

---

### 15. Product Recommendation Bot

**What it is:** AI-powered product recommendation engine that suggests products to customers based on their preferences and purchase history.

**Who it's for:** E-commerce stores, marketplaces, and businesses selling multiple products who want to increase sales through personalized recommendations.

**How to use:**
1. Navigate to Dashboard → AI Bots tab
2. Add products to your catalog with categories and details
3. Track customer purchase history and preferences
4. Bot analyzes customer data and product attributes
5. Get personalized product recommendations for each customer
6. View recommendation analytics and conversion rates
7. A/B test different recommendation strategies

**API Endpoint:** `POST /api/bots/product-recommendation`

**Example Request:**
```json
{
  "customerId": 123,
  "category": "electronics",
  "preferences": ["wireless", "portable"]
}
```

---

### 16. Sales Lead Qualifier Bot

**What it is:** Automatically score and qualify sales leads to help your sales team focus on the most promising opportunities.

**Who it's for:** Sales teams, B2B businesses, and anyone who needs to prioritize leads and improve conversion rates.

**How to use:**
1. Navigate to Dashboard → AI Bots tab
2. Submit lead information (company, contact, industry, etc.)
3. Bot calculates qualification score (0-100) based on multiple factors
4. Leads are automatically marked as qualified or unqualified
5. Get AI-powered recommendations for each lead
6. View all leads in dashboard sorted by score
7. Export qualified leads for your sales team

**API Endpoint:** `POST /api/bots/sales-lead-qualifier`

**Example Request:**
```json
{
  "companyName": "Acme Corp",
  "contactName": "John Doe",
  "email": "john@acme.com",
  "industry": "Technology",
  "companySize": "100-500"
}
```

---

### 17. Website Chat Bot

**What it is:** Live chat widget for your website that engages visitors, answers questions, and captures leads 24/7.

**Who it's for:** Any business website that wants to engage visitors, answer questions, and convert more leads.

**How to use:**
1. Navigate to Dashboard → AI Bots tab
2. Embed the chat widget code on your website
3. Configure bot settings (greeting, responses, business hours)
4. Chat widget appears on your website automatically
5. Visitors can chat and get instant responses
6. View all conversations in admin dashboard
7. Export leads and conversation transcripts

**API Endpoint:** `POST /api/bots/website-chat`

**Example Request:**
```json
{
  "message": "Hello, I have a question",
  "sessionId": "sess_123",
  "visitorName": "Jane Doe",
  "pageUrl": "https://yoursite.com/products"
}
```

---

### 18. Meeting Scheduler Bot

**What it is:** Advanced meeting scheduling system with automatic reminders, calendar integration, and conflict detection.

**Who it's for:** Consultants, coaches, service businesses, and anyone who schedules meetings regularly and wants to automate the process.

**How to use:**
1. Navigate to Dashboard → AI Bots tab
2. Create meetings with title, description, date/time, and attendees
3. Set up meeting types (consultation, follow-up, team meeting, etc.)
4. Bot sends automatic reminders to all attendees
5. View all scheduled meetings in calendar view
6. Reschedule or cancel meetings easily
7. Track meeting attendance and notes

**API Endpoint:** `POST /api/bots/meeting-scheduler`

**Example Request:**
```json
{
  "title": "Client Consultation",
  "startTime": "2024-01-20T10:00:00Z",
  "endTime": "2024-01-20T11:00:00Z",
  "attendees": ["client@example.com"],
  "location": "Zoom"
}
```

---

## 🛠️ Core Tools

### 19. Hashtag Research Tool

**What it is:** Find trending hashtags in your niche, get personalized recommendations based on your content, and save hashtag sets for quick reuse.

**Who it's for:** Content creators who want to optimize their hashtag strategy.

**How to use:**
1. Navigate to Dashboard → Content tab → Hashtag Research
2. Select your platform (Instagram, Twitter, TikTok, LinkedIn, YouTube)
3. Enter your niche (optional - auto-detected from your content)
4. Paste your content to get personalized hashtag recommendations
5. View trending hashtags in your niche with reach and engagement data
6. Save hashtag sets for quick reuse in future posts
7. Manage and organize your saved hashtag sets

**API Endpoint:** `POST /api/hashtag-research`

**Example Request:**
```json
{
  "action": "research",
  "platform": "instagram",
  "niche": "fitness",
  "content": "Your post content here..."
}
```

---

### 20. Content Templates Tool

**What it is:** Save and reuse post templates to speed up your content creation.

**Who it's for:** Creators who post similar content regularly or want to maintain consistent messaging.

**How to use:**
1. Navigate to Dashboard → Content tab → Templates
2. Create a new template with name, platform, and content
3. Use {variable} placeholders in templates for dynamic content
4. Organize templates by category (e.g., "Product Launch", "Weekly Tips")
5. Copy templates directly to clipboard when creating posts
6. Edit or delete templates as your content strategy evolves
7. Filter templates by platform or category

**API Endpoint:** `POST /api/content-templates`

**Example Request:**
```json
{
  "name": "Product Launch",
  "platform": "instagram",
  "content": "Excited to announce {product}! {description} #NewProduct",
  "category": "Announcements"
}
```

---

### 21. Engagement Inbox Tool

**What it is:** Centralized inbox for managing all your social media engagement - comments, messages, mentions, and replies.

**Who it's for:** Creators who want to stay on top of audience engagement.

**How to use:**
1. Navigate to Dashboard → Content tab → Engagement Inbox
2. View all engagement in one unified inbox
3. Filter by platform, type (comment/message/mention), or status
4. Mark items as read, replied, or archived
5. Track unread count to stay on top of engagement
6. Manually add engagement items or integrate with social platforms
7. Organize and prioritize your audience interactions

**API Endpoint:** `POST /api/engagement-inbox`

**Example Request:**
```json
{
  "action": "add",
  "platform": "instagram",
  "type": "comment",
  "content": "Great post!",
  "author_name": "John Doe"
}
```

---

### 22. Documents Feature

**What it is:** Save and organize content drafts, notes, and ideas in one place.

**Who it's for:** All creators who want to organize their content ideas and drafts.

**How to use:**
1. Navigate to Dashboard → Content tab → Documents
2. Create a new document with title and content
3. Add category and tags for organization
4. Save drafts and edit later
5. Search documents by title, content, category, or tags
6. Copy content directly to clipboard
7. Delete documents you no longer need

**API Endpoint:** `POST /api/documents`

**Example Request:**
```json
{
  "title": "Blog Post Ideas",
  "content": "Your content here...",
  "category": "Ideas",
  "tags": "blog, ideas, content"
}
```

---

### 23. Content Calendar/Scheduler

**What it is:** Visual calendar for planning and scheduling posts across all platforms.

**Who it's for:** Creators who want to plan content in advance and maintain a consistent posting schedule.

**How to use:**
1. Navigate to Dashboard → Calendar tab
2. View scheduled posts in calendar view
3. Filter by platform or date range
4. Create new scheduled posts
5. Edit or delete scheduled posts
6. See post status (scheduled, published, draft)
7. View engagement metrics for published posts

**API Endpoint:** `GET /api/calendar?startDate=2024-01-01&endDate=2024-01-31`

**Example POST Request:**
```json
{
  "platform": "instagram",
  "content": "Your post content",
  "scheduledAt": "2024-01-20T14:00:00Z",
  "status": "scheduled"
}
```

---

### 24. Content Library Search

**What it is:** Unified search across all your content - documents, templates, and hashtag sets.

**Who it's for:** Creators with lots of content who need to find specific items quickly.

**How to use:**
1. Use the search bar in the dashboard header
2. Type your search query
3. View results across all content types:
   - Documents
   - Templates
   - Hashtag Sets
4. Filter by content type if needed
5. Click results to view or edit
6. Search by title, content, category, or tags

**API Endpoint:** `GET /api/search?q=your+query&type=all`

---

### 25. Performance Analytics Dashboard

**What it is:** Comprehensive analytics dashboard showing your content performance across all platforms.

**Who it's for:** Creators who want to track growth and optimize their content strategy.

**How to use:**
1. Navigate to Dashboard → Analytics tab
2. View overview metrics:
   - Total posts
   - Total engagement
   - Average engagement
   - Growth rate
3. Filter by platform or time period (7, 30, 90 days)
4. View top performing posts
5. See engagement breakdown by platform
6. Track growth trends over time
7. Export analytics data

**API Endpoint:** `GET /api/analytics/performance?days=30&platform=instagram`

---

## 📖 Quick Reference

### All Tools by Category

**AI Bots (18):**
1. Content Assistant
2. Scheduling Assistant
3. Engagement Analyzer
4. Trend Scout
5. Content Curation
6. Analytics Coach
7. Content Writer
8. Content Repurposing
9. Content Gap Analyzer
10. Social Media Manager
11. Expense Tracker
12. Invoice Generator
13. Email Sorter
14. Customer Service
15. Product Recommendation
16. Sales Lead Qualifier
17. Website Chat
18. Meeting Scheduler

**Core Tools (6):**
1. Hashtag Research
2. Content Templates
3. Engagement Inbox
4. Documents
5. Content Calendar
6. Content Library Search
7. Performance Analytics

**Total: 25 Tools**

---

## ❓ Frequently Asked Questions

**Q: Are all tools free?**  
A: Yes! All tools are included in every plan. Usage limits vary by plan tier.

**Q: Do tools work on all platforms?**  
A: Most tools support Instagram, Twitter/X, LinkedIn, TikTok, and YouTube. Some tools are platform-agnostic.

**Q: Can I use multiple tools at once?**  
A: Yes! You can use any combination of tools. They work together to enhance your workflow.

**Q: Where do I find the tools?**  
A: Navigate to Dashboard → AI Bots tab for bots, or Dashboard → Content tab for core tools.

**Q: Is there documentation for each tool?**  
A: Yes! Click on any tool in the dashboard to see detailed documentation, use cases, and API endpoints.

---

---

## 26. Direct Posting to Social Media Platforms

**What it is:** Connect your social media accounts and post directly to platforms without leaving CreatorFlow. Schedule posts to publish automatically.

**Who it's for:** All creators who want to save time by automating their posting workflow.

**How to use:**
1. Connect your platform account (Twitter, LinkedIn, Instagram, etc.)
2. Create your post content
3. Select the connected platform
4. Click "Post Now" for immediate posting, or "Schedule" for later
5. CreatorFlow posts automatically at the scheduled time
6. View your posts in the Calendar

**Supported Platforms:**
- Twitter/X - Full support
- LinkedIn - Full support  
- Instagram - Requires Business/Creator account
- TikTok - Limited (may require partnership)
- YouTube - Video uploads only

**API Endpoint:** `GET /api/auth/connect/[platform]` (to connect), `POST /api/posts` (to post)

**For detailed documentation:** See `DIRECT_POSTING_DOCUMENTATION.md`

---

**Last Updated:** January 2025  
**Total Tools Documented:** 26

