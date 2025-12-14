# Test All Bots & Tools - Instructions

## 🧪 Comprehensive Testing Script

This script tests **all 25 tools** in CreatorFlow:
- **18 AI Bots**
- **7 Core Tools**

---

## 📋 Prerequisites

1. **Server Running:**
   ```bash
   npm run dev
   ```

2. **Authentication Token (Optional):**
   - The script will try to create a test account automatically
   - OR provide a token via environment variable:
     ```bash
     export TEST_TOKEN="your-jwt-token-here"
     ```

---

## 🚀 How to Run

### Option 1: Automatic Test Account Creation
```bash
node scripts/test-all-bots-tools.js
```

### Option 2: Use Existing Token
```bash
TEST_TOKEN="your-token-here" node scripts/test-all-bots-tools.js
```

### Option 3: Test Production URL
```bash
BASE_URL="https://creatorflow-iota.vercel.app" TEST_TOKEN="your-token" node scripts/test-all-bots-tools.js
```

---

## ✅ What Gets Tested

### AI Bots (18)
1. ✅ Content Assistant Bot
2. ✅ Scheduling Assistant Bot
3. ✅ Engagement Analyzer Bot
4. ✅ Trend Scout Bot
5. ✅ Content Curation Bot
6. ✅ Analytics Coach Bot
7. ✅ Content Writer Bot
8. ✅ Content Gap Analyzer Bot
9. ✅ Content Repurposing Bot
10. ✅ Expense Tracker Bot
11. ✅ Invoice Generator Bot
12. ✅ Email Sorter Bot
13. ✅ Customer Service Bot
14. ✅ Product Recommendation Bot
15. ✅ Sales Lead Qualifier Bot
16. ✅ Meeting Scheduler Bot
17. ✅ Social Media Manager Bot
18. ✅ Website Chat Bot

### Core Tools (7)
1. ✅ Hashtag Research Tool
2. ✅ Content Templates Tool
3. ✅ Documents Tool
4. ✅ Content Calendar Tool
5. ✅ Content Library Search Tool
6. ✅ Performance Analytics Tool
7. ✅ Posts Tool

---

## 📊 Test Results

The script will:
- ✅ Show pass/fail for each tool
- 📊 Display summary statistics
- 💾 Save detailed results to `test-results-all-bots-tools.json`

---

## 🔍 What Each Test Checks

For each bot/tool, the script verifies:
1. **API Endpoint Responds** - No 404/500 errors
2. **Returns Expected Data** - Proper response structure
3. **Functional Logic** - Tool performs its intended function

---

## ⚠️ Expected Behaviors

- **Free Plan Users:** Some tools may return usage limit warnings (expected)
- **AI Bots:** May return placeholder/mock data (expected for some bots)
- **Core Tools:** Should return actual data from database

---

## 📝 Notes

- Tests are **non-destructive** (creates test data, doesn't delete production data)
- Some tests may fail if:
  - Server is not running
  - Database is not accessible
  - Authentication fails
  - Rate limits are hit

---

## 🐛 Troubleshooting

**"Cannot proceed without authentication token"**
- Solution: Provide `TEST_TOKEN` or ensure signup API works

**"Failed to create test account"**
- Solution: Check abuse prevention settings or provide existing token

**"Connection refused"**
- Solution: Ensure server is running on correct port

---

**Last Updated:** December 8, 2025

