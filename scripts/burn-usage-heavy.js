#!/usr/bin/env node
/**
 * Heavy usage burn before quota reset — demo seed + all bots + temp test users.
 *   BASE_URL=https://www.creatorflow365.com node scripts/burn-usage-heavy.js
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

  for (let i = 1; i <= 4; i++) {
    run(`test-all-bots pass ${i}/4`, 'node', ['scripts/test-all-bots-tools.js'])
  }

  run('test-all-tools-comprehensive', 'node', ['scripts/test-all-tools-comprehensive.js'])

  console.log('\nHeavy burn finished.\n')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
