# Comprehensive Tool Testing Instructions

## Overview

The comprehensive test script (`scripts/test-all-tools-comprehensive.js`) tests:

1. **Every tool's functionality** - Create, Read, Update, Delete operations
2. **Data retention** - Verifies data persists in database and can be retrieved
3. **Copy/Paste to Documents** - Tests copying content from tools into Documents feature

## Tools Tested

### Core Tools
- ✅ Hashtag Research Tool
- ✅ Content Templates Tool
- ✅ Engagement Inbox Tool
- ✅ Documents Feature

### AI Bots
- ✅ Content Assistant Bot
- ✅ Content Repurposing Bot
- ✅ Content Gap Analyzer Bot

## How to Run the Test

### Option 1: Using Your Existing Account Token (Recommended)

1. **Sign in to CreatorFlow** in your browser:
   ```
   https://creatorflow-iota.vercel.app/signin
   ```

2. **Get your authentication token**:
   - Open browser console (F12)
   - Run: `localStorage.getItem('token')`
   - Copy the token

3. **Run the test with your token**:
   ```bash
   cd /Users/ericmasmela/CreatorFlow
   TEST_TOKEN=your_token_here BASE_URL=https://creatorflow-iota.vercel.app node scripts/test-all-tools-comprehensive.js
   ```

### Option 2: Manual Testing

If you prefer to test manually, follow this checklist:

#### Hashtag Research Tool
- [ ] Create a hashtag set
- [ ] Verify it appears in the list
- [ ] Copy hashtags to clipboard
- [ ] Paste into a new Document
- [ ] Verify document saved with hashtag content

#### Content Templates Tool
- [ ] Create a template
- [ ] Verify it appears in the list
- [ ] Edit the template
- [ ] Verify changes are saved
- [ ] Copy template content
- [ ] Paste into a new Document
- [ ] Verify document saved with template content

#### Engagement Inbox Tool
- [ ] Add an engagement item
- [ ] Verify it appears in the inbox
- [ ] Update engagement status
- [ ] Verify status change is saved
- [ ] Copy engagement content
- [ ] Paste into a new Document
- [ ] Verify document saved with engagement content

#### Documents Feature
- [ ] Create a new document
- [ ] Verify it appears in the list
- [ ] Edit the document
- [ ] Verify changes are saved
- [ ] Search for the document
- [ ] Filter by category

#### AI Bots
- [ ] Run Content Assistant on sample content
- [ ] Copy analysis results
- [ ] Paste into a new Document
- [ ] Run Content Repurposing
- [ ] Copy repurposed content
- [ ] Paste into a new Document
- [ ] Run Content Gap Analyzer
- [ ] Copy gap analysis
- [ ] Paste into a new Document

## Test Coverage

### Functionality Tests
- ✅ Create operations (all tools)
- ✅ Read operations (all tools)
- ✅ Update operations (where applicable)
- ✅ Delete operations (where applicable)

### Data Retention Tests
- ✅ Verify created data persists
- ✅ Verify data can be retrieved after creation
- ✅ Verify updates are saved
- ✅ Verify data persists across requests

### Copy/Paste Tests
- ✅ Hashtag sets → Documents
- ✅ Templates → Documents
- ✅ Engagement items → Documents
- ✅ AI Bot results → Documents

## Expected Results

When the test runs successfully, you should see:

```
✅ Hashtag Research - Research: PASS
✅ Hashtag Research - Save Set: PASS
✅ Hashtag Research - Data Retention: PASS
✅ Content Templates - Create: PASS
✅ Content Templates - Data Retention: PASS
✅ Content Templates - Update: PASS
✅ Engagement Inbox - Add: PASS
✅ Engagement Inbox - Data Retention: PASS
✅ Documents - Create: PASS
✅ Documents - Data Retention: PASS
✅ Copy/Paste - Hashtag Set to Document: PASS
✅ Copy/Paste - Template to Document: PASS
✅ Copy/Paste - Engagement to Document: PASS
✅ AI Bots - Content Assistant: PASS
✅ AI Bots - Content Repurposing: PASS
✅ AI Bots - Content Gap Analyzer: PASS
✅ Copy/Paste - Content Assistant to Document: PASS
✅ Copy/Paste - Repurposed Content to Document: PASS
✅ Copy/Paste - Gap Analysis to Document: PASS
```

## Troubleshooting

### "Abuse prevention blocked test account creation"
- Use Option 1 above (provide your own token)
- Or test manually using the checklist

### "Invalid JSON response"
- Check that the API endpoint is deployed
- Verify database migration has run
- Check Vercel deployment status

### "Column does not exist" errors
- Run database migration: `curl -X POST https://creatorflow-iota.vercel.app/api/db/setup`
- Wait for deployment to complete

## Report Generation

The test automatically generates `tools_report.md` with:
- Detailed test results
- Pass/fail status for each test
- Error messages (if any)
- Test coverage summary
- Recommendations

