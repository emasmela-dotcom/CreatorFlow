# Quick Test Instructions

## 🚀 Fastest Way to Test All Bots & Tools

### Step 1: Start the Server
```bash
npm run dev
```

### Step 2: Get a Token (Choose one method)

**Option A: Use Demo Account**
1. Go to: `http://localhost:3000/demo`
2. Open browser DevTools (F12)
3. Go to Console tab
4. Type: `localStorage.getItem('token')`
5. Copy the token

**Option B: Sign Up Manually**
1. Go to: `http://localhost:3000/signup`
2. Create an account
3. Open browser DevTools (F12)
4. Go to Console tab
5. Type: `localStorage.getItem('token')`
6. Copy the token

### Step 3: Run Tests
```bash
TEST_TOKEN="paste-your-token-here" node scripts/test-all-bots-tools.js
```

---

## 📊 What You'll See

The script will test:
- ✅ 18 AI Bots
- ✅ 7 Core Tools
- 📊 Summary with pass/fail counts
- 💾 Detailed JSON results file

---

## ⚡ Quick Test (Without Token)

If you want to test without providing a token, the script will try to create a test account automatically. However, this may fail due to abuse prevention.

**Best Practice:** Use the demo account token for reliable testing.

---

**That's it!** The script will test everything and show you the results.

