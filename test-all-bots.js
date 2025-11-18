/**
 * Comprehensive test script for all 10 bots
 * Tests each bot's POST endpoint with sample data
 */

const BASE_URL = 'http://localhost:3000'

// Test user credentials (you'll need to sign in first to get a token)
const TEST_EMAIL = 'test@example.com'
const TEST_PASSWORD = 'TestPassword123!'

// Get authentication token
async function getAuthToken() {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      })
    })
    
    if (!response.ok) {
      console.log('⚠️  Could not sign in. Please sign in manually and update TEST_EMAIL/TEST_PASSWORD in this script.')
      console.log('   Or use a token from localStorage: localStorage.getItem("token")')
      return null
    }
    
    const data = await response.json()
    return data.token
  } catch (error) {
    console.error('❌ Error getting auth token:', error.message)
    return null
  }
}

// Test a bot endpoint
async function testBot(name, endpoint, method, body, token) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: method === 'POST' ? JSON.stringify(body) : undefined
    })
    
    const data = await response.json()
    
    if (response.ok) {
      console.log(`✅ ${name}: SUCCESS`)
      if (data.expense || data.invoice || data.meeting || data.post || data.conversation || data.lead || data.recommendation || data.content) {
        console.log(`   Response: ${JSON.stringify(data).substring(0, 100)}...`)
      }
      return true
    } else {
      console.log(`❌ ${name}: FAILED`)
      console.log(`   Status: ${response.status}`)
      console.log(`   Error: ${data.error || JSON.stringify(data)}`)
      return false
    }
  } catch (error) {
    console.log(`❌ ${name}: ERROR`)
    console.log(`   ${error.message}`)
    return false
  }
}

// Main test function
async function testAllBots() {
  console.log('🚀 Testing All 10 Bots\n')
  console.log('=' .repeat(60))
  
  // Get auth token
  console.log('\n📝 Getting authentication token...')
  const token = await getAuthToken()
  
  if (!token) {
    console.log('\n💡 To test with authentication:')
    console.log('   1. Sign in at http://localhost:3000/signin')
    console.log('   2. Open browser console and run: localStorage.getItem("token")')
    console.log('   3. Update the token in this script or use the test credentials\n')
    console.log('   Testing without authentication (will show 401 errors)...\n')
  }
  
  const results = []
  
  // 1. Expense Tracker Bot
  console.log('\n1️⃣  Testing Expense Tracker Bot...')
  results.push(await testBot(
    'Expense Tracker',
    '/api/bots/expense-tracker',
    'POST',
    {
      expenseDate: '2024-01-15',
      amount: 25.50,
      description: 'Test expense - Office supplies'
    },
    token
  ))
  
  // 2. Invoice Generator Bot
  console.log('\n2️⃣  Testing Invoice Generator Bot...')
  results.push(await testBot(
    'Invoice Generator',
    '/api/bots/invoice-generator',
    'POST',
    {
      clientId: 1,
      invoiceDate: '2024-01-15',
      dueDate: '2024-02-15',
      items: [
        { description: 'Test Service', quantity: 1, unit_price: 100.00 }
      ]
    },
    token
  ))
  
  // 3. Email Sorter Bot
  console.log('\n3️⃣  Testing Email Sorter Bot...')
  results.push(await testBot(
    'Email Sorter',
    '/api/bots/email-sorter',
    'POST',
    {
      from: 'client@example.com',
      subject: 'Important: Project Update',
      body: 'Hi, I wanted to update you on the project status. Everything is going well!'
    },
    token
  ))
  
  // 4. Customer Service Bot
  console.log('\n4️⃣  Testing Customer Service Bot...')
  results.push(await testBot(
    'Customer Service',
    '/api/bots/customer-service',
    'POST',
    {
      message: 'I need help with my order',
      customerName: 'Test Customer',
      customerEmail: 'customer@example.com'
    },
    token
  ))
  
  // 5. Product Recommendation Bot
  console.log('\n5️⃣  Testing Product Recommendation Bot...')
  results.push(await testBot(
    'Product Recommendation',
    '/api/bots/product-recommendation',
    'POST',
    {
      category: 'electronics',
      preferences: 'budget-friendly, high quality'
    },
    token
  ))
  
  // 6. Sales Lead Qualifier Bot
  console.log('\n6️⃣  Testing Sales Lead Qualifier Bot...')
  results.push(await testBot(
    'Sales Lead Qualifier',
    '/api/bots/sales-lead-qualifier',
    'POST',
    {
      companyName: 'Test Corp',
      contactName: 'John Doe',
      email: 'john@testcorp.com',
      industry: 'Technology',
      companySize: '50-100',
      jobTitle: 'CTO'
    },
    token
  ))
  
  // 7. Website Chat Bot
  console.log('\n7️⃣  Testing Website Chat Bot...')
  results.push(await testBot(
    'Website Chat',
    '/api/bots/website-chat',
    'POST',
    {
      message: 'Hello, I have a question',
      visitorName: 'Test Visitor',
      visitorEmail: 'visitor@example.com'
    },
    token
  ))
  
  // 8. Content Writer Bot
  console.log('\n8️⃣  Testing Content Writer Bot...')
  results.push(await testBot(
    'Content Writer',
    '/api/bots/content-writer',
    'POST',
    {
      topic: 'The Future of AI',
      type: 'blog-post',
      tone: 'professional'
    },
    token
  ))
  
  // 9. Meeting Scheduler Bot
  console.log('\n9️⃣  Testing Meeting Scheduler Bot...')
  results.push(await testBot(
    'Meeting Scheduler',
    '/api/bots/meeting-scheduler',
    'POST',
    {
      title: 'Team Standup',
      startTime: '2024-01-20T10:00:00Z',
      endTime: '2024-01-20T11:00:00Z',
      attendees: ['team@example.com'],
      location: 'Zoom'
    },
    token
  ))
  
  // 10. Social Media Manager Bot
  console.log('\n🔟 Testing Social Media Manager Bot...')
  results.push(await testBot(
    'Social Media Manager',
    '/api/bots/social-media-manager',
    'POST',
    {
      platform: 'instagram',
      content: 'Check out our new product launch! #innovation #tech',
      hashtags: ['innovation', 'tech', 'newproduct']
    },
    token
  ))
  
  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('\n📊 TEST SUMMARY\n')
  
  const passed = results.filter(r => r).length
  const failed = results.filter(r => !r).length
  const total = results.length
  
  console.log(`✅ Passed: ${passed}/${total}`)
  console.log(`❌ Failed: ${failed}/${total}`)
  console.log(`📈 Success Rate: ${Math.round((passed/total)*100)}%`)
  
  if (failed === 0) {
    console.log('\n🎉 All bots are working perfectly!')
  } else {
    console.log('\n⚠️  Some bots need attention. Check the errors above.')
  }
  
  console.log('\n' + '='.repeat(60))
}

// Run tests
testAllBots().catch(console.error)

