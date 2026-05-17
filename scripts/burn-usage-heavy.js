#!/usr/bin/env node
/**
 * Heavy usage burn before quota reset — demo seed + all bots + signup smoke test.
 *   BASE_URL=https://www.creatorflow365.com npm run burn:heavy
 *
 * Demo capped? Run in Neon (production branch) then retry tomorrow:
 *   DELETE FROM ai_call_logs WHERE user_id = (SELECT id FROM users WHERE email = 'demo@creatorflow365.com');
 */

const { spawnSync } = require('child_process')

const BASE_URL = (process.env.BASE_URL || 'https://www.creatorflow365.com').replace(/\/$/, '')
const env = { ...process.env, BASE_URL }

function run(label, cmd, args) {
  console.log(`\n========== ${label} ==========\n`)
  const r = spawnSync(cmd, args, { env, stdio: 'inherit', shell: false })
  console.log(`\n--- ${label}: exit ${r.status} ---\n`)
  return r.status === 0
}

async function main() {
  console.log(`Heavy usage burn → ${BASE_URL}\n`)

  for (let i = 1; i <= 5; i++) {
    run(`seed:demo pass ${i}/5`, 'node', ['scripts/seed-demo-ai-library.js'])
  }

  for (let i = 1; i <= 3; i++) {
    run(`burn:demo pass ${i}/3`, 'node', ['scripts/burn-demo-usage.js'])
  }

  run('signup production check', 'node', ['scripts/signup-production-check.js'])

  run('test-all-bots (fresh signup domain)', 'node', ['scripts/test-all-bots-tools.js'])

  run('test-all-tools-comprehensive', 'node', ['scripts/test-all-tools-comprehensive.js'])

  console.log('\nHeavy burn finished.\n')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
