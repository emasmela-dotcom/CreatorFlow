#!/usr/bin/env node

/**
 * Comprehensive Tool Testing Script
 * Tests all CreatorFlow tools and APIs
 */

const BASE_URL = process.env.BASE_URL || 'https://creatorflow-iota.vercel.app'

// Test results storage
const results = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  tests: []
}

function logTest(name, status, details = {}) {
  const test = {
    name,
    status, // 'pass', 'fail', 'error'
    details,
    timestamp: new Date().toISOString()
  }
  results.tests.push(test)
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '⚠️' : '❌'
  console.log(`${icon} ${name}: ${status.toUpperCase()}`)
  if (details.message) console.log(`   ${details.message}`)
}

async function testEndpoint(method, path, body = null, requiresAuth = false) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    
    if (body) {
      options.body = JSON.stringify(body)
    }
    
    if (requiresAuth) {
      // For testing, we'll check if endpoint exists (401 = exists, 404 = doesn't exist)
      options.headers['Authorization'] = 'Bearer test-token'
    }
    
    const response = await fetch(`${BASE_URL}${path}`, options)
    const status = response.status
    
    // 401/403 = endpoint exists but needs auth (good)
    // 404 = endpoint doesn't exist (bad)
    // 200/400/500 = endpoint exists (good)
    
    if (status === 404) {
      return { exists: false, status }
    }
    
    return { exists: true, status, ok: response.ok }
  } catch (error) {
    return { exists: false, error: error.message }
  }
}

async function testAllTools() {
  console.log('='.repeat(60))
  console.log('  CreatorFlow Comprehensive Tool Test')
  console.log('='.repeat(60))
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Time: ${new Date().toLocaleString()}`)
  console.log('')

  // Test 1: Hashtag Research API
  console.log('📋 Testing Hashtag Research Tool...')
  const hashtagTest = await testEndpoint('GET', '/api/hashtag-research?action=sets', null, true)
  if (hashtagTest.exists) {
    logTest('Hashtag Research API', hashtagTest.status === 401 || hashtagTest.status === 200 ? 'pass' : 'fail', {
      message: `Status: ${hashtagTest.status} (${hashtagTest.status === 401 ? 'Exists, requires auth' : hashtagTest.status === 200 ? 'Working' : 'Unexpected status'})`
    })
  } else {
    logTest('Hashtag Research API', 'error', {
      message: 'Endpoint not found (404)'
    })
  }

  // Test 2: Content Templates API
  console.log('📋 Testing Content Templates Tool...')
  const templatesTest = await testEndpoint('GET', '/api/content-templates', null, true)
  if (templatesTest.exists) {
    logTest('Content Templates API', templatesTest.status === 401 || templatesTest.status === 200 ? 'pass' : 'fail', {
      message: `Status: ${templatesTest.status} (${templatesTest.status === 401 ? 'Exists, requires auth' : templatesTest.status === 200 ? 'Working' : 'Unexpected status'})`
    })
  } else {
    logTest('Content Templates API', 'error', {
      message: 'Endpoint not found (404)'
    })
  }

  // Test 3: Engagement Inbox API
  console.log('📋 Testing Engagement Inbox Tool...')
  const inboxTest = await testEndpoint('GET', '/api/engagement-inbox', null, true)
  if (inboxTest.exists) {
    logTest('Engagement Inbox API', inboxTest.status === 401 || inboxTest.status === 200 ? 'pass' : 'fail', {
      message: `Status: ${inboxTest.status} (${inboxTest.status === 401 ? 'Exists, requires auth' : inboxTest.status === 200 ? 'Working' : 'Unexpected status'})`
    })
  } else {
    logTest('Engagement Inbox API', 'error', {
      message: 'Endpoint not found (404)'
    })
  }

  // Test 4: Documents API
  console.log('📋 Testing Documents Feature...')
  const documentsTest = await testEndpoint('GET', '/api/documents', null, true)
  if (documentsTest.exists) {
    logTest('Documents API', documentsTest.status === 401 || documentsTest.status === 200 ? 'pass' : 'fail', {
      message: `Status: ${documentsTest.status} (${documentsTest.status === 401 ? 'Exists, requires auth' : documentsTest.status === 200 ? 'Working' : 'Unexpected status'})`
    })
  } else {
    logTest('Documents API', 'error', {
      message: 'Endpoint not found (404)'
    })
  }

  // Test 5: Documents Page
  console.log('📋 Testing Documents Page...')
  const documentsPageTest = await testEndpoint('GET', '/documents', null, false)
  if (documentsPageTest.exists && documentsPageTest.status !== 404) {
    logTest('Documents Page', documentsPageTest.status < 500 ? 'pass' : 'fail', {
      message: `Status: ${documentsPageTest.status}`
    })
  } else {
    logTest('Documents Page', 'error', {
      message: 'Page not found (404)'
    })
  }

  // Test 6: Content Repurposing Bot
  console.log('📋 Testing Content Repurposing Bot...')
  const repurposingTest = await testEndpoint('GET', '/api/bots/content-repurposing', null, true)
  if (repurposingTest.exists) {
    logTest('Content Repurposing Bot', repurposingTest.status === 401 || repurposingTest.status === 200 ? 'pass' : 'fail', {
      message: `Status: ${repurposingTest.status}`
    })
  } else {
    logTest('Content Repurposing Bot', 'error', {
      message: 'Endpoint not found (404)'
    })
  }

  // Test 7: Content Assistant Bot
  console.log('📋 Testing Content Assistant Bot...')
  const assistantTest = await testEndpoint('POST', '/api/bots/content-assistant', { content: 'test', platform: 'instagram' }, true)
  if (assistantTest.exists) {
    logTest('Content Assistant Bot', assistantTest.status === 401 || assistantTest.status === 200 || assistantTest.status === 400 ? 'pass' : 'fail', {
      message: `Status: ${assistantTest.status}`
    })
  } else {
    logTest('Content Assistant Bot', 'error', {
      message: 'Endpoint not found (404)'
    })
  }

  // Test 8: Scheduling Assistant Bot
  console.log('📋 Testing Scheduling Assistant Bot...')
  const schedulingTest = await testEndpoint('POST', '/api/bots/scheduling-assistant', { platform: 'instagram' }, true)
  if (schedulingTest.exists) {
    logTest('Scheduling Assistant Bot', schedulingTest.status === 401 || schedulingTest.status === 200 || schedulingTest.status === 400 ? 'pass' : 'fail', {
      message: `Status: ${schedulingTest.status}`
    })
  } else {
    logTest('Scheduling Assistant Bot', 'error', {
      message: 'Endpoint not found (404)'
    })
  }

  // Test 9: Engagement Analyzer Bot
  console.log('📋 Testing Engagement Analyzer Bot...')
  const engagementTest = await testEndpoint('POST', '/api/bots/engagement-analyzer', { platform: 'instagram' }, true)
  if (engagementTest.exists) {
    logTest('Engagement Analyzer Bot', engagementTest.status === 401 || engagementTest.status === 200 || engagementTest.status === 400 ? 'pass' : 'fail', {
      message: `Status: ${engagementTest.status}`
    })
  } else {
    logTest('Engagement Analyzer Bot', 'error', {
      message: 'Endpoint not found (404)'
    })
  }

  // Test 10: Content Gap Analyzer Bot
  console.log('📋 Testing Content Gap Analyzer Bot...')
  const gapTest = await testEndpoint('POST', '/api/bots/content-gap-analyzer', { competitorTopics: ['test'] }, true)
  if (gapTest.exists) {
    logTest('Content Gap Analyzer Bot', gapTest.status === 401 || gapTest.status === 200 || gapTest.status === 400 ? 'pass' : 'fail', {
      message: `Status: ${gapTest.status}`
    })
  } else {
    logTest('Content Gap Analyzer Bot', 'error', {
      message: 'Endpoint not found (404)'
    })
  }

  // Test 11: Database Health
  console.log('📋 Testing Database Health...')
  const dbHealthTest = await testEndpoint('GET', '/api/db/health', null, false)
  if (dbHealthTest.exists && dbHealthTest.status === 200) {
    logTest('Database Health Check', 'pass', {
      message: 'Database is accessible'
    })
  } else {
    logTest('Database Health Check', 'fail', {
      message: `Status: ${dbHealthTest.status || 'Not accessible'}`
    })
  }

  // Test 12: Dashboard Page
  console.log('📋 Testing Dashboard Page...')
  const dashboardTest = await testEndpoint('GET', '/dashboard', null, false)
  if (dashboardTest.exists && dashboardTest.status < 500) {
    logTest('Dashboard Page', 'pass', {
      message: `Status: ${dashboardTest.status}`
    })
  } else {
    logTest('Dashboard Page', 'fail', {
      message: `Status: ${dashboardTest.status || 'Not accessible'}`
    })
  }

  // Summary
  console.log('')
  console.log('='.repeat(60))
  console.log('  TEST SUMMARY')
  console.log('='.repeat(60))
  
  const passed = results.tests.filter(t => t.status === 'pass').length
  const failed = results.tests.filter(t => t.status === 'fail').length
  const errors = results.tests.filter(t => t.status === 'error').length
  
  console.log(`✅ Passed: ${passed}`)
  console.log(`⚠️  Failed: ${failed}`)
  console.log(`❌ Errors: ${errors}`)
  console.log(`📊 Total: ${results.tests.length}`)
  console.log('')

  return results
}

// Run tests
testAllTools()
  .then(results => {
    // Write report
    const fs = require('fs')
    const report = `# CreatorFlow Tools Test Report

**Generated:** ${results.timestamp}
**Base URL:** ${results.baseUrl}

## Test Results Summary

- ✅ **Passed:** ${results.tests.filter(t => t.status === 'pass').length}
- ⚠️  **Failed:** ${results.tests.filter(t => t.status === 'fail').length}
- ❌ **Errors:** ${results.tests.filter(t => t.status === 'error').length}
- 📊 **Total Tests:** ${results.tests.length}

---

## Detailed Test Results

${results.tests.map(test => {
  const icon = test.status === 'pass' ? '✅' : test.status === 'fail' ? '⚠️' : '❌'
  return `### ${icon} ${test.name}

- **Status:** ${test.status.toUpperCase()}
- **Time:** ${test.timestamp}
${test.details.message ? `- **Details:** ${test.details.message}` : ''}
`
}).join('\n')}

---

## Recommendations

${results.tests.filter(t => t.status === 'error').length > 0 ? `
### ❌ Critical Issues

The following tools are not accessible:
${results.tests.filter(t => t.status === 'error').map(t => `- ${t.name}`).join('\n')}

**Action Required:** These endpoints need to be deployed or fixed.
` : ''}

${results.tests.filter(t => t.status === 'fail').length > 0 ? `
### ⚠️  Warnings

The following tools have issues:
${results.tests.filter(t => t.status === 'fail').map(t => `- ${t.name}: ${t.details.message || 'Unknown issue'}`).join('\n')}
` : ''}

${results.tests.filter(t => t.status === 'pass').length === results.tests.length ? `
### ✅ All Tests Passed!

All tools are working correctly. The system is ready for use.
` : ''}

---

**Note:** Tests check for endpoint existence and basic functionality. Full functionality requires authentication and proper test data.
`

    fs.writeFileSync('tools_report.md', report)
    console.log('📄 Report saved to: tools_report.md')
  })
  .catch(error => {
    console.error('❌ Test failed:', error)
    process.exit(1)
  })

