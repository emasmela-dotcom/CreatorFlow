# CreatorFlow Tools Test Report

**Generated:** 2025-12-03T14:58:30.698Z
**Base URL:** https://creatorflow-iota.vercel.app

## Test Results Summary

- ✅ **Passed:** 10
- ⚠️  **Failed:** 0
- ❌ **Errors:** 2
- 📊 **Total Tests:** 12

---

## Detailed Test Results

### ✅ Hashtag Research API

- **Status:** PASS
- **Time:** 2025-12-03T14:58:32.606Z
- **Details:** Status: 401 (Exists, requires auth)

### ✅ Content Templates API

- **Status:** PASS
- **Time:** 2025-12-03T14:58:32.759Z
- **Details:** Status: 401 (Exists, requires auth)

### ✅ Engagement Inbox API

- **Status:** PASS
- **Time:** 2025-12-03T14:58:32.898Z
- **Details:** Status: 401 (Exists, requires auth)

### ❌ Documents API

- **Status:** ERROR
- **Time:** 2025-12-03T14:58:33.007Z
- **Details:** Endpoint not found (404)

### ❌ Documents Page

- **Status:** ERROR
- **Time:** 2025-12-03T14:58:33.885Z
- **Details:** Page not found (404)

### ✅ Content Repurposing Bot

- **Status:** PASS
- **Time:** 2025-12-03T14:58:34.030Z
- **Details:** Status: 401

### ✅ Content Assistant Bot

- **Status:** PASS
- **Time:** 2025-12-03T14:58:34.198Z
- **Details:** Status: 401

### ✅ Scheduling Assistant Bot

- **Status:** PASS
- **Time:** 2025-12-03T14:58:34.332Z
- **Details:** Status: 401

### ✅ Engagement Analyzer Bot

- **Status:** PASS
- **Time:** 2025-12-03T14:58:34.635Z
- **Details:** Status: 401

### ✅ Content Gap Analyzer Bot

- **Status:** PASS
- **Time:** 2025-12-03T14:58:34.791Z
- **Details:** Status: 401

### ✅ Database Health Check

- **Status:** PASS
- **Time:** 2025-12-03T14:58:35.624Z
- **Details:** Database is accessible

### ✅ Dashboard Page

- **Status:** PASS
- **Time:** 2025-12-03T14:58:35.753Z
- **Details:** Status: 200


---

## Recommendations


### ❌ Critical Issues

The following tools are not accessible:
- Documents API
- Documents Page

**Action Required:** These endpoints need to be deployed or fixed.






---

**Note:** Tests check for endpoint existence and basic functionality. Full functionality requires authentication and proper test data.
