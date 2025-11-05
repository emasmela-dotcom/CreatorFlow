# Bot Testing Guide - Step by Step

## Quick Start
1. Go to: https://creatorflow-iota.vercel.app/dashboard
2. Sign in (or create test account)
3. Click "AI Bots" tab at the top

---

## Bot 1: Content Assistant Bot

**What to test:**
- Should show content analysis immediately
- Should display a score (0-100)
- Should show character/word/hashtag counts
- Should have "Show Full Analysis" button

**What you should see:**
- Yellow badge: "Needs Work (80/100)" or similar
- Metrics: "53 chars", "8 words", "2 hashtags"
- Button: "Show Full Analysis (X suggestions)"

**If it's broken:**
- Check browser console (F12) for errors
- Should at least show the bot card with title

---

## Bot 2: Scheduling Assistant Bot

**What to test:**
- Should load automatically when you open the tab
- Should show "Next Best Time to Post"
- Should have "Use This Time" button
- Should show "Top Times This Week" list

**What you should see:**
- Purple card: "Today at 6:30 PM" or "Tomorrow at..."
- Green score: "88% Match"
- Button: "Use This Time"
- List: "Tuesday at 7:00 PM (90%)", etc.
- Insights: Bullet points about best posting times

**If it's broken:**
- Should show yellow warning: "Using default recommendations"
- Should still show industry best times

---

## Bot 3: Engagement Analyzer Bot

**What to test:**
- Should load automatically
- Should show engagement metrics
- Should have "Show Details" button

**What you should see:**
- Two boxes: "Average Engagement" and "Best Post"
- Numbers (may be 0 if no posts yet)
- Button: "Show Details"
- If no posts: "No published posts found. Start posting..."

**If it's broken:**
- Should show yellow warning with default insights
- Should still show the bot card

---

## Bot 4: Trend Scout Bot

**What to test:**
- Should load automatically
- Should show trending topics
- Should have "Show All Trends" button

**What you should see:**
- Orange card: "Hot Right Now" section
- Trending topic name (e.g., "Morning Workouts")
- Hashtag: "#MorningMotivation"
- Engagement info: "15k+ posts/week"
- Opportunities list
- Button: "Show All Trends"

**If it's broken:**
- Should show yellow warning with general trends
- Should still show popular hashtags

---

## Bot 5: Content Curation Bot

**What to test:**
- Should load automatically
- Should show content ideas
- Should have "Show All Ideas" button

**What you should see:**
- Purple card: "Top Idea" section
- Content idea title (e.g., "5-Minute Morning Routine")
- Description
- Hashtags: "#MorningWorkout", etc.
- "Next Post Ideas" list
- Button: "Show All Ideas"

**If it's broken:**
- Should show yellow warning with general content ideas
- Should still show suggestions

---

## Bot 6: Analytics Coach Bot

**What to test:**
- Should load automatically
- Should show growth score
- Should have "Show Details" button

**What you should see:**
- Blue card: "Growth Score" (0-100)
- Progress bar
- "Key Insights" section
- Metrics with trend arrows (up/down/stable)
- Button: "Show Details"

**If it's broken:**
- Should show yellow warning with default tips
- Should still show general recommendations

---

## Quick Testing Checklist

For each bot, check:
- [ ] Bot card appears (not blank)
- [ ] Loading spinner shows briefly
- [ ] Content appears (even if default/fallback)
- [ ] Buttons are clickable
- [ ] Expand/collapse works
- [ ] No red error messages
- [ ] Browser console has no errors (F12 → Console tab)

---

## Common Issues & Fixes

**Issue: Bot shows nothing**
- Check browser console (F12)
- Look for red errors
- Refresh the page
- Check if token is in localStorage (F12 → Application → Local Storage → token)

**Issue: Bot stuck loading**
- Wait 10 seconds (timeout should kick in)
- Should show fallback content
- Check network tab (F12 → Network) for failed requests

**Issue: Bot shows error**
- Should show yellow warning with fallback content
- This is actually working correctly (graceful degradation)

---

## What Success Looks Like

✅ All 6 bots show content (even if it's fallback)
✅ No blank screens
✅ Buttons work
✅ Expand/collapse works
✅ No console errors
✅ Bots load within 10 seconds

---

## Testing Command

Open browser console (F12) and run:
```javascript
// Check if all bots are loaded
document.querySelectorAll('[class*="Bot"]').length
// Should see 6 bot cards

// Check for errors
console.error
// Should be empty or minimal
```

