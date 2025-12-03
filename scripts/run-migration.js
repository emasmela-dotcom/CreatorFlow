#!/usr/bin/env node

/**
 * Run Database Migration
 * Initializes the new database tables (hashtag_sets, content_templates, engagement_inbox)
 */

const BASE_URL = process.env.BASE_URL || 'https://creatorflow-live.vercel.app'

async function runMigration() {
  console.log('🚀 Running database migration...')
  console.log(`📍 Target: ${BASE_URL}`)
  console.log('')

  try {
    // Try the setup endpoint first (POST)
    console.log('📋 Attempting POST /api/db/setup...')
    const setupResponse = await fetch(`${BASE_URL}/api/db/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (setupResponse.ok) {
      const data = await setupResponse.json()
      console.log('✅ Setup endpoint response:')
      console.log(JSON.stringify(data, null, 2))
      
      if (data.success) {
        console.log('')
        console.log('✅ Database migration completed successfully!')
        return true
      }
    } else {
      console.log(`⚠️  Setup endpoint returned ${setupResponse.status}`)
    }

    // Fallback to init-db endpoint (GET)
    console.log('')
    console.log('📋 Attempting GET /api/init-db...')
    const initResponse = await fetch(`${BASE_URL}/api/init-db`, {
      method: 'GET'
    })

    if (initResponse.ok) {
      const data = await initResponse.json()
      console.log('✅ Init endpoint response:')
      console.log(JSON.stringify(data, null, 2))
      
      if (data.success) {
        console.log('')
        console.log('✅ Database migration completed successfully!')
        return true
      }
    } else {
      console.log(`⚠️  Init endpoint returned ${initResponse.status}`)
      const text = await initResponse.text()
      console.log('Response:', text.substring(0, 200))
    }

    console.log('')
    console.log('❌ Migration failed. Possible reasons:')
    console.log('  1. Deployment not complete yet - wait 2-5 minutes')
    console.log('  2. API routes not accessible - check Vercel deployment logs')
    console.log('  3. Database connection issue - verify DATABASE_URL in Vercel')
    console.log('')
    console.log('💡 Try again in a few minutes, or check:')
    console.log(`   - Vercel Dashboard: https://vercel.com/dashboard`)
    console.log(`   - Health Check: ${BASE_URL}/api/db/health`)

    return false
  } catch (error) {
    console.error('❌ Error running migration:', error.message)
    console.log('')
    console.log('💡 This might mean:')
    console.log('   - Deployment is still in progress')
    console.log('   - Network connectivity issue')
    console.log('   - API endpoint not available yet')
    console.log('')
    console.log('⏳ Wait 2-5 minutes and try again, or run manually:')
    console.log(`   curl -X POST ${BASE_URL}/api/db/setup`)
    return false
  }
}

async function verifyMigration() {
  console.log('')
  console.log('🔍 Verifying migration...')
  
  try {
    const healthResponse = await fetch(`${BASE_URL}/api/db/health`)
    
    if (healthResponse.ok) {
      const data = await healthResponse.json()
      console.log('✅ Health check response:')
      console.log('   Status:', data.status)
      console.log('   Connected:', data.connected)
      console.log('   Tables:')
      
      const tables = data.tables || {}
      const newTables = ['hashtag_sets', 'content_templates', 'engagement_inbox']
      
      newTables.forEach(table => {
        const exists = tables[table]
        console.log(`   - ${table}: ${exists ? '✅' : '❌'}`)
      })
      
      const allNewTablesExist = newTables.every(table => tables[table])
      
      if (allNewTablesExist) {
        console.log('')
        console.log('✅ All new tables created successfully!')
        return true
      } else {
        console.log('')
        console.log('⚠️  Some tables are missing. Run migration again.')
        return false
      }
    } else {
      console.log(`⚠️  Health check returned ${healthResponse.status}`)
      return false
    }
  } catch (error) {
    console.error('❌ Error verifying migration:', error.message)
    return false
  }
}

async function main() {
  console.log('='.repeat(60))
  console.log('  CreatorFlow Database Migration')
  console.log('='.repeat(60))
  console.log('')

  const success = await runMigration()
  
  if (success) {
    // Wait a moment for tables to be created
    await new Promise(resolve => setTimeout(resolve, 2000))
    await verifyMigration()
  }

  console.log('')
  console.log('='.repeat(60))
}

main().catch(console.error)

