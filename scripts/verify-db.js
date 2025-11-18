/**
 * Database Verification Script
 * Run this to verify your database is set up correctly
 * 
 * Usage: node scripts/verify-db.js
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function checkHealth() {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}/api/db/health`);
    const client = url.protocol === 'https:' ? https : http;
    
    client.get(url.toString(), (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    }).on('error', reject);
  });
}

async function setupDatabase() {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}/api/db/setup`);
    const client = url.protocol === 'https:' ? https : http;
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = client.request(url.toString(), options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('🔍 Checking database health...\n');
  
  try {
    const health = await checkHealth();
    
    if (health.connected) {
      console.log('✅ Database is connected');
      console.log(`📊 Postgres Version: ${health.database?.postgresVersion || 'Unknown'}`);
      console.log(`🕐 Current Time: ${health.database?.currentTime || 'Unknown'}\n`);
      
      console.log('📋 Table Status:');
      Object.entries(health.tables || {}).forEach(([table, exists]) => {
        console.log(`  ${exists ? '✅' : '❌'} ${table}`);
      });
      
      if (health.allTablesExist) {
        console.log('\n✅ All tables exist! Database is ready.');
      } else {
        console.log('\n⚠️  Some tables are missing. Running setup...\n');
        const setup = await setupDatabase();
        
        if (setup.success) {
          console.log('✅ Database setup completed!');
        } else {
          console.log('❌ Setup failed:', setup.error);
        }
      }
    } else {
      console.log('❌ Database is not connected');
      console.log(`Error: ${health.message}`);
      console.log('\nTroubleshooting:');
      console.log('1. Check DATABASE_URL or NEON_DATABASE_URL is set');
      console.log('2. Verify Neon database is active');
      console.log('3. Check network connectivity');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nMake sure:');
    console.log('1. The app is running (npm run dev)');
    console.log('2. BASE_URL is correct (or set NEXT_PUBLIC_APP_URL)');
  }
}

main();

