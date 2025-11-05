# CreatorFlow Quick Start Guide

## 🚀 Start the Server
```bash
cd /Users/ericmasmela/CreatorFlow
npm run dev
```
Then open: **http://localhost:3000**

---

## 📝 Test Account
- Email: `test@creatorflow.com` or `emasmela1976@gmail.com`
- Password: `test123`

---

## 🔧 If Server Won't Start

**Kill old processes:**
```bash
lsof -ti:3000,3002 | xargs kill -9 2>/dev/null
rm -rf .next/dev/lock
```

Then try `npm run dev` again.

---

## 📂 Important Files
- Landing page: `src/app/page.tsx`
- Dashboard: `src/app/dashboard/page.tsx`
- Pricing: In `page.tsx` around line 400

---

## 💾 Push to Git (GitHub Desktop)
1. Open GitHub Desktop
2. Make sure you're in CreatorFlow repo
3. Click "Commit" button
4. Click "Push" button

---

## 🎯 What You Asked For
- ✅ All paying subscribers get ALL features
- ✅ Only pay for posts when you run out
- ✅ Plans differ by monthly post count only

---

## ⚠️ If Something Breaks
1. Check terminal for errors
2. Refresh browser
3. If still broken, tell me the error message

---

**That's it. You only need to remember these basics.**
