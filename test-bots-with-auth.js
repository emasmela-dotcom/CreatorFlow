/**
 * Test all bots with authentication
 * This script will create a test user and test all bots with real requests
 */

const BASE_URL = 'http://localhost:3000'
const TEST_EMAIL = `test-${Date.now()}@example.com`
const TEST_PASSWORD = 'TestPassword123!'

let authToken = null

async function signup() {
  try {
    const response = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        fullName: 'Test User',
        action: 'signup'
      })
    })
    
    const data = await response.json()
    if (response.ok && data.token) {
      authToken = data.token
      console.log('✅ Test user created and authenticated')
      return true
    } else {
      console.log('⚠️  Signup response:', data)
      return false
    }
  } catch (error) {
    console.error('❌ Signup error:', error.message)
    return false
  }
}

async function testBot(name, endpoint, method, body) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    }
    
    if (body && method === 'POST') {
      options.body = JSON.stringify(body)
    }
    
    const response = await fetch(`${BASE_URL}/api/bots/${endpoint}`, options)
    const data = await response.json()
    
    if (response.ok) {
      console.log(`✅ ${name}: SUCCESS`)
      return { success: true, data }
    } else {
      console.log(`❌ ${name}: FAILED - ${data.error || 'Unknown error'}`)
      return { success: false, error: data.error }
    }
  } catch (error) {
    console.log(`❌ ${name}: ERROR - ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log('🚀 Testing All 10 Bots with Authentication\n')
  console.log('='.repeat(60))
  
  // Create test user
  console.log('\n📝 Creating test user...')
  const signedUp = await signup()
  
  if (!signedUp) {
    console.log('\n❌ Could not create test user. Exiting.')
    return
  }
  
  console.log(`\n📧 Test Email: ${TEST_EMAIL}`)
  console.log(`🔑 Token: ${authToken.substring(0, 20)}...\n`)
  
  const results = []
  
  // Test all bots
  console.log('Testing bots...\n')
  
  // 1. Expense Tracker
  results.push(await testBot(
    '1. Expense Tracker',
    'expense-tracker',
    'POST',
    {
      expenseDate: '2024-01-15',
      amount: 25.50,
      description: 'Test expense - Office supplies'
    }
  ))
  
  // 2. Invoice Generator (needs client first)
  results.push(await testBot(
    '2. Invoice Generator',
    'invoice-generator',
    'POST',
    {
      clientId: 1,
      invoiceDate: '2024-01-15',
      dueDate: '2024-02-15',
      items: [
        { description: 'Test Service', quantity: 1, unit_price: 100.00 }
      ]
    }
  ))
  
  // 3. Email Sorter
  results.push(await testBot(
    '3. Email Sorter',
    'email-sorter',
    'POST',
    {
      from: 'client@example.com',
      subject: 'Important: Project Update',
      body: 'Hi, I wanted to update you on the project status.'
    }
  ))
  
  // 4. Customer Service
  results.push(await testBot(
    '4. Customer Service',
    'customer-service',
    'POST',
    {
      message: 'I need help with my order',
      customerName: 'Test Customer',
      customerEmail: 'customer@example.com'
    }
  ))
  
  // 5. Product Recommendation
  results.push(await testBot(
    '5. Product Recommendation',
    'product-recommendation',
    'POST',
    {
      category: 'electronics',
      preferences: 'budget-friendly, high quality'
    }
  ))
  
  // 6. Sales Lead Qualifier
  results.push(await testBot(
    '6. Sales Lead Qualifier',
    'sales-lead-qualifier',
    'POST',
    {
      companyName: 'Test Corp',
      contactName: 'John Doe',
      email: 'john@testcorp.com',
      industry: 'Technology',
      companySize: '50-100',
      jobTitle: 'CTO'
    }
  ))
  
  // 7. Website Chat
  results.push(await testBot(
    '7. Website Chat',
    'website-chat',
    'POST',
    {
      message: 'Hello, I have a question',
      visitorName: 'Test Visitor',
      visitorEmail: 'visitor@example.com'
    }
  ))
  
  // 8. Content Writer
  results.push(await testBot(
    '8. Content Writer',
    'content-writer',
    'POST',
    {
      topic: 'The Future of AI',
      type: 'blog-post',
      tone: 'professional'
    }
  ))
  
  // 9. Meeting Scheduler
  results.push(await testBot(
    '9. Meeting Scheduler',
    'meeting-scheduler',
    'POST',
    {
      title: 'Team Standup',
      startTime: '2024-01-20T10:00:00Z',
      endTime: '2024-01-20T11:00:00Z',
      attendees: ['team@example.com'],
      location: 'Zoom'
    }
  ))
  
  // 10. Social Media Manager
  results.push(await testBot(
    '10. Social Media Manager',
    'social-media-manager',
    'POST',
    {
      platform: 'instagram',
      content: 'Check out our new product launch! #innovation #tech',
      hashtags: ['innovation', 'tech', 'newproduct']
    }
  ))
  
  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('\n📊 TEST SUMMARY\n')
  
  const passed = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  
  console.log(`✅ Passed: ${passed}/10`)
  console.log(`❌ Failed: ${failed}/10`)
  console.log(`📈 Success Rate: ${Math.round((passed/10)*100)}%`)
  
  if (failed === 0) {
    console.log('\n🎉 All bots are working perfectly!')
  } else {
    console.log('\n⚠️  Some bots need attention. Check the errors above.')
  }
  
  console.log('\n' + '='.repeat(60))
}

runTests().catch(console.error)

