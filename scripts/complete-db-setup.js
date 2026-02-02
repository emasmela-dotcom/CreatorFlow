/**
 * Complete Database Setup - Keeps trying until deployment is ready
 * This script will wait for Vercel deployment and then initialize the database
 * 
 * Usage: node scripts/complete-db-setup.js
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.BASE_URL || 'https://www.creatorflow365.com';
const MAX_ATTEMPTS = 30; // 5 minutes total
const DELAY_BETWEEN_ATTEMPTS = 10000; // 10 seconds

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: 15000
    };
    
    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function waitForDeployment() {
  console.log('⏳ Waiting for Vercel deployment to complete...\n');
  
  for (let i = 1; i <= MAX_ATTEMPTS; i++) {
    try {
      const response = await makeRequest(`${BASE_URL}/api/init-db`);
      
      if (response.status === 200) {
        console.log('✅ Deployment complete! Endpoints are live.\n');
        return true;
      }
      
      if (response.status !== 404 && response.status !== 308) {
        console.log(`✅ Endpoint responded (status: ${response.status})`);
        return true;
      }
    } catch (error) {
      // Continue trying
    }
    
    if (i < MAX_ATTEMPTS) {
      process.stdout.write(`\r⏳ Attempt ${i}/${MAX_ATTEMPTS} - Still deploying... (waiting ${DELAY_BETWEEN_ATTEMPTS/1000}s)`);
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_ATTEMPTS));
    }
  }
  
  return false;
}

async function initializeDatabase() {
  console.log('🚀 Initializing production database...\n');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/init-db`);
    
    if (response.status === 200 && response.data && response.data.success) {
      console.log('✅ Database initialized successfully!');
      console.log(`   Message: ${response.data.message}\n`);
      return true;
    } else {
      console.log('⚠️  Initialization response:', response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    return false;
  }
}

async function checkHealth() {
  console.log('🔍 Verifying database health...\n');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/db/health`);
    
    if (response.status === 200 && response.data) {
      if (response.data.connected) {
        console.log('✅ Database is connected');
        console.log(`   Status: ${response.data.status}`);
        console.log(`   Postgres: ${response.data.database?.postgresVersion || 'Unknown'}\n`);
        
        if (response.data.tables) {
          console.log('📋 Table Status:');
          Object.entries(response.data.tables).forEach(([table, exists]) => {
            console.log(`   ${exists ? '✅' : '❌'} ${table}`);
          });
          console.log();
          
          if (response.data.allTablesExist) {
            console.log('✅ ALL TABLES EXIST! Database setup is COMPLETE!\n');
            return true;
          } else {
            console.log('⚠️  Some tables are missing. Re-initializing...\n');
            return false;
          }
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  CreatorFlow - Complete Database Setup');
  console.log('═══════════════════════════════════════════════════════\n');
  console.log(`🌐 Base URL: ${BASE_URL}\n`);
  
  // Step 1: Wait for deployment
  const deployed = await waitForDeployment();
  
  if (!deployed) {
    console.log('\n❌ Deployment is taking longer than expected.');
    console.log('   Please check Vercel dashboard for build status.');
    console.log('   Once deployment is complete, run this script again.\n');
    process.exit(1);
  }
  
  // Step 2: Initialize database
  const initialized = await initializeDatabase();
  
  if (!initialized) {
    console.log('⚠️  Initialization may have failed. Checking health...\n');
  }
  
  // Step 3: Verify health
  let healthy = await checkHealth();
  
  // If not healthy, try one more initialization
  if (!healthy) {
    console.log('🔄 Retrying initialization...\n');
    await initializeDatabase();
    await new Promise(resolve => setTimeout(resolve, 3000));
    healthy = await checkHealth();
  }
  
  if (healthy) {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  ✅ DATABASE SETUP COMPLETE!');
    console.log('═══════════════════════════════════════════════════════\n');
    process.exit(0);
  } else {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  ⚠️  SETUP COMPLETED WITH WARNINGS');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('Please check:');
    console.log('1. DATABASE_URL is set in Vercel environment variables');
    console.log('2. Neon database is active (not paused)');
    console.log('3. Vercel function logs for errors\n');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

