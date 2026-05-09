#!/usr/bin/env node
/**
 * Print a paste-ready prompt for SEO meta A/B variants (local file read only — no network).
 *
 * Copy stdout → paste into Claude (or any assistant) in the browser yourself.
 * This script does not call any API and does not consume LLM usage on your behalf.
 *
 * Run:
 *   node scripts/claude-meta-variants.mjs --route=/ --variants=5
 *   npm run meta:prompt -- --route=/signup
 *
 * Seeds: scripts/meta-ab-seeds.json
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

function parseArgs() {
  const args = process.argv.slice(2)
  let route = '/'
  let variants = 4
  for (const a of args) {
    if (a.startsWith('--route=')) route = a.slice('--route='.length)
    if (a.startsWith('--variants='))
      variants = Math.min(12, Math.max(1, parseInt(a.slice('--variants='.length), 10) || 4))
  }
  return { route, variants }
}

function loadSeeds() {
  const raw = readFileSync(join(__dirname, 'meta-ab-seeds.json'), 'utf8')
  return JSON.parse(raw)
}

function buildPrompt(entry, route, variantCount) {
  return `You are an SEO copy assistant for CreatorFlow365 (creator workspace SaaS).

TASK: Write ${variantCount} alternate pairs of meta title + meta description for A/B testing (CTR in Google). Output MUST be valid JSON only — no markdown, no commentary.

RULES:
- Each title: ≤60 characters (count carefully; include spaces & punctuation).
- Each description: ≤155 characters.
- Include primary keyword intent for this URL naturally; one clear benefit; light CTA (e.g. trial, compare plans, start free).
- Brand: include "CreatorFlow365" in each title OR clearly in description if title is tight.
- Do not promise viral growth, guaranteed rankings, or fake review counts.
- Vary angle across variants (urgency, clarity, platform list, solo vs team, trial/no card).

URL path: ${route}
Page label: ${entry.label}
Notes from site owner: ${entry.notes || 'none'}

CURRENT (baseline — improve on, do not copy verbatim):
Title: ${entry.currentTitle}
Description: ${entry.currentDescription}

Return JSON shape exactly:
{"variants":[{"title":"...","description":"..."}, ...]}
`
}

function main() {
  const { route, variants } = parseArgs()
  const seeds = loadSeeds()
  const entry = seeds.routes[route]
  if (!entry) {
    console.error(`No seed for route "${route}". Add it to scripts/meta-ab-seeds.json`)
    process.exit(1)
  }
  console.log(buildPrompt(entry, route, variants))
}

main()
