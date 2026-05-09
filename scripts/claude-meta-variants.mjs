#!/usr/bin/env node
/**
 * Fetch SEO title/description A/B variants from Claude (Anthropic Messages API).
 *
 * Uses usage / billing on your Anthropic account — run only when you consent.
 *
 * Setup:
 *   export ANTHROPIC_API_KEY="sk-ant-api03-..."
 * Optional:
 *   export ANTHROPIC_MODEL="claude-sonnet-4-20250514"
 *
 * Run:
 *   node scripts/claude-meta-variants.mjs --route=/
 *   node scripts/claude-meta-variants.mjs --route=/signup --variants=5
 *
 * Output: JSON array printed to stdout (paste into a doc or wire into CMS).
 *
 * Seeds: edit scripts/meta-ab-seeds.json when live copy changes.
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
    if (a.startsWith('--variants=')) variants = Math.min(12, Math.max(1, parseInt(a.slice('--variants='.length), 10) || 4))
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

async function main() {
  const { route, variants } = parseArgs()
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('Missing ANTHROPIC_API_KEY. Export it and run again.')
    process.exit(1)
  }

  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514'
  const seeds = loadSeeds()
  const entry = seeds.routes[route]
  if (!entry) {
    console.error(`No seed for route "${route}". Add it to scripts/meta-ab-seeds.json`)
    process.exit(1)
  }

  const prompt = buildPrompt(entry, route, variants)

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.error('Anthropic API error:', res.status, JSON.stringify(body, null, 2))
    process.exit(1)
  }

  const text = body?.content?.map((b) => (b.type === 'text' ? b.text : '')).join('') || ''
  let trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) trimmed = fenced[1].trim()
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start === -1 || end <= start) {
    console.error('No JSON object in model response. Raw:\n', text)
    process.exit(1)
  }
  trimmed = trimmed.slice(start, end + 1)
  try {
    JSON.parse(trimmed)
  } catch {
    console.error('Invalid JSON from model. Extracted:\n', trimmed)
    process.exit(1)
  }
  console.log(trimmed)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
