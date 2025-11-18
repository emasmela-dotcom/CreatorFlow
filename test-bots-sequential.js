/**
 * Sequential test of all 10 bots
 * Tests each bot one by one with authentication
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
      return true
    }
    return false
  } catch (error) {
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
      console.log(`✅ ${name}: WORKING`)
      return true
    } else {
      console.log(`❌ ${name}: FAILED - ${data.error || 'Unknown error'}`)
      return false
    }
  } catch (error) {
    console.log(`❌ ${name}: ERROR - ${error.message}`)
    return false
  }
}

async function runTests() {
  console.log('🚀 Testing All 10 Bots Sequentially\n')
  console.log('='.repeat(60))
  
  // Create test user
  console.log('\n📝 Creating test user...')
  if (!await signup()) {
    console.log('❌ Could not create test user')
    return
  }
  console.log('✅ Test user created\n')
  
  const results = []
  
  // 1. Expense Tracker
  console.log('1️⃣  Expense Tracker Bot')
  results.push(await testBot(
    'Expense Tracker',
    'expense-tracker',
    'POST',
    { expenseDate: '2024-01-15', amount: 25.50, description: 'Test expense' }
  ))
  
  // 2. Invoice Generator
  console.log('\n2️⃣  Invoice Generator Bot')
  results.push(await testBot(
    'Invoice Generator',
    'invoice-generator',
    'POST',
    {
      clientId: 1,
      invoiceDate: '2024-01-15',
      dueDate: '2024-02-15',
      items: [{ description: 'Test Service', quantity: 1, unit_price: 100.00 }]
    }
  ))
  
  // 3. Email Sorter
  console.log('\n3️⃣  Email Sorter Bot')
  results.push(await testBot(
    'Email Sorter',
    'email-sorter',
    'POST',
    {
      from: 'client@example.com',
      subject: 'Project Update',
      body: 'Hi, here is the project update.'
    }
  ))
  
  // 4. Customer Service
  console.log('\n4️⃣  Customer Service Bot')
  results.push(await testBot(
    'Customer Service',
    'customer-service',
    'POST',
    {
      message: 'I need help with my order',
      customerName: 'Test Customer',
      customerEmail: 'customer@example.com'
    }
  ))
  
  // 5. Product Recommendation
  console.log('\n5️⃣  Product Recommendation Bot')
  results.push(await testBot(
    'Product Recommendation',
    'product-recommendation',
    'POST',
    {
      category: 'electronics',
      preferences: 'budget-friendly'
    }
  ))
  
  // 6. Sales Lead Qualifier
  console.log('\n6️⃣  Sales Lead Qualifier Bot')
  results.push(await testBot(
    'Sales Lead Qualifier',
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
  console.log('\n7️⃣  Website Chat Bot')
  results.push(await testBot(
    'Website Chat',
    'website-chat',
    'POST',
    {
      message: 'Hello, I have a question',
      visitorName: 'Test Visitor',
      visitorEmail: 'visitor@example.com'
    }
  ))
  
  // 8. Content Writer
  console.log('\n8️⃣  Content Writer Bot')
  results.push(await testBot(
    'Content Writer',
    'content-writer',
    'POST',
    {
      topic: 'The Future of AI',
      type: 'blog-post',
      tone: 'professional'
    }
  ))
  
  // 9. Meeting Scheduler
  console.log('\n9️⃣  Meeting Scheduler Bot')
  results.push(await testBot(
    'Meeting Scheduler',
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
  console.log('\n🔟 Social Media Manager Bot')
  results.push(await testBot(
    'Social Media Manager',
    'social-media-manager',
    'POST',
    {
      platform: 'instagram',
      content: 'Check out our new product! #innovation',
      hashtags: ['innovation', 'tech']
    }
  ))
  
  // Summary
  console.log('\n' + '='.repeat(60))
  const passed = results.filter(r => r).length
  console.log(`\n📊 Results: ${passed}/10 bots working`)
  console.log('='.repeat(60))
}

runTests().catch(console.error)

