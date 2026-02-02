/**
 * Production Database Setup Script
 * Initializes all database tables in production
 * 
 * Usage: 
 *   node scripts/setup-production-db.js
 * 
 * Or set BASE_URL:
 *   BASE_URL=https://www.creatorflow365.com node scripts/setup-production-db.js
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://www.creatorflow365.com';

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
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
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function checkHealth() {
  console.log('🔍 Step 1: Checking database health...\n');
  const response = await makeRequest(`${BASE_URL}/api/db/health`);
  
  if (response.status === 200 && response.data.connected) {
    console.log('✅ Database is connected');
    console.log(`📊 Postgres Version: ${response.data.database?.postgresVersion || 'Unknown'}`);
    console.log(`🕐 Current Time: ${response.data.database?.currentTime || 'Unknown'}\n`);
    
    console.log('📋 Table Status:');
    Object.entries(response.data.tables || {}).forEach(([table, exists]) => {
      const icon = exists ? '✅' : '❌';
      console.log(`  ${icon} ${table}`);
    });
    
    if (response.data.tableErrors) {
      console.log('\n⚠️  Errors:');
      Object.entries(response.data.tableErrors).forEach(([table, error]) => {
        console.log(`  ${table}: ${error}`);
      });
    }
    
    return response.data;
  } else {
    console.log('❌ Database health check failed');
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, response.data);
    return null;
  }
}

async function initializeDatabase() {
  console.log('\n🚀 Step 2: Initializing database tables...\n');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/init-db`);
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Database initialization completed');
      console.log(`Message: ${response.data.message}\n`);
      return true;
    } else {
      console.log('❌ Database initialization failed');
      console.log(`Status: ${response.status}`);
      console.log(`Response:`, response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    return false;
  }
}

async function runSetup() {
  console.log('🚀 Step 3: Running complete setup...\n');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/db/setup`, {
      method: 'POST'
    });
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Complete setup finished');
      console.log(`Message: ${response.data.message}\n`);
      
      if (response.data.tables) {
        console.log('📋 Table Verification:');
        Object.entries(response.data.tables).forEach(([table, verified]) => {
          console.log(`  ${verified ? '✅' : '❌'} ${table}`);
        });
      }
      
      if (response.data.nextSteps) {
        console.log('\n📝 Next Steps:');
        response.data.nextSteps.forEach((step, i) => {
          console.log(`  ${i + 1}. ${step}`);
        });
      }
      
      return true;
    } else {
      console.log('⚠️  Setup completed with warnings');
      console.log(`Response:`, response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Error running setup:', error.message);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  CreatorFlow - Production Database Setup');
  console.log('═══════════════════════════════════════════════════════\n');
  console.log(`🌐 Base URL: ${BASE_URL}\n`);
  
  try {
    // Step 1: Check health
    const health = await checkHealth();
    
    if (!health) {
      console.log('\n❌ Cannot proceed - database connection failed');
      console.log('Please check:');
      console.log('1. DATABASE_URL or NEON_DATABASE_URL is set in Vercel');
      console.log('2. Neon database is active (not paused)');
      console.log('3. Network connectivity to Neon');
      process.exit(1);
    }
    
    // Step 2: Initialize if needed
    if (!health.allTablesExist) {
      console.log('\n⚠️  Some tables are missing. Initializing...\n');
      const initSuccess = await initializeDatabase();
      
      if (!initSuccess) {
        console.log('\n❌ Initialization failed. Please check logs above.');
        process.exit(1);
      }
      
      // Step 3: Run complete setup
      await runSetup();
      
      // Step 4: Verify again
      console.log('\n🔍 Step 4: Verifying final status...\n');
      const finalHealth = await checkHealth();
      
      if (finalHealth && finalHealth.allTablesExist) {
        console.log('\n✅ SUCCESS! Database is fully set up and ready.\n');
        process.exit(0);
      } else {
        console.log('\n⚠️  Setup completed but some issues remain.');
        console.log('Please review the status above.\n');
        process.exit(1);
      }
    } else {
      console.log('\n✅ All tables exist! Database is already set up.\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();

