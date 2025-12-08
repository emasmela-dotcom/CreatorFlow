#!/usr/bin/env node

/**
 * Test Signup and Login Flow
 * Tests all plan types and login functionality
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000'

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan')
}

function logTest(message) {
  log(`🧪 ${message}`, 'blue')
}

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    const data = await response.json().catch(() => ({ error: 'Invalid JSON response' }))
    return { response, data }
  } catch (error) {
    return { error: error.message }
  }
}

async function testSignup(planType, email, password) {
  logTest(`Testing signup for ${planType} plan...`)
  
  const { response, data, error } = await makeRequest(`${BASE_URL}/api/auth`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      action: 'signup',
      planType,
    }),
  })

  if (error) {
    logError(`Signup failed: ${error}`)
    return { success: false, error }
  }

  if (!response.ok) {
    logError(`Signup failed: ${data.error || 'Unknown error'}`)
    return { success: false, error: data.error }
  }

  if (data.token && data.user) {
    logSuccess(`Signup successful! User ID: ${data.user.id}, Plan: ${data.user.subscription_tier || planType}`)
    return { success: true, token: data.token, user: data.user }
  }

  logError('Signup response missing token or user')
  return { success: false, error: 'Missing token or user in response' }
}

async function testLogin(email, password) {
  logTest(`Testing login for ${email}...`)
  
  const { response, data, error } = await makeRequest(`${BASE_URL}/api/auth`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      action: 'signin',
    }),
  })

  if (error) {
    logError(`Login failed: ${error}`)
    return { success: false, error }
  }

  if (!response.ok) {
    logError(`Login failed: ${data.error || 'Unknown error'}`)
    return { success: false, error: data.error }
  }

  if (data.token && data.user) {
    logSuccess(`Login successful! User ID: ${data.user.id}`)
    return { success: true, token: data.token, user: data.user }
  }

  logError('Login response missing token or user')
  return { success: false, error: 'Missing token or user in response' }
}

async function testGetUser(token) {
  logTest('Testing GET /api/auth (get current user)...')
  
  const { response, data, error } = await makeRequest(`${BASE_URL}/api/auth`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (error) {
    logError(`Get user failed: ${error}`)
    return { success: false, error }
  }

  if (!response.ok) {
    logError(`Get user failed: ${data.error || 'Unknown error'}`)
    return { success: false, error: data.error }
  }

  if (data.user) {
    logSuccess(`Get user successful! Email: ${data.user.email}`)
    return { success: true, user: data.user }
  }

  logError('Get user response missing user data')
  return { success: false, error: 'Missing user in response' }
}

async function testDuplicateEmail(email, password) {
  logTest(`Testing duplicate email prevention (${email})...`)
  
  const { response, data, error } = await makeRequest(`${BASE_URL}/api/auth`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      action: 'signup',
      planType: 'free',
    }),
  })

  if (error) {
    logError(`Duplicate test failed: ${error}`)
    return { success: false, error }
  }

  if (response.ok) {
    logError('Duplicate email was allowed (should have been rejected)')
    return { success: false, error: 'Duplicate email not prevented' }
  }

  if (data.error && data.error.includes('already exists')) {
    logSuccess('Duplicate email correctly prevented')
    return { success: true }
  }

  logError(`Unexpected error: ${data.error}`)
  return { success: false, error: data.error }
}

async function testInvalidLogin(email, password) {
  logTest(`Testing invalid login (wrong password)...`)
  
  const { response, data, error } = await makeRequest(`${BASE_URL}/api/auth`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      action: 'signin',
    }),
  })

  if (error) {
    logError(`Invalid login test failed: ${error}`)
    return { success: false, error }
  }

  if (response.ok) {
    logError('Invalid login was allowed (should have been rejected)')
    return { success: false, error: 'Invalid login not prevented' }
  }

  if (data.error && (data.error.includes('Invalid') || data.error.includes('password'))) {
    logSuccess('Invalid login correctly rejected')
    return { success: true }
  }

  logError(`Unexpected error: ${data.error}`)
  return { success: false, error: data.error }
}

async function runTests() {
  log('\n🚀 Starting Signup & Login Tests\n', 'yellow')
  log(`Base URL: ${BASE_URL}\n`, 'cyan')

  const plans = ['free', 'starter', 'growth', 'pro', 'business', 'agency']
  const results = {
    signup: { passed: 0, failed: 0 },
    login: { passed: 0, failed: 0 },
    getUser: { passed: 0, failed: 0 },
    duplicate: { passed: 0, failed: 0 },
    invalid: { passed: 0, failed: 0 },
  }

  // Test signup for each plan
  log('\n📝 Testing Signup for All Plans\n', 'yellow')
  const testUsers = []
  
  for (const plan of plans) {
    const timestamp = Date.now()
    const email = `test-${plan}-${timestamp}@test.com`
    const password = `TestPassword123!${plan}`
    
    const result = await testSignup(plan, email, password)
    if (result.success) {
      results.signup.passed++
      testUsers.push({ email, password, plan, token: result.token, user: result.user })
    } else {
      results.signup.failed++
      logError(`Signup failed for ${plan} plan`)
    }
    await new Promise(resolve => setTimeout(resolve, 500)) // Small delay between requests
  }

  // Test login with first user
  log('\n🔐 Testing Login\n', 'yellow')
  if (testUsers.length > 0) {
    const testUser = testUsers[0]
    const loginResult = await testLogin(testUser.email, testUser.password)
    if (loginResult.success) {
      results.login.passed++
      
      // Test GET /api/auth
      const getUserResult = await testGetUser(loginResult.token)
      if (getUserResult.success) {
        results.getUser.passed++
      } else {
        results.getUser.failed++
      }
    } else {
      results.login.failed++
    }
  } else {
    logError('No users created, skipping login tests')
  }

  // Test duplicate email prevention
  log('\n🚫 Testing Duplicate Email Prevention\n', 'yellow')
  if (testUsers.length > 0) {
    const testUser = testUsers[0]
    const duplicateResult = await testDuplicateEmail(testUser.email, 'DifferentPassword123!')
    if (duplicateResult.success) {
      results.duplicate.passed++
    } else {
      results.duplicate.failed++
    }
  }

  // Test invalid login
  log('\n❌ Testing Invalid Login\n', 'yellow')
  if (testUsers.length > 0) {
    const testUser = testUsers[0]
    const invalidResult = await testInvalidLogin(testUser.email, 'WrongPassword123!')
    if (invalidResult.success) {
      results.invalid.passed++
    } else {
      results.invalid.failed++
    }
  }

  // Print summary
  log('\n📊 Test Results Summary\n', 'yellow')
  log(`Signup Tests: ${results.signup.passed} passed, ${results.signup.failed} failed`, 
    results.signup.failed === 0 ? 'green' : 'red')
  log(`Login Tests: ${results.login.passed} passed, ${results.login.failed} failed`, 
    results.login.failed === 0 ? 'green' : 'red')
  log(`Get User Tests: ${results.getUser.passed} passed, ${results.getUser.failed} failed`, 
    results.getUser.failed === 0 ? 'green' : 'red')
  log(`Duplicate Email Tests: ${results.duplicate.passed} passed, ${results.duplicate.failed} failed`, 
    results.duplicate.failed === 0 ? 'green' : 'red')
  log(`Invalid Login Tests: ${results.invalid.passed} passed, ${results.invalid.failed} failed`, 
    results.invalid.failed === 0 ? 'green' : 'red')

  const totalPassed = Object.values(results).reduce((sum, r) => sum + r.passed, 0)
  const totalFailed = Object.values(results).reduce((sum, r) => sum + r.failed, 0)
  const total = totalPassed + totalFailed

  log(`\nTotal: ${totalPassed}/${total} tests passed`, totalFailed === 0 ? 'green' : 'red')
  
  if (totalFailed === 0) {
    log('\n✅ All tests passed!', 'green')
  } else {
    log('\n❌ Some tests failed. Check the output above for details.', 'red')
  }

  log('\n📝 Test Users Created:', 'cyan')
  testUsers.forEach(user => {
    log(`  - ${user.email} (${user.plan} plan)`, 'cyan')
  })

  return totalFailed === 0
}

// Run tests
runTests()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    logError(`Test runner error: ${error.message}`)
    console.error(error)
    process.exit(1)
  })

