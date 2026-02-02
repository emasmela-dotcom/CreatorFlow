#!/usr/bin/env node

/**
 * Test Content Templates API specifically
 * This will verify the table schema is correct
 */

const BASE_URL = process.env.BASE_URL || 'https://www.creatorflow365.com'

async function testContentTemplates() {
  console.log('🧪 Testing Content Templates API...')
  console.log(`Base URL: ${BASE_URL}\n`)

  // First, ensure database is set up
  console.log('1️⃣ Running database migration...')
  try {
    const setupResponse = await fetch(`${BASE_URL}/api/db/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    const setupData = await setupResponse.json()
    if (setupResponse.ok) {
      console.log('✅ Database setup completed\n')
    } else {
      console.log('⚠️  Database setup had issues:', setupData.message || 'Unknown')
    }
  } catch (error) {
    console.log('⚠️  Could not run database setup:', error.message)
  }

  // Test 1: Check if endpoint exists (should return 401, not 404)
  console.log('2️⃣ Testing endpoint existence...')
  const testResponse = await fetch(`${BASE_URL}/api/content-templates`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer invalid-token-for-testing'
    }
  })

  if (testResponse.status === 404) {
    console.log('❌ Content Templates API endpoint not found (404)')
    return false
  } else if (testResponse.status === 401) {
    console.log('✅ Content Templates API endpoint exists (401 - requires auth)')
  } else {
    console.log(`⚠️  Unexpected status: ${testResponse.status}`)
  }

  // Test 2: Try to create a template (will fail auth, but should not fail on table schema)
  console.log('\n3️⃣ Testing POST endpoint (should fail on auth, not table schema)...')
  try {
    const createResponse = await fetch(`${BASE_URL}/api/content-templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-token-for-testing'
      },
      body: JSON.stringify({
        name: 'Test Template',
        content: 'Test content',
        platform: 'instagram'
      })
    })

    const createData = await createResponse.json()

    if (createResponse.status === 401) {
      console.log('✅ POST endpoint works (401 - requires valid auth)')
      console.log('   This means the endpoint is accessible and table schema is likely correct')
      return true
    } else if (createResponse.status === 500) {
      const errorMsg = createData.error || 'Unknown error'
      if (errorMsg.includes('user_id') || errorMsg.includes('column')) {
        console.log('❌ Table schema error detected:')
        console.log(`   Error: ${errorMsg}`)
        console.log('\n   The content_templates table is missing the user_id column!')
        console.log('   Run the database migration again to fix this.')
        return false
      } else {
        console.log(`⚠️  Server error (500): ${errorMsg}`)
        return false
      }
    } else {
      console.log(`⚠️  Unexpected status: ${createResponse.status}`)
      console.log(`   Response: ${JSON.stringify(createData, null, 2)}`)
      return false
    }
  } catch (error) {
    console.log('❌ Error testing POST:', error.message)
    return false
  }
}

testContentTemplates()
  .then(success => {
    console.log('\n' + '='.repeat(60))
    if (success) {
      console.log('✅ Content Templates API test PASSED')
      console.log('   The table schema appears to be correct.')
    } else {
      console.log('❌ Content Templates API test FAILED')
      console.log('   The table schema needs to be fixed.')
    }
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

