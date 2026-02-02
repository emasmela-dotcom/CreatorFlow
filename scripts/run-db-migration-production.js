#!/usr/bin/env node

/**
 * Run database migration on production
 * Creates all missing tables
 */

const BASE_URL = process.env.BASE_URL || 'https://www.creatorflow365.com'

async function runMigration() {
  console.log('🚀 Running database migration on production...')
  console.log(`Base URL: ${BASE_URL}\n`)

  try {
    const response = await fetch(`${BASE_URL}/api/db/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (response.ok && data.success) {
      console.log('✅ Database migration completed successfully!')
      console.log('\nTables verified:')
      Object.entries(data.tables || {}).forEach(([table, exists]) => {
        console.log(`  ${exists ? '✅' : '❌'} ${table}`)
      })
      console.log(`\n📊 Indexes found: ${data.indexesFound || 0}`)
      return true
    } else {
      console.error('❌ Database migration failed:')
      console.error(JSON.stringify(data, null, 2))
      return false
    }
  } catch (error) {
    console.error('❌ Error running migration:', error.message)
    return false
  }
}

runMigration()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

