#!/usr/bin/env node

/**
 * Fix content_templates table - ensure user_id column exists
 */

const BASE_URL = process.env.BASE_URL || 'https://creatorflow-iota.vercel.app'

async function fixTable() {
  console.log('🔧 Fixing content_templates table...')
  console.log(`Base URL: ${BASE_URL}\n`)

  try {
    // Call init-db endpoint which will recreate the table if needed
    const response = await fetch(`${BASE_URL}/api/db/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Database setup completed')
      console.log('The content_templates table should now have the correct schema.\n')
      
      // Now test if we can create a template
      console.log('🧪 Testing Content Templates API...')
      
      // We need a valid token, so we'll just check if the endpoint exists
      const testResponse = await fetch(`${BASE_URL}/api/content-templates`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-token'
        }
      })
      
      if (testResponse.status === 401) {
        console.log('✅ Content Templates API endpoint is accessible (requires auth)')
      } else if (testResponse.status === 404) {
        console.log('❌ Content Templates API endpoint not found')
      } else {
        console.log(`⚠️  Unexpected status: ${testResponse.status}`)
      }
      
      return true
    } else {
      console.error('❌ Database setup failed:')
      console.error(JSON.stringify(data, null, 2))
      return false
    }
  } catch (error) {
    console.error('❌ Error fixing table:', error.message)
    return false
  }
}

fixTable()
  .then(success => {
    console.log('\n' + (success ? '✅ Fix completed' : '❌ Fix failed'))
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

