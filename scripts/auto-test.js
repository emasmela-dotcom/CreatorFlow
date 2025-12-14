#!/usr/bin/env node

/**
 * Auto Test Script - Gets token and runs all tests automatically
 */

const BASE_URL = 'http://localhost:3000'

async function getDemoToken() {
  try {
    console.log('🔑 Getting demo token...')
    const response = await fetch(`${BASE_URL}/api/demo/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    const data = await response.json()
    
    if (data.token) {
      console.log('✅ Got demo token!\n')
      return data.token
    } else {
      throw new Error('No token in response')
    }
  } catch (error) {
    console.error('❌ Failed to get demo token:', error.message)
    console.log('\n💡 Alternative: Get token manually:')
    console.log('   1. Open http://localhost:3000/demo in browser')
    console.log('   2. Press F12 → Console')
    console.log('   3. Run: localStorage.getItem("token")')
    console.log('   4. Copy token and run: TEST_TOKEN="your-token" node scripts/test-all-bots-tools.js\n')
    return null
  }
}

async function runTests(token) {
  const { spawn } = require('child_process')
  
  return new Promise((resolve) => {
    console.log('🧪 Running comprehensive tests...\n')
    
    const testProcess = spawn('node', ['scripts/test-all-bots-tools.js'], {
      env: { ...process.env, TEST_TOKEN: token, BASE_URL: BASE_URL },
      stdio: 'inherit'
    })
    
    testProcess.on('close', (code) => {
      resolve(code)
    })
  })
}

async function main() {
  console.log('🚀 CreatorFlow Auto Test Runner\n')
  console.log('=' .repeat(50) + '\n')
  
  // Check if server is running
  try {
    const healthCheck = await fetch(`${BASE_URL}/api/db/health`)
    if (!healthCheck.ok) {
      console.log('⚠️  Server might not be ready. Waiting 3 seconds...\n')
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
  } catch (error) {
    console.log('❌ Cannot connect to server!')
    console.log('   Please make sure the server is running: npm run dev\n')
    process.exit(1)
  }
  
  // Get token
  const token = await getDemoToken()
  if (!token) {
    process.exit(1)
  }
  
  // Run tests
  const exitCode = await runTests(token)
  process.exit(exitCode || 0)
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})

