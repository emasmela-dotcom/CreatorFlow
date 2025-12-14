#!/usr/bin/env node

/**
 * Comprehensive Bot & Tool Testing Script
 * Tests all 18 AI bots and 7 core tools for functionality
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const TEST_TOKEN = process.env.TEST_TOKEN || null

const results = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  tests: [],
  authToken: null,
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0
  }
}

function logTest(name, status, details = {}) {
  const test = {
    name,
    status,
    details,
    timestamp: new Date().toISOString()
  }
  results.tests.push(test)
  results.summary.total++
  
  if (status === 'pass') {
    results.summary.passed++
    console.log(`✅ ${name}`)
  } else if (status === 'fail') {
    results.summary.failed++
    console.log(`❌ ${name}`)
    if (details.error) console.log(`   Error: ${details.error}`)
    if (details.message) console.log(`   ${details.message}`)
  } else if (status === 'skip') {
    results.summary.skipped++
    console.log(`⏭️  ${name} (skipped)`)
  }
}

async function makeRequest(method, path, body = null, token = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    }
    if (body) options.body = JSON.stringify(body)
    if (token) options.headers['Authorization'] = `Bearer ${token}`
    
    const response = await fetch(`${BASE_URL}${path}`, options)
    let data
    try {
      data = await response.json()
    } catch (e) {
      data = { error: 'Invalid JSON response', raw: await response.text().catch(() => '') }
    }
    
    return { status: response.status, ok: response.ok, data, error: data.error }
  } catch (error) {
    return { status: 0, ok: false, error: error.message, data: { error: error.message } }
  }
}

async function setupAuth() {
  if (TEST_TOKEN) {
    results.authToken = TEST_TOKEN
    logTest('Authentication Setup', 'pass', { message: 'Using provided TEST_TOKEN' })
    return TEST_TOKEN
  }

  // Try to create a test account
  const testEmail = `test-${Date.now()}@test.com`
  const testPassword = 'TestPassword123!'

  try {
    const signupRes = await makeRequest('POST', '/api/auth', {
      email: testEmail,
      password: testPassword,
      action: 'signup',
      planType: 'free'
    })

    if (signupRes.ok && signupRes.data.token) {
      results.authToken = signupRes.data.token
      logTest('Authentication Setup', 'pass', { message: 'Created test account' })
      return signupRes.data.token
    } else {
      logTest('Authentication Setup', 'fail', { 
        error: signupRes.data.error || 'Failed to create test account',
        message: 'Please provide TEST_TOKEN environment variable'
      })
      return null
    }
  } catch (error) {
    logTest('Authentication Setup', 'fail', { 
      error: error.message,
      message: 'Please provide TEST_TOKEN environment variable'
    })
    return null
  }
}

// ==================== AI BOTS TESTS ====================

async function testContentAssistant(token) {
  const res = await makeRequest('POST', '/api/bots/content-assistant', {
    content: 'Check out my new fitness routine! #fitness #health',
    platform: 'instagram'
  }, token)

  if (res.ok && res.data.analysis) {
    logTest('Content Assistant Bot', 'pass')
  } else {
    logTest('Content Assistant Bot', 'fail', { error: res.data.error || 'No analysis returned' })
  }
}

async function testSchedulingAssistant(token) {
  const res = await makeRequest('POST', '/api/bots/scheduling-assistant', {
    platform: 'instagram',
    timezone: 'America/New_York'
  }, token)

  if (res.ok && res.data.recommendations?.optimalTimes) {
    logTest('Scheduling Assistant Bot', 'pass')
  } else {
    logTest('Scheduling Assistant Bot', 'fail', { error: res.data.error || 'No optimal times returned' })
  }
}

async function testEngagementAnalyzer(token) {
  const res = await makeRequest('POST', '/api/bots/engagement-analyzer', {
    platform: 'instagram',
    postId: 'test-post-123'
  }, token)

  if (res.ok && (res.data.analysis || res.data.insights)) {
    logTest('Engagement Analyzer Bot', 'pass')
  } else {
    logTest('Engagement Analyzer Bot', 'fail', { error: res.data.error || 'No analysis returned' })
  }
}

async function testTrendScout(token) {
  const res = await makeRequest('POST', '/api/bots/trend-scout', {
    platform: 'instagram',
    niche: 'fitness'
  }, token)

  if (res.ok && res.data.analysis?.trendingTopics) {
    logTest('Trend Scout Bot', 'pass')
  } else {
    logTest('Trend Scout Bot', 'fail', { error: res.data.error || 'No trends returned' })
  }
}

async function testContentCuration(token) {
  const res = await makeRequest('POST', '/api/bots/content-curation', {
    platform: 'instagram',
    niche: 'business'
  }, token)

  if (res.ok && res.data.analysis?.contentIdeas) {
    logTest('Content Curation Bot', 'pass')
  } else {
    logTest('Content Curation Bot', 'fail', { error: res.data.error || 'No ideas returned' })
  }
}

async function testAnalyticsCoach(token) {
  const res = await makeRequest('POST', '/api/bots/analytics-coach', {
    platform: 'instagram',
    timeframe: '30days'
  }, token)

  if (res.ok && res.data.analysis?.insights) {
    logTest('Analytics Coach Bot', 'pass')
  } else {
    logTest('Analytics Coach Bot', 'fail', { error: res.data.error || 'No insights returned' })
  }
}

async function testContentWriter(token) {
  const res = await makeRequest('POST', '/api/bots/content-writer', {
    topic: '10 Tips for Better Social Media Engagement',
    type: 'blog-post',
    tone: 'professional',
    length: 500
  }, token)

  if (res.ok && res.data.content) {
    logTest('Content Writer Bot', 'pass')
  } else {
    logTest('Content Writer Bot', 'fail', { error: res.data.error || 'No content returned' })
  }
}

async function testContentGapAnalyzer(token) {
  const res = await makeRequest('POST', '/api/bots/content-gap-analyzer', {
    platform: 'instagram',
    niche: 'fitness',
    competitorTopics: ['workout routines', 'nutrition tips', 'fitness motivation']
  }, token)

  if (res.ok && (res.data.gaps || res.data.opportunities)) {
    logTest('Content Gap Analyzer Bot', 'pass')
  } else {
    logTest('Content Gap Analyzer Bot', 'fail', { error: res.data.error || 'No gaps returned' })
  }
}

async function testContentRepurposing(token) {
  const res = await makeRequest('POST', '/api/bots/content-repurposing', {
    originalContent: 'Check out my new fitness routine!',
    contentType: 'post',
    targetPlatforms: ['twitter']
  }, token)

  if (res.ok && res.data.repurposed) {
    logTest('Content Repurposing Bot', 'pass')
  } else {
    logTest('Content Repurposing Bot', 'fail', { error: res.data.error || 'No repurposed content returned' })
  }
}

async function testExpenseTracker(token) {
  const res = await makeRequest('POST', '/api/bots/expense-tracker', {
    expenseDate: new Date().toISOString().split('T')[0],
    amount: 50.00,
    description: 'Office supplies',
    category: 'Office'
  }, token)

  if (res.ok && (res.data.expense || res.data.success)) {
    logTest('Expense Tracker Bot', 'pass')
  } else {
    logTest('Expense Tracker Bot', 'fail', { error: res.data.error || 'No expense created' })
  }
}

async function testInvoiceGenerator(token) {
  const res = await makeRequest('POST', '/api/bots/invoice-generator', {
    clientId: 1,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ description: 'Web Design', quantity: 10, unit_price: 100 }]
  }, token)

  if (res.ok && (res.data.invoice || res.data.success)) {
    logTest('Invoice Generator Bot', 'pass')
  } else {
    logTest('Invoice Generator Bot', 'fail', { error: res.data.error || 'No invoice created' })
  }
}

async function testEmailSorter(token) {
  const res = await makeRequest('POST', '/api/bots/email-sorter', {
    from: 'client@example.com',
    subject: 'Urgent: Project Update',
    body: 'We need to discuss the project immediately.'
  }, token)

  if (res.ok && res.data.categorization) {
    logTest('Email Sorter Bot', 'pass')
  } else {
    logTest('Email Sorter Bot', 'fail', { error: res.data.error || 'No categorization returned' })
  }
}

async function testCustomerService(token) {
  const res = await makeRequest('POST', '/api/bots/customer-service', {
    message: 'What are your business hours?',
    conversationId: `conv_${Date.now()}`,
    customerName: 'Test Customer'
  }, token)

  if (res.ok && res.data.response) {
    logTest('Customer Service Bot', 'pass')
  } else {
    logTest('Customer Service Bot', 'fail', { error: res.data.error || 'No response returned' })
  }
}

async function testProductRecommendation(token) {
  const res = await makeRequest('POST', '/api/bots/product-recommendation', {
    customerId: 123,
    category: 'electronics',
    preferences: ['wireless', 'portable']
  }, token)

  if (res.ok && (res.data.recommendations || res.data.products)) {
    logTest('Product Recommendation Bot', 'pass')
  } else {
    logTest('Product Recommendation Bot', 'fail', { error: res.data.error || 'No recommendations returned' })
  }
}

async function testSalesLeadQualifier(token) {
  const res = await makeRequest('POST', '/api/bots/sales-lead-qualifier', {
    leadName: 'John Doe',
    companyName: 'Test Corp',
    email: 'john@testcorp.com',
    budget: 50000,
    timeline: 'Q1 2025'
  }, token)

  if (res.ok && (res.data.score || res.data.qualification)) {
    logTest('Sales Lead Qualifier Bot', 'pass')
  } else {
    logTest('Sales Lead Qualifier Bot', 'fail', { error: res.data.error || 'No qualification returned' })
  }
}

async function testMeetingScheduler(token) {
  const res = await makeRequest('POST', '/api/bots/meeting-scheduler', {
    title: 'Client Consultation',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    attendees: ['client@example.com'],
    location: 'Zoom'
  }, token)

  if (res.ok && (res.data.meeting || res.data.success)) {
    logTest('Meeting Scheduler Bot', 'pass')
  } else {
    logTest('Meeting Scheduler Bot', 'fail', { error: res.data.error || 'No meeting created' })
  }
}

async function testSocialMediaManager(token) {
  const res = await makeRequest('POST', '/api/bots/social-media-manager', {
    platform: 'instagram',
    content: 'Check out my new post!'
  }, token)

  if (res.ok && res.data.post) {
    logTest('Social Media Manager Bot', 'pass')
  } else {
    logTest('Social Media Manager Bot', 'fail', { error: res.data.error || 'No post returned' })
  }
}

async function testWebsiteChat(token) {
  const res = await makeRequest('POST', '/api/bots/website-chat', {
    message: 'Hello, I need help',
    conversationId: `chat_${Date.now()}`,
    visitorName: 'Test Visitor'
  }, token)

  if (res.ok && res.data.response) {
    logTest('Website Chat Bot', 'pass')
  } else {
    logTest('Website Chat Bot', 'fail', { error: res.data.error || 'No response returned' })
  }
}

// ==================== CORE TOOLS TESTS ====================

async function testHashtagResearch(token) {
  const res = await makeRequest('POST', '/api/hashtag-research', {
    action: 'research',
    platform: 'instagram',
    niche: 'fitness',
    content: 'Check out my new workout routine!'
  }, token)

  if (res.ok && (res.data.trending || res.data.recommended)) {
    logTest('Hashtag Research Tool', 'pass')
  } else {
    logTest('Hashtag Research Tool', 'fail', { error: res.data.error || 'No hashtags returned' })
  }
}

async function testContentTemplates(token) {
  // Create template
  const createRes = await makeRequest('POST', '/api/content-templates', {
    name: 'Test Template',
    content: 'This is a test template content',
    platform: 'instagram'
  }, token)

  if (createRes.ok && createRes.data.template) {
    // Get templates
    const getRes = await makeRequest('GET', '/api/content-templates', null, token)
    if (getRes.ok && Array.isArray(getRes.data.templates)) {
      logTest('Content Templates Tool', 'pass')
    } else {
      logTest('Content Templates Tool', 'fail', { error: 'Failed to retrieve templates' })
    }
  } else {
    logTest('Content Templates Tool', 'fail', { error: createRes.data.error || 'Failed to create template' })
  }
}

async function testDocuments(token) {
  // Create document
  const createRes = await makeRequest('POST', '/api/documents', {
    title: 'Test Document',
    content: 'This is test document content'
  }, token)

  if (createRes.ok && createRes.data.document) {
    // Get documents
    const getRes = await makeRequest('GET', '/api/documents', null, token)
    if (getRes.ok && Array.isArray(getRes.data.documents)) {
      logTest('Documents Tool', 'pass')
    } else {
      logTest('Documents Tool', 'fail', { error: 'Failed to retrieve documents' })
    }
  } else {
    logTest('Documents Tool', 'fail', { error: createRes.data.error || 'Failed to create document' })
  }
}

async function testContentCalendar(token) {
  // Get calendar events
  const res = await makeRequest('GET', '/api/calendar', null, token)

  if (res.ok && Array.isArray(res.data.events)) {
    logTest('Content Calendar Tool', 'pass')
  } else {
    logTest('Content Calendar Tool', 'fail', { error: res.data.error || 'Failed to get calendar events' })
  }
}

async function testContentSearch(token) {
  const res = await makeRequest('GET', '/api/search?query=test', null, token)

  if (res.ok && (Array.isArray(res.data.results) || res.data.results)) {
    logTest('Content Library Search Tool', 'pass')
  } else {
    logTest('Content Library Search Tool', 'fail', { error: res.data.error || 'No search results returned' })
  }
}

async function testPerformanceAnalytics(token) {
  const res = await makeRequest('GET', '/api/analytics/performance', null, token)

  if (res.ok && (res.data.metrics || res.data.overview)) {
    logTest('Performance Analytics Tool', 'pass')
  } else {
    logTest('Performance Analytics Tool', 'fail', { error: res.data.error || 'No analytics returned' })
  }
}

async function testPosts(token) {
  // Get posts
  const getRes = await makeRequest('GET', '/api/posts', null, token)
  
  if (getRes.ok && Array.isArray(getRes.data.posts)) {
    logTest('Posts Tool', 'pass')
  } else {
    logTest('Posts Tool', 'fail', { error: getRes.data.error || 'Failed to get posts' })
  }
}

// ==================== MAIN TEST RUNNER ====================

async function runAllTests() {
  console.log('\n🧪 Starting Comprehensive Bot & Tool Tests...\n')
  console.log(`Base URL: ${BASE_URL}\n`)

  const token = await setupAuth()
  if (!token) {
    console.log('\n❌ Cannot proceed without authentication token')
    console.log('   Please provide TEST_TOKEN environment variable or ensure signup works\n')
    return
  }

  console.log('\n--- Testing AI Bots (18 total) ---\n')
  
  // Test all 18 AI bots
  await testContentAssistant(token)
  await testSchedulingAssistant(token)
  await testEngagementAnalyzer(token)
  await testTrendScout(token)
  await testContentCuration(token)
  await testAnalyticsCoach(token)
  await testContentWriter(token)
  await testContentGapAnalyzer(token)
  await testContentRepurposing(token)
  await testExpenseTracker(token)
  await testInvoiceGenerator(token)
  await testEmailSorter(token)
  await testCustomerService(token)
  await testProductRecommendation(token)
  await testSalesLeadQualifier(token)
  await testMeetingScheduler(token)
  await testSocialMediaManager(token)
  await testWebsiteChat(token)

  console.log('\n--- Testing Core Tools (7 total) ---\n')

  // Test all 7 core tools
  await testHashtagResearch(token)
  await testContentTemplates(token)
  await testDocuments(token)
  await testContentCalendar(token)
  await testContentSearch(token)
  await testPerformanceAnalytics(token)
  await testPosts(token)

  // Print summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 TEST SUMMARY')
  console.log('='.repeat(50))
  console.log(`Total Tests: ${results.summary.total}`)
  console.log(`✅ Passed: ${results.summary.passed}`)
  console.log(`❌ Failed: ${results.summary.failed}`)
  console.log(`⏭️  Skipped: ${results.summary.skipped}`)
  console.log(`Success Rate: ${((results.summary.passed / results.summary.total) * 100).toFixed(1)}%`)
  console.log('='.repeat(50) + '\n')

  // Save results
  const fs = require('fs')
  const resultsPath = 'test-results-all-bots-tools.json'
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2))
  console.log(`📄 Detailed results saved to: ${resultsPath}\n`)

  // Exit with error code if any tests failed
  process.exit(results.summary.failed > 0 ? 1 : 0)
}

// Run tests
runAllTests().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})

