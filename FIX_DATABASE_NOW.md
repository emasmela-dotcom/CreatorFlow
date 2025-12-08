# Fix Database Constraint - Do This Now

## Step 1: Wait for Deployment (Check Vercel Dashboard)
Make sure the latest deployment shows "Ready" status.

## Step 2: Fix the Database Constraint

**Open this URL in your browser:**
```
https://creatorflow-git-main-erics-projects-b395e20f.vercel.app/api/db/fix-constraint
```

**OR use curl:**
```bash
curl -X POST https://creatorflow-git-main-erics-projects-b395e20f.vercel.app/api/db/fix-constraint
```

**You should see:**
```json
{"success": true, "message": "Constraint updated successfully to include \"free\" plan"}
```

## Step 3: Test Demo

**Visit:**
```
https://creatorflow-git-main-erics-projects-b395e20f.vercel.app/demo
```

**It should work now!**

---

## If Browser Method Doesn't Work

The endpoint needs a POST request. Use curl or this JavaScript in browser console:

```javascript
fetch('https://creatorflow-git-main-erics-projects-b395e20f.vercel.app/api/db/fix-constraint', {
  method: 'POST'
}).then(r => r.json()).then(console.log)
```

