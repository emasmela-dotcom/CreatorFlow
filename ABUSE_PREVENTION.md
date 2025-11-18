# Abuse Prevention System

## Overview
Comprehensive system to prevent users from creating multiple free trial accounts.

## Protection Layers

### 1. **Disposable Email Blocking**
- Blocks common disposable email services (tempmail.com, 10minutemail.com, etc.)
- Prevents users from creating unlimited accounts with throwaway emails

### 2. **IP Address Limits**
- **Max 3 accounts per IP** in 30 days
- Tracks all signups by IP address
- Prevents VPN/proxy abuse (to some extent)

### 3. **Email Domain Limits**
- **Max 2 accounts per email domain** in 7 days
- Prevents users from creating multiple accounts with same domain (e.g., user1@gmail.com, user2@gmail.com)

### 4. **Device Fingerprinting**
- **Max 2 accounts per device** in 7 days
- Uses browser fingerprint (User-Agent, Accept-Language, Accept-Encoding)
- Prevents same device from creating multiple accounts

### 5. **Rate Limiting**
- **Max 3 signup attempts per IP per hour**
- Prevents rapid-fire account creation
- Uses existing rate limiting system

## How It Works

1. **On Signup:**
   - Checks disposable email
   - Checks IP account limit
   - Checks email domain limit
   - Checks device fingerprint limit
   - Checks rate limit
   - If all pass → account created + logged
   - If any fail → signup blocked with clear error message

2. **Logging:**
   - Every signup is logged to `user_signup_logs` table
   - Tracks: user_id, email, IP address, device fingerprint, timestamp
   - Used for abuse detection and monitoring

## Limits (Configurable)

| Check | Limit | Time Window |
|-------|-------|-------------|
| IP Address | 3 accounts | 30 days |
| Email Domain | 2 accounts | 7 days |
| Device Fingerprint | 2 accounts | 7 days |
| Rate Limit | 3 attempts | 1 hour |

## Adjusting Limits

Edit limits in `/src/lib/abusePrevention.ts`:

```typescript
// In checkAbusePrevention function:
const ipCheck = await checkIPAccountLimit(ipAddress, 3) // Change 3 to desired limit
const domainCheck = await checkEmailDomainLimit(email, 2) // Change 2 to desired limit
const deviceCheck = await checkDeviceLimit(deviceFingerprint, 2) // Change 2 to desired limit

// In rate limit check:
const rateLimit = checkRateLimit(ipAddress, {
  maxRequests: 3, // Change 3 to desired limit
  windowMs: 60 * 60 * 1000, // 1 hour
  identifier: 'signup'
})
```

## Monitoring

Use `getAbuseStats()` function to monitor:
- Signups in last 24 hours
- Signups in last 7 days
- Suspicious IPs (more than 2 signups)
- Disposable email attempts

## Additional Recommendations

### 1. **Email Verification**
Add email verification requirement:
- Send verification email on signup
- Require email verification before trial starts
- Prevents fake emails

### 2. **Phone Verification (Optional)**
For high-value plans, require phone verification:
- Use services like Twilio Verify
- One phone number = one account

### 3. **CAPTCHA**
Add CAPTCHA on signup form:
- Google reCAPTCHA v3 (invisible)
- Prevents bot signups

### 4. **Behavioral Analysis**
Track user behavior patterns:
- Login frequency
- Feature usage
- Content creation patterns
- Flag suspicious accounts

### 5. **Manual Review**
For "first 25 creators" promo:
- Manually approve first 25 signups
- Verify they're real creators
- Add to whitelist

## Testing

To test the system:

1. **Test IP Limit:**
   - Create 3 accounts from same IP
   - 4th should be blocked

2. **Test Domain Limit:**
   - Create 2 accounts with same email domain
   - 3rd should be blocked

3. **Test Disposable Email:**
   - Try signing up with tempmail.com
   - Should be blocked

4. **Test Rate Limit:**
   - Try 4 signups in 1 hour from same IP
   - 4th should be blocked

## Bypassing for Legitimate Users

If a legitimate user hits a limit:

1. **Manual Override:**
   - Add their email to whitelist
   - Or manually create account in database

2. **Support Contact:**
   - Error messages include "contact support" option
   - Support can verify and manually approve

3. **Whitelist System (Future):**
   - Create `whitelisted_emails` table
   - Skip abuse checks for whitelisted emails

## Database Schema

The system creates `user_signup_logs` table:

```sql
CREATE TABLE user_signup_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  device_fingerprint VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
)
```

## Notes

- System is **fail-open**: If checks fail, signup is allowed (to avoid blocking legitimate users)
- All errors are logged for monitoring
- Limits are conservative to avoid false positives
- Can be adjusted based on actual abuse patterns

