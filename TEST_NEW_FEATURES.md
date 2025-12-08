# Testing New Features

## ✅ Features Added

1. **Content Calendar/Scheduler** - `/api/calendar`
2. **Content Library Search** - `/api/search`
3. **Performance Analytics Dashboard** - `/api/analytics/performance`

## 🧪 Manual Testing Guide

### Prerequisites
- Server running (local or production)
- User authenticated (have a valid token)

### Test 1: Content Calendar

**API Endpoint:** `/api/calendar`

#### Test GET (View Calendar)
```bash
curl -X GET "http://localhost:3000/api/calendar?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "events": [...],
  "dateRange": { "start": "2024-01-01", "end": "2024-01-31" }
}
```

#### Test POST (Schedule Post)
```bash
curl -X POST "http://localhost:3000/api/calendar" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "instagram",
    "content": "Test scheduled post",
    "scheduledAt": "2024-01-20T14:00:00Z",
    "status": "scheduled"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "event": { "id": "...", "platform": "instagram", ... }
}
```

#### Test DELETE (Remove Scheduled Post)
```bash
curl -X DELETE "http://localhost:3000/api/calendar?id=POST_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Test 2: Content Library Search

**API Endpoint:** `/api/search`

#### Test Search (All Types)
```bash
curl -X GET "http://localhost:3000/api/search?q=test" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "query": "test",
  "results": {
    "documents": [...],
    "templates": [...],
    "hashtagSets": [...]
  },
  "total": 5
}
```

#### Test Search by Type
```bash
curl -X GET "http://localhost:3000/api/search?q=test&type=documents" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Test 3: Performance Analytics

**API Endpoint:** `/api/analytics/performance`

#### Test Analytics (Last 30 Days)
```bash
curl -X GET "http://localhost:3000/api/analytics/performance?days=30" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "period": { "days": 30, "startDate": "...", "endDate": "..." },
  "overview": {
    "totalPosts": 10,
    "totalEngagement": 500,
    "avgEngagement": 50,
    "growthRate": 15
  },
  "byPlatform": {
    "posts": { "instagram": 5, "twitter": 3 },
    "engagement": { "instagram": 300, "twitter": 200 }
  },
  "topPosts": [...]
}
```

#### Test Analytics with Platform Filter
```bash
curl -X GET "http://localhost:3000/api/analytics/performance?days=30&platform=instagram" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🖥️ UI Testing

### Calendar View
1. Go to Dashboard
2. Click "Calendar" tab
3. Verify:
   - Calendar displays current month
   - Can navigate between months
   - Clicking a day shows scheduled posts
   - Posts show platform, status, and content preview

### Search
1. Go to Dashboard
2. Use search bar in header
3. Type a query
4. Verify:
   - Results appear in dropdown
   - Results grouped by type (Documents, Templates, Hashtag Sets)
   - Clicking result navigates to content

### Analytics Dashboard
1. Go to Dashboard
2. Click "Analytics" tab
3. Verify:
   - Overview cards show metrics
   - Platform breakdown displays
   - Top posts list shows
   - Can change time period (7/30/90 days)

---

## ✅ Code Verification

All API routes have:
- ✅ `export const dynamic = 'force-dynamic'`
- ✅ Authentication check (`verifyAuth`)
- ✅ Error handling
- ✅ Proper TypeScript types
- ✅ No linter errors

All UI components:
- ✅ Integrated into dashboard
- ✅ Use React hooks properly
- ✅ Handle loading states
- ✅ Display error messages

---

## 🚀 Next Steps

1. **Deploy to production**
2. **Test with real user data**
3. **Verify performance** (should be fast - all database queries)
4. **Check mobile responsiveness**

---

## 📝 Notes

- All features use existing database tables (no new migrations needed)
- Calendar uses `content_posts` table with `scheduled_at` field
- Search queries `documents`, `content_templates`, and `hashtag_sets` tables
- Analytics aggregates from `content_posts` and `analytics` tables
- All queries are optimized with proper WHERE clauses and limits


