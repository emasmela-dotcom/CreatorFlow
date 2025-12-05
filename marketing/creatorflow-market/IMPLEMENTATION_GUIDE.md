# Monetization Implementation Guide

## Quick Summary

**Recommended Approach: Freemium with Usage Limits**

- **Free Tier:** All tools, but limited usage (10 docs, 5 hashtag sets, 3 templates, 50 AI calls/month)
- **Paid Tiers:** Remove limits + add advanced features
- **Abuse Prevention:** Already implemented (IP, email domain, device limits)

---

## 🎯 Recommended Free Tier Limits

### Usage Limits (Implement These)

```typescript
// Free tier limits
const FREE_TIER_LIMITS = {
  documents: 10,           // Max 10 documents
  hashtagSets: 5,          // Max 5 hashtag sets
  templates: 3,            // Max 3 templates
  aiCallsPerMonth: 50,     // 50 AI bot calls per month
  storageMB: 10,           // 10MB total storage
  socialAccounts: 1        // 1 social account
}
```

**Why These Limits:**
- Enough to see value (creators can actually use it)
- Natural upgrade triggers (hit limit → upgrade)
- Prevents abuse (can't create unlimited accounts)
- Fair for genuine users

---

## 💰 Recommended Pricing

### Current Pricing (Update These)

**Free Tier (NEW - Add This):**
- $0/month - Forever free
- All core tools
- Limited usage (see above)
- Basic support

**Starter ($19/mo):**
- Remove all usage limits
- 3 social accounts
- Enhanced AI features
- Email support

**Growth ($29/mo):**
- Everything in Starter
- 5 social accounts
- Advanced AI features
- Analytics dashboard
- Priority support

**Pro ($39/mo):**
- Everything in Growth
- 10 social accounts
- Premium AI features
- Team collaboration (3 members)
- API access

**Business ($49/mo):**
- Everything in Pro
- Unlimited social accounts
- Team collaboration (10 members)
- White-label options
- Dedicated support

**Agency ($99/mo):**
- Everything in Business
- Unlimited team members
- Full white-label
- Advanced API access
- Account manager

---

## 🛡️ Abuse Prevention (Already Implemented ✅)

You already have:
- ✅ Email domain limits (2 per domain)
- ✅ IP address limits (3 per IP)
- ✅ Device fingerprinting (2 per device)
- ✅ Rate limiting (3 signups/hour)

**What to Add:**
- Usage limits per feature (documents, hashtag sets, templates)
- AI call limits per month
- Storage limits

---

## 📋 Implementation Steps

### Step 1: Add Usage Limits to planLimits.ts

```typescript
// Update src/lib/planLimits.ts

export interface PlanLimits {
  monthlyPostLimit: number
  accountLimit: number
  // ADD THESE:
  documentLimit: number
  hashtagSetLimit: number
  templateLimit: number
  aiCallsPerMonth: number
  storageMB: number
}

export function getPlanLimits(planType: PlanType | null): PlanLimits {
  if (!planType) {
    // FREE TIER LIMITS
    return {
      monthlyPostLimit: 0,
      accountLimit: 1,
      documentLimit: 10,
      hashtagSetLimit: 5,
      templateLimit: 3,
      aiCallsPerMonth: 50,
      storageMB: 10
    }
  }
  
  const limits: Record<PlanType, PlanLimits> = {
    starter: {
      monthlyPostLimit: 0, // Unlimited
      accountLimit: 3,
      documentLimit: -1, // Unlimited
      hashtagSetLimit: -1, // Unlimited
      templateLimit: -1, // Unlimited
      aiCallsPerMonth: 500,
      storageMB: 100
    },
    growth: {
      monthlyPostLimit: 0,
      accountLimit: 5,
      documentLimit: -1,
      hashtagSetLimit: -1,
      templateLimit: -1,
      aiCallsPerMonth: 1000,
      storageMB: 500
    },
    pro: {
      monthlyPostLimit: 0,
      accountLimit: 10,
      documentLimit: -1,
      hashtagSetLimit: -1,
      templateLimit: -1,
      aiCallsPerMonth: -1, // Unlimited
      storageMB: 2000
    },
    business: {
      monthlyPostLimit: 0,
      accountLimit: -1, // Unlimited
      documentLimit: -1,
      hashtagSetLimit: -1,
      templateLimit: -1,
      aiCallsPerMonth: -1,
      storageMB: 10000
    },
    agency: {
      monthlyPostLimit: 0,
      accountLimit: -1,
      documentLimit: -1,
      hashtagSetLimit: -1,
      templateLimit: -1,
      aiCallsPerMonth: -1,
      storageMB: -1 // Unlimited
    }
  }
  
  return limits[planType]
}
```

---

### Step 2: Create Usage Tracking Functions

```typescript
// Create src/lib/usageTracking.ts

import { db } from './db'
import { getPlanLimits, PlanType } from './planLimits'

export async function getCurrentUsage(
  userId: string,
  feature: 'documents' | 'hashtagSets' | 'templates' | 'aiCalls' | 'storage'
): Promise<number> {
  switch (feature) {
    case 'documents':
      const docResult = await db.execute({
        sql: 'SELECT COUNT(*) as count FROM documents WHERE user_id = ?',
        args: [userId]
      })
      return parseInt(docResult.rows[0]?.count || 0)
    
    case 'hashtagSets':
      const hashtagResult = await db.execute({
        sql: 'SELECT COUNT(*) as count FROM hashtag_sets WHERE user_id = ?',
        args: [userId]
      })
      return parseInt(hashtagResult.rows[0]?.count || 0)
    
    case 'templates':
      const templateResult = await db.execute({
        sql: 'SELECT COUNT(*) as count FROM content_templates WHERE user_id = ?',
        args: [userId]
      })
      return parseInt(templateResult.rows[0]?.count || 0)
    
    case 'aiCalls':
      // Track AI calls in a new table or use existing analytics
      // For now, return 0 (implement tracking)
      return 0
    
    case 'storage':
      // Calculate total storage used
      // For now, return 0 (implement storage calculation)
      return 0
    
    default:
      return 0
  }
}

export async function checkUsageLimit(
  userId: string,
  userPlan: PlanType | null,
  feature: 'documents' | 'hashtagSets' | 'templates' | 'aiCalls' | 'storage'
): Promise<{ allowed: boolean; current: number; limit: number; message?: string }> {
  const limits = getPlanLimits(userPlan)
  const current = await getCurrentUsage(userId, feature)
  
  let limit: number
  switch (feature) {
    case 'documents':
      limit = limits.documentLimit
      break
    case 'hashtagSets':
      limit = limits.hashtagSetLimit
      break
    case 'templates':
      limit = limits.templateLimit
      break
    case 'aiCalls':
      limit = limits.aiCallsPerMonth
      break
    case 'storage':
      limit = limits.storageMB
      break
    default:
      limit = -1
  }
  
  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true, current, limit: -1 }
  }
  
  if (current >= limit) {
    return {
      allowed: false,
      current,
      limit,
      message: `You've reached your ${feature} limit (${current}/${limit}). Upgrade to continue.`
    }
  }
  
  return { allowed: true, current, limit }
}
```

---

### Step 3: Add Usage Checks to API Routes

**Example: Documents API**

```typescript
// In src/app/api/documents/route.ts

import { checkUsageLimit } from '@/lib/usageTracking'

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's plan
    const userResult = await db.execute({
      sql: 'SELECT subscription_tier FROM users WHERE id = ?',
      args: [user.userId]
    })
    const userPlan = userResult.rows[0]?.subscription_tier || null

    // Check usage limit (only for free tier)
    if (!userPlan) {
      const usageCheck = await checkUsageLimit(user.userId, null, 'documents')
      if (!usageCheck.allowed) {
        return NextResponse.json({
          error: usageCheck.message,
          current: usageCheck.current,
          limit: usageCheck.limit,
          upgradeRequired: true
        }, { status: 403 })
      }
    }

    // Continue with document creation...
    // ... rest of your code
  }
}
```

**Apply same pattern to:**
- Hashtag Research API (check hashtagSets limit)
- Content Templates API (check templates limit)
- AI Bot APIs (check aiCalls limit)

---

### Step 4: Add Usage Dashboard (Show Users Their Limits)

```typescript
// Create src/app/api/usage/route.ts

export async function GET(request: NextRequest) {
  const user = await verifyAuth(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userPlan = await getUserPlan(user.userId)
  const limits = getPlanLimits(userPlan)
  
  const usage = {
    documents: {
      current: await getCurrentUsage(user.userId, 'documents'),
      limit: limits.documentLimit
    },
    hashtagSets: {
      current: await getCurrentUsage(user.userId, 'hashtagSets'),
      limit: limits.hashtagSetLimit
    },
    templates: {
      current: await getCurrentUsage(user.userId, 'templates'),
      limit: limits.templateLimit
    },
    aiCalls: {
      current: await getCurrentUsage(user.userId, 'aiCalls'),
      limit: limits.aiCallsPerMonth
    }
  }
  
  return NextResponse.json({ success: true, usage, plan: userPlan })
}
```

---

## 🎯 Conversion Strategy

### When User Hits Limit

**Show Upgrade Prompt:**
```typescript
{
  error: "You've reached your document limit (10/10)",
  upgradeRequired: true,
  currentPlan: "free",
  upgradeOptions: [
    { plan: "starter", price: 19, removesLimit: true },
    { plan: "growth", price: 29, removesLimit: true }
  ],
  upgradeUrl: "/pricing"
}
```

**UI Message:**
```
"You've used all 10 documents. Upgrade to Starter ($19/mo) for unlimited documents and more features!"
[Upgrade Now] [Learn More]
```

---

## 📊 Revenue Projections

### Conservative Estimates

**Month 1:**
- 500 free users
- 10 paid (2% conversion) = $190-390/month

**Month 3:**
- 2,000 free users
- 60 paid (3% conversion) = $1,140-2,340/month

**Month 6:**
- 5,000 free users
- 200 paid (4% conversion) = $3,800-7,800/month

**Month 12:**
- 10,000 free users
- 500 paid (5% conversion) = $9,500-19,500/month

---

## ✅ Implementation Checklist

### Phase 1: Core Limits (Week 1)
- [ ] Update planLimits.ts with usage limits
- [ ] Create usageTracking.ts
- [ ] Add usage checks to Documents API
- [ ] Add usage checks to Hashtag Research API
- [ ] Add usage checks to Content Templates API

### Phase 2: AI Call Tracking (Week 2)
- [ ] Create ai_calls table
- [ ] Track AI bot calls
- [ ] Add usage checks to AI bot APIs
- [ ] Reset monthly counters

### Phase 3: Usage Dashboard (Week 3)
- [ ] Create /api/usage endpoint
- [ ] Add usage dashboard to UI
- [ ] Show progress bars
- [ ] Add upgrade prompts

### Phase 4: Upgrade Flow (Week 4)
- [ ] Update pricing page
- [ ] Add free tier to pricing
- [ ] Improve checkout flow
- [ ] Add upgrade prompts in UI

---

## 💡 Key Recommendations

1. **Start with Free Tier + Limits**
   - Easiest to implement
   - Clear upgrade path
   - Protects against abuse

2. **Be Transparent**
   - Show limits clearly
   - Show usage progress
   - Make upgrade easy

3. **Value at Every Tier**
   - Free tier should be useful
   - Paid tiers should be worth it
   - Clear differentiation

4. **Track Everything**
   - Usage metrics
   - Conversion rates
   - Churn rates
   - Revenue per user

---

## 🚀 Quick Start (Do This First)

1. **Add Free Tier to Pricing** (30 min)
   - Update PlanSelection.tsx
   - Add free tier option
   - Show $0/month

2. **Add Document Limit Check** (1 hour)
   - Update Documents API
   - Check limit before create
   - Return upgrade message if exceeded

3. **Add Usage Dashboard** (2 hours)
   - Create /api/usage endpoint
   - Show usage in dashboard
   - Add progress bars

**Total Time:** 3-4 hours
**Impact:** Immediate monetization capability

---

## 📝 Next Steps

1. Review MONETIZATION_STRATEGY.md for full strategy
2. Implement usage limits (this guide)
3. Test with real users
4. Adjust limits based on feedback
5. Track conversion rates
6. Optimize pricing

---

**Remember:** The goal is to offer genuine value while protecting your resources. Free tier should be useful enough to convert, but limited enough to encourage upgrades.

