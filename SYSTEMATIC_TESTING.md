# Systematic Testing Plan

## Phase 1: API Testing (Run Test Script)
1. Go to: https://creatorflow-iota.vercel.app/dashboard
2. Open console (F12)
3. Paste `test-all-apis.js` code
4. Review results - fix any failures

## Phase 2: Manual Testing

### Authentication
- [ ] Sign up with new email
- [ ] Verify email confirmation (if applicable)
- [ ] Sign in with credentials
- [ ] Check token in localStorage
- [ ] Logout clears token and redirects

### Dashboard
- [ ] Loads without errors
- [ ] Quick stats display
- [ ] Quick actions work
- [ ] All tabs navigate
- [ ] Post purchase info displays (no 500 errors)
- [ ] Subscription info displays

### Post Creation
- [ ] Navigate to /create
- [ ] Select platforms
- [ ] Type content
- [ ] Content Assistant Bot appears and analyzes
- [ ] Scheduling Assistant Bot appears
- [ ] Add hashtags
- [ ] Save draft
- [ ] Schedule post
- [ ] Publish post

### Bots (Already Verified ✅)
- [x] All 6 bots tested and working

### Payment Flow
- [ ] Click pricing "Get Started"
- [ ] Stripe checkout loads
- [ ] Test with card: 4242 4242 4242 4242
- [ ] Subscription activates
- [ ] Dashboard updates

## Phase 3: Error Scenarios
- [ ] Network offline - graceful error handling
- [ ] Invalid token - redirects to login
- [ ] Invalid input - shows validation errors
- [ ] API timeout - shows fallback content

## Phase 4: Performance
- [ ] Page load < 3 seconds
- [ ] API responses < 1 second
- [ ] No memory leaks
- [ ] Smooth scrolling

## Phase 5: Mobile
- [ ] Dashboard responsive
- [ ] Create page responsive
- [ ] Bots display correctly
- [ ] Navigation works

## Phase 6: Final Checklist
- [ ] All environment variables set
- [ ] Database migrations complete
- [ ] Stripe webhook configured
- [ ] No console errors
- [ ] Analytics tracking working
- [ ] Security headers working

