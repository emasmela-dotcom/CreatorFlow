# How to Run Bot & Tool Tests - Step by Step

## 🎯 Quick Start (3 Steps)

### Step 1: Start the Server
Open a terminal and run:
```bash
cd /Users/ericmasmela/CreatorFlow
npm run dev
```

Wait until you see:
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

**Keep this terminal open!**

---

### Step 2: Get Your Token

Open a **new terminal window** (keep the server running), then:

**Option A: Use Demo Account (Easiest)**
```bash
# Open browser to demo page
open http://localhost:3000/demo

# Or manually go to: http://localhost:3000/demo in your browser
```

Then in your browser:
1. Press `F12` (or `Cmd+Option+I` on Mac) to open DevTools
2. Click the **Console** tab
3. Type this and press Enter:
   ```javascript
   localStorage.getItem('token')
   ```
4. Copy the token (it will look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

**Option B: Sign Up Manually**
```bash
# Open signup page
open http://localhost:3000/signup
```

1. Create an account
2. After login, open DevTools (F12)
3. Go to Console tab
4. Type: `localStorage.getItem('token')`
5. Copy the token

---

### Step 3: Run the Test Script

In your **new terminal window** (where server is NOT running), run:

```bash
cd /Users/ericmasmela/CreatorFlow
TEST_TOKEN="paste-your-token-here" node scripts/test-all-bots-tools.js
```

**Replace `paste-your-token-here` with the actual token you copied!**

Example:
```bash
TEST_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3OCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MzM2NDgwMDAsImV4cCI6MTczMzczNDQwMH0.abc123xyz" node scripts/test-all-bots-tools.js
```

---

## 📊 What You'll See

The script will test all 25 tools and show output like:

```
🧪 Starting Comprehensive Bot & Tool Tests...

Base URL: http://localhost:3000

✅ Authentication Setup
   Using provided TEST_TOKEN

--- Testing AI Bots (18 total) ---

✅ Content Assistant Bot
✅ Scheduling Assistant Bot
✅ Engagement Analyzer Bot
...
✅ Website Chat Bot

--- Testing Core Tools (7 total) ---

✅ Hashtag Research Tool
✅ Content Templates Tool
...
✅ Posts Tool

==================================================
📊 TEST SUMMARY
==================================================
Total Tests: 25
✅ Passed: 25
❌ Failed: 0
⏭️  Skipped: 0
Success Rate: 100.0%
==================================================

📄 Detailed results saved to: test-results-all-bots-tools.json
```

---

## 🔧 Troubleshooting

### "Cannot connect to server"
- Make sure `npm run dev` is running in another terminal
- Check that server is on `http://localhost:3000`

### "Cannot proceed without authentication token"
- Make sure you copied the ENTIRE token (it's very long)
- Token should start with `eyJ` and be in quotes

### "Invalid token" or "Unauthorized"
- Token might have expired
- Get a fresh token from the browser console

### "Connection refused"
- Server is not running
- Start it with `npm run dev`

---

## 💡 Pro Tip

Create a quick alias to make testing easier:

```bash
# Add to your ~/.zshrc or ~/.bashrc
alias test-creatorflow='cd /Users/ericmasmela/CreatorFlow && TEST_TOKEN="$(pbpaste)" node scripts/test-all-bots-tools.js'
```

Then:
1. Copy token to clipboard
2. Just run: `test-creatorflow`

---

## 📝 Full Example Session

```bash
# Terminal 1: Start server
cd /Users/ericmasmela/CreatorFlow
npm run dev

# Terminal 2: Get token and test
# 1. Open browser: http://localhost:3000/demo
# 2. Open DevTools (F12) → Console
# 3. Run: localStorage.getItem('token')
# 4. Copy token

# Terminal 2: Run tests
cd /Users/ericmasmela/CreatorFlow
TEST_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." node scripts/test-all-bots-tools.js
```

---

**That's it!** The script will test all 25 tools and give you a complete report.

