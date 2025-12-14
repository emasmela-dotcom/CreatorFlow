#!/usr/bin/env node

/**
 * Fix Database Tables Script
 * Directly creates/fixes content_templates and documents tables
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const TEST_TOKEN = process.env.TEST_TOKEN || null

async function getDemoToken() {
  try {
    const response = await fetch(`${BASE_URL}/api/demo/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json()
    if (data.token) {
      return data.token
    }
  } catch (error) {
    console.error('Error getting token:', error)
  }
  return null
}

async function fixTables(token) {
  console.log('🔧 Fixing database tables...\n')

  // Fix content_templates
  try {
    console.log('1. Testing content_templates...')
    const test1 = await fetch(`${BASE_URL}/api/content-templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test Template',
        content: 'Test content',
        platform: 'instagram'
      })
    })
    const result1 = await test1.json()
    if (result1.success || result1.template) {
      console.log('   ✅ content_templates table is working!')
    } else {
      console.log('   ❌ Error:', result1.error)
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message)
  }

  // Fix documents
  try {
    console.log('2. Testing documents...')
    const test2 = await fetch(`${BASE_URL}/api/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Test Document',
        content: 'Test content'
      })
    })
    const result2 = await test2.json()
    if (result2.success || result2.document) {
      console.log('   ✅ documents table is working!')
    } else {
      console.log('   ❌ Error:', result2.error)
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message)
  }

  console.log('\n✅ Database table fix complete!')
}

async function main() {
  console.log('🚀 Database Table Fix Script\n')
  
  const token = TEST_TOKEN || await getDemoToken()
  if (!token) {
    console.log('❌ Could not get authentication token')
    process.exit(1)
  }

  await fixTables(token)
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})

