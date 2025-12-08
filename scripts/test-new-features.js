#!/usr/bin/env node

/**
 * Test script for new features:
 * 1. Content Calendar/Scheduler
 * 2. Content Library Search
 * 3. Performance Analytics Dashboard
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const TEST_TOKEN = process.env.TEST_TOKEN || ''

async function testFeature(name, testFn) {
  console.log(`\n🧪 Testing ${name}...`)
  try {
    await testFn()
    console.log(`✅ ${name} - PASSED`)
    return true
  } catch (error) {
    console.error(`❌ ${name} - FAILED:`, error.message)
    return false
  }
}

async function makeRequest(endpoint, method = 'GET', body = null) {
  const url = `${BASE_URL}${endpoint}`
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(TEST_TOKEN && { 'Authorization': `Bearer ${TEST_TOKEN}` })
    }
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(url, options)
  
  // Check if response is HTML (likely an error page)
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('text/html')) {
    const text = await response.text()
    if (response.status === 401) {
      throw new Error(`Unauthorized (401) - Need authentication token. Set TEST_TOKEN environment variable.`)
    }
    throw new Error(`Got HTML response instead of JSON. Status: ${response.status}. First 100 chars: ${text.substring(0, 100)}`)
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${data.error || 'Unknown error'}`)
  }

  return data
}

// Test 1: Content Calendar
async function testCalendar() {
  // Test GET - Get calendar events
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

  const getData = await makeRequest(`/api/calendar?startDate=${startDate}&endDate=${endDate}`)
  console.log(`  📅 Found ${getData.events?.length || 0} scheduled events`)

  if (!getData.success) {
    throw new Error('GET calendar failed')
  }

  // Test POST - Create a scheduled post
  const scheduledAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString() // Tomorrow
  const postData = await makeRequest('/api/calendar', 'POST', {
    platform: 'instagram',
    content: 'Test scheduled post from calendar API',
    scheduledAt,
    status: 'scheduled'
  })

  console.log(`  ✅ Created scheduled post: ${postData.event?.id}`)

  if (!postData.success || !postData.event) {
    throw new Error('POST calendar failed')
  }

  // Test DELETE - Delete the test post
  if (postData.event.id) {
    const deleteData = await makeRequest(`/api/calendar?id=${postData.event.id}`, 'DELETE')
    console.log(`  🗑️  Deleted test post`)
    
    if (!deleteData.success) {
      throw new Error('DELETE calendar failed')
    }
  }
}

// Test 2: Content Library Search
async function testSearch() {
  // Test search with empty query
  const emptyData = await makeRequest('/api/search?q=')
  if (!emptyData.success || emptyData.total !== 0) {
    throw new Error('Empty search should return 0 results')
  }
  console.log(`  🔍 Empty search handled correctly`)

  // Test search with query
  const searchData = await makeRequest('/api/search?q=test')
  console.log(`  📊 Search results: ${searchData.total} total`)
  console.log(`     - Documents: ${searchData.results?.documents?.length || 0}`)
  console.log(`     - Templates: ${searchData.results?.templates?.length || 0}`)
  console.log(`     - Hashtag Sets: ${searchData.results?.hashtagSets?.length || 0}`)

  if (!searchData.success) {
    throw new Error('Search failed')
  }

  // Test search by type
  const typeData = await makeRequest('/api/search?q=test&type=documents')
  console.log(`  📄 Documents-only search: ${typeData.results?.documents?.length || 0} results`)

  if (!typeData.success) {
    throw new Error('Type-specific search failed')
  }
}

// Test 3: Performance Analytics
async function testAnalytics() {
  // Test with default 30 days
  const data30 = await makeRequest('/api/analytics/performance?days=30')
  console.log(`  📈 Last 30 days:`)
  console.log(`     - Total Posts: ${data30.overview?.totalPosts || 0}`)
  console.log(`     - Total Engagement: ${data30.overview?.totalEngagement || 0}`)
  console.log(`     - Avg Engagement: ${data30.overview?.avgEngagement || 0}`)
  console.log(`     - Growth Rate: ${data30.overview?.growthRate || 0}%`)
  console.log(`     - Top Posts: ${data30.topPosts?.length || 0}`)

  if (!data30.success) {
    throw new Error('Analytics API failed')
  }

  // Test with 7 days
  const data7 = await makeRequest('/api/analytics/performance?days=7')
  console.log(`  📊 Last 7 days: ${data7.overview?.totalPosts || 0} posts`)

  if (!data7.success) {
    throw new Error('Analytics with custom days failed')
  }

  // Test with platform filter
  const dataPlatform = await makeRequest('/api/analytics/performance?days=30&platform=instagram')
  console.log(`  📱 Instagram filter: ${dataPlatform.overview?.totalPosts || 0} posts`)

  if (!dataPlatform.success) {
    throw new Error('Platform-filtered analytics failed')
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting tests for new features...')
  console.log(`📍 Base URL: ${BASE_URL}`)
  console.log(`${TEST_TOKEN ? '🔑 Using authentication token' : '⚠️  No token provided - some tests may fail'}`)

  const results = {
    calendar: false,
    search: false,
    analytics: false
  }

  results.calendar = await testFeature('Content Calendar', testCalendar)
  results.search = await testFeature('Content Library Search', testSearch)
  results.analytics = await testFeature('Performance Analytics', testAnalytics)

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 TEST SUMMARY')
  console.log('='.repeat(50))
  console.log(`Content Calendar:        ${results.calendar ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Content Library Search:   ${results.search ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Performance Analytics:    ${results.analytics ? '✅ PASS' : '❌ FAIL'}`)
  console.log('='.repeat(50))

  const allPassed = Object.values(results).every(r => r)
  console.log(`\n${allPassed ? '✅ All tests passed!' : '❌ Some tests failed'}`)

  process.exit(allPassed ? 0 : 1)
}

// Run tests
runTests().catch(error => {
  console.error('💥 Test runner error:', error)
  process.exit(1)
})

