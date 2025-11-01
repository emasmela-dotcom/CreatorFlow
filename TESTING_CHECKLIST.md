# End-to-End Testing Checklist

## Pre-Launch Testing Guide

### 1. Complete Signup & Trial Flow

#### Test: Signup with Plan Selection
- [ ] Navigate to homepage
- [ ] Click "Start Free Trial" or select a plan
- [ ] Verify plan selection page shows all 5 plans (Starter $19, Growth $29, Pro $39, Business $49, Agency $99)
- [ ] Select a plan (e.g., Pro)
- [ ] Verify plan is pre-selected if coming from homepage pricing
- [ ] Click "Continue to Account Creation"

#### Test: Account Creation
- [ ] Enter valid email and password (min 6 characters)
- [ ] Verify validation works (email format, password length)
- [ ] Submit account creation
- [ ] Verify account is created successfully
- [ ] Verify redirect to payment step

#### Test: Payment & Trial Start
- [ ] Verify Trial Terms are displayed clearly
  - [ ] Credit card required message visible
  - [ ] Trial period (15 days) shown
  - [ ] "If continue" section shows changes are kept
  - [ ] "If don't continue" section shows changes will be reverted
- [ ] Click "Proceed to Secure Checkout"
- [ ] Use Stripe test card: `4242 4242 4242 4242`
  - [ ] Enter future expiry date
  - [ ] Enter any CVC
  - [ ] Enter any ZIP
- [ ] Complete Stripe checkout
- [ ] Verify redirect to `/dashboard/trial-success`
- [ ] Verify success message displays
- [ ] Verify redirect to dashboard

#### Test: Backup Creation
- [ ] After successful signup, verify backup was created
  - [ ] Check database: `project_backups` table should have entry
  - [ ] Verify `is_restored = 0`
  - [ ] Verify `backup_data` contains user's initial state

### 2. Trial Period Testing

#### Test: Trial Status Display
- [ ] Login to dashboard
- [ ] Verify trial status banner appears
- [ ] Verify days remaining is calculated correctly (should show ~15 days)
- [ ] Verify trial plan name is displayed

#### Test: Trial Features Access
- [ ] Verify user can access all features of selected plan
- [ ] Create some content posts
- [ ] Verify posts are saved to database
- [ ] Make some analytics entries
- [ ] Verify analytics are saved

### 3. Trial End - Continue Subscription

#### Test: Trial Ending Notification
- [ ] Simulate trial ending soon (modify database `trial_end_at` to be 2 days from now)
- [ ] Refresh dashboard
- [ ] Verify modal appears with trial ending message
- [ ] Verify two options are shown:
  - [ ] Continue Subscription (green)
  - [ ] Cancel & Restore (gray/red)

#### Test: Continue Subscription
- [ ] Click "Continue Subscription"
- [ ] Verify subscription status updates to "active" in Stripe
- [ ] Verify webhook processes the subscription update
- [ ] Verify user keeps all changes made during trial
- [ ] Verify content posts are still present
- [ ] Verify analytics data is still present
- [ ] Verify trial status banner shows "Active Subscription"

### 4. Trial End - Cancel & Restore

#### Test: Cancel Subscription
- [ ] Start fresh trial
- [ ] Make changes during trial (create posts, analytics)
- [ ] Before trial ends OR at trial end notification:
  - [ ] Click "Cancel & Restore"
  - [ ] Verify subscription is canceled in Stripe
  - [ ] Verify webhook triggers restore process
  - [ ] Verify restore API is called
- [ ] Verify restore process:
  - [ ] All content posts created during trial are deleted
  - [ ] All analytics created during trial are deleted
  - [ ] User's subscription_tier is reset
  - [ ] Backup is marked as restored (`is_restored = 1`)
  - [ ] Original backup data is restored (if there was any initial data)

#### Test: Restore to Empty State
- [ ] Create account with no initial data
- [ ] Start trial
- [ ] Create posts and analytics during trial
- [ ] Cancel subscription
- [ ] Verify all trial data is deleted
- [ ] Verify user is back to empty/initial state

### 5. Payment Integration Testing

#### Test: Stripe Webhook Events
- [ ] Test `checkout.session.completed`
  - [ ] Verify customer is created
  - [ ] Verify subscription is created with trial period
  - [ ] Verify user record is updated with Stripe customer ID
  - [ ] Verify trial dates are set correctly

- [ ] Test `customer.subscription.updated` (trial → active)
  - [ ] Wait for trial to end (or simulate)
  - [ ] Verify subscription status changes to active
  - [ ] Verify user record updates correctly

- [ ] Test `customer.subscription.deleted` (canceled)
  - [ ] Cancel subscription
  - [ ] Verify restore process is triggered
  - [ ] Verify user data is cleaned up

#### Test: Subscription Management API
- [ ] GET `/api/subscription/manage` with valid token
  - [ ] Verify returns subscription status
  - [ ] Verify returns trial days remaining
  - [ ] Verify returns plan information

- [ ] DELETE `/api/subscription/manage` (cancel)
  - [ ] Verify subscription canceled in Stripe
  - [ ] Verify restore is triggered
  - [ ] Verify user subscription_tier is cleared

### 6. Authentication Testing

#### Test: Signup
- [ ] Create new account
- [ ] Verify JWT token is returned
- [ ] Verify password is hashed in database
- [ ] Verify user can login with credentials

#### Test: Login
- [ ] Login with correct credentials
- [ ] Verify JWT token is returned
- [ ] Verify token works for authenticated requests

#### Test: Token Validation
- [ ] Use token for authenticated API calls
- [ ] Verify protected endpoints work
- [ ] Test with invalid/expired token
- [ ] Verify proper 401 responses

### 7. Database Testing

#### Test: Turso Connection
- [ ] Verify database connection works
- [ ] Run `initDatabase()` function
- [ ] Verify all tables are created:
  - [ ] users
  - [ ] content_posts
  - [ ] analytics
  - [ ] project_backups

#### Test: Database Operations
- [ ] Test user creation
- [ ] Test content post creation
- [ ] Test analytics creation
- [ ] Test backup creation
- [ ] Test restore operations
- [ ] Verify data integrity

### 8. Error Handling Testing

#### Test: Invalid Inputs
- [ ] Invalid email format
- [ ] Password too short (< 6 chars)
- [ ] Missing required fields
- [ ] Invalid plan selection
- [ ] Verify proper error messages

#### Test: Network Errors
- [ ] Simulate Stripe API failure
- [ ] Simulate database connection failure
- [ ] Verify graceful error handling
- [ ] Verify user-friendly error messages

### 9. UI/UX Testing

#### Test: Responsive Design
- [ ] Test on mobile devices
- [ ] Test on tablets
- [ ] Test on desktop
- [ ] Verify all components are readable and functional

#### Test: Navigation
- [ ] Verify all links work
- [ ] Verify back buttons function correctly
- [ ] Verify redirects after actions
- [ ] Verify progress indicators update correctly

#### Test: Loading States
- [ ] Verify loading indicators show during API calls
- [ ] Verify buttons are disabled during processing
- [ ] Verify error states display correctly

### 10. Security Testing

#### Test: Authentication
- [ ] Verify tokens are required for protected endpoints
- [ ] Verify invalid tokens are rejected
- [ ] Verify passwords are hashed (never stored in plain text)

#### Test: Authorization
- [ ] Verify users can only access their own data
- [ ] Verify backup restore only works for correct user
- [ ] Verify subscription management only for account owner

## Test Environment Setup

### Required Environment Variables
```env
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_GROWTH=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_BUSINESS=price_...
STRIPE_PRICE_AGENCY=price_...
JWT_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Stripe Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires Authentication: `4000 0025 0000 3155`

### Database Testing
- Use local Turso or test database
- Can modify trial dates directly in database for testing
- Can manually trigger webhooks via Stripe Dashboard

## Test Results Log

| Test Case | Status | Notes |
|-----------|--------|-------|
| Signup Flow | ⬜ | |
| Trial Start | ⬜ | |
| Backup Creation | ⬜ | |
| Trial Status Display | ⬜ | |
| Continue Subscription | ⬜ | |
| Cancel & Restore | ⬜ | |
| Webhook Handling | ⬜ | |
| Error Handling | ⬜ | |

## Known Issues

- [ ] Document any bugs found during testing
- [ ] Document any missing features
- [ ] Document any UX improvements needed

