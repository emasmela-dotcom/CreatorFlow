import { canMakeAICall } from '@/lib/usageTracking'
import { FREE_BUILD_PHASE } from '@/lib/aiUsagePolicy'

export type AIProvider = 'groq' | 'grok' | 'openai' | 'claude'

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface CallLLMOptions {
  messages: LLMMessage[]
  userId: string
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
}

export interface LLMSuccessResult {
  ok: true
  text: string
  provider: AIProvider
}

export interface LLMErrorResult {
  ok: false
  error: string
  code: 'NOT_CONFIGURED' | 'PROVIDER_ERROR' | 'USAGE_LIMIT'
}

export type CallLLMResult = LLMSuccessResult | LLMErrorResult

export function isGroqConfigured(): boolean {
  return !!process.env.GROQ_API_KEY
}

export function isGrokConfigured(): boolean {
  return !!process.env.XAI_API_KEY
}

export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY
}

export function isAnyAIConfigured(): boolean {
  return isGroqConfigured() || isGrokConfigured() || isOpenAIConfigured()
}

export function getAIStatus(): {
  groq: boolean
  grok: boolean
  openai: boolean
  ready: boolean
  message: string
} {
  const groq = isGroqConfigured()
  const grok = isGrokConfigured()
  const openai = isOpenAIConfigured()
  const ready = groq || grok || openai

  let message: string
  if (!ready) {
    message =
      'AI is not set up yet. Add GROQ_API_KEY, XAI_API_KEY, or OPENAI_API_KEY when ready.'
  } else {
    const names: string[] = []
    if (groq) names.push('Groq')
    if (grok) names.push('Grok (xAI)')
    if (openai) names.push('OpenAI')
    message = `Configured: ${names.join(', ')}.`
  }

  return { groq, grok, openai, ready, message }
}

async function callGroq(options: CallLLMOptions): Promise<CallLLMResult> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return {
      ok: false,
      code: 'NOT_CONFIGURED',
      error: 'Groq API key is not configured.',
    }
  }

  const requested =
    options.model || process.env.GROQ_MODEL || 'openai/gpt-oss-20b'
  const model =
    requested === 'llama-3.1-8b-instant' ? 'openai/gpt-oss-20b' : requested

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000)

  try {
    const res = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: options.messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens,
          top_p: options.topP,
        }),
        signal: controller.signal,
      }
    )

    clearTimeout(timeoutId)

    if (!res.ok) {
      const body = await res.text()
      return {
        ok: false,
        code: 'PROVIDER_ERROR',
        error: `Groq API error (${res.status}): ${body}`,
      }
    }

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content
    if (!text || typeof text !== 'string') {
      return {
        ok: false,
        code: 'PROVIDER_ERROR',
        error: 'Groq returned an empty or malformed response.',
      }
    }

    return { ok: true, text, provider: 'groq' }
  } catch (err: any) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      return {
        ok: false,
        code: 'PROVIDER_ERROR',
        error: 'Groq request timed out after 30 seconds.',
      }
    }
    return {
      ok: false,
      code: 'PROVIDER_ERROR',
      error: err.message || 'Unknown Groq error.',
    }
  }
}

async function callGrok(options: CallLLMOptions): Promise<CallLLMResult> {
  const apiKey = process.env.XAI_API_KEY
  if (!apiKey) {
    return {
      ok: false,
      code: 'NOT_CONFIGURED',
      error: 'Grok (xAI) API key is not configured.',
    }
  }

  const model =
    options.model || process.env.XAI_MODEL || 'grok-4-1-fast-non-reasoning'

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000)

  try {
    const res = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: options.messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens,
        top_p: options.topP,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      const body = await res.text()
      return {
        ok: false,
        code: 'PROVIDER_ERROR',
        error: `Grok (xAI) API error (${res.status}): ${body}`,
      }
    }

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content
    if (!text || typeof text !== 'string') {
      return {
        ok: false,
        code: 'PROVIDER_ERROR',
        error: 'Grok returned an empty or malformed response.',
      }
    }

    return { ok: true, text, provider: 'grok' }
  } catch (err: any) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      return {
        ok: false,
        code: 'PROVIDER_ERROR',
        error: 'Grok request timed out after 30 seconds.',
      }
    }
    return {
      ok: false,
      code: 'PROVIDER_ERROR',
      error: err.message || 'Unknown Grok error.',
    }
  }
}

async function callOpenAI(options: CallLLMOptions): Promise<CallLLMResult> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return {
      ok: false,
      code: 'NOT_CONFIGURED',
      error: 'OpenAI API key is not configured.',
    }
  }

  const model =
    options.model || process.env.OPENAI_MODEL || 'gpt-4o-mini'

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000)

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: options.messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens,
        top_p: options.topP,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      const body = await res.text()
      return {
        ok: false,
        code: 'PROVIDER_ERROR',
        error: `OpenAI API error (${res.status}): ${body}`,
      }
    }

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content
    if (!text || typeof text !== 'string') {
      return {
        ok: false,
        code: 'PROVIDER_ERROR',
        error: 'OpenAI returned an empty or malformed response.',
      }
    }

    return { ok: true, text, provider: 'openai' }
  } catch (err: any) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      return {
        ok: false,
        code: 'PROVIDER_ERROR',
        error: 'OpenAI request timed out after 30 seconds.',
      }
    }
    return {
      ok: false,
      code: 'PROVIDER_ERROR',
      error: err.message || 'Unknown OpenAI error.',
    }
  }
}

function getProviderOrder(): AIProvider[] {
  // Free build: Groq only when available — ignore AI_DEFAULT_PROVIDER so a
  // leftover openai setting cannot burn a paid/exhausted key.
  if (FREE_BUILD_PHASE && isGroqConfigured()) {
    return ['groq']
  }

  const cheapFirst: AIProvider[] = []
  if (isGroqConfigured()) cheapFirst.push('groq')
  if (isGrokConfigured()) cheapFirst.push('grok')
  if (isOpenAIConfigured()) cheapFirst.push('openai')
  if (cheapFirst.length === 0) return []

  const pref = (process.env.AI_DEFAULT_PROVIDER || 'auto').toLowerCase()
  if (pref === 'auto' || !cheapFirst.includes(pref as AIProvider)) {
    return cheapFirst
  }

  // Preferred first, then the rest as fallback (do not lock to one provider).
  return [pref as AIProvider, ...cheapFirst.filter((p) => p !== pref)]
}

async function callProvider(
  provider: AIProvider,
  options: CallLLMOptions
): Promise<CallLLMResult> {
  if (provider === 'groq') return callGroq(options)
  if (provider === 'grok') return callGrok(options)
  return callOpenAI(options)
}

export async function callLLM(
  options: CallLLMOptions
): Promise<CallLLMResult> {
  if (!isAnyAIConfigured()) {
    return {
      ok: false,
      code: 'NOT_CONFIGURED',
      error:
        'AI is not set up yet. Add GROQ_API_KEY, XAI_API_KEY, or OPENAI_API_KEY when ready.',
    }
  }

  try {
    const limitCheck = await canMakeAICall(options.userId)
    if (!limitCheck.allowed) {
      return {
        ok: false,
        code: 'USAGE_LIMIT',
        error: limitCheck.message || 'Usage limit reached. Please upgrade your plan.',
      }
    }
  } catch (_err) {
    return {
      ok: false,
      code: 'PROVIDER_ERROR',
      error: 'Unable to verify usage limits.',
    }
  }

  const order = getProviderOrder()
  let lastError: CallLLMResult | null = null

  for (const provider of order) {
    const result = await callProvider(provider, options)
    if (result.ok) return result
    if (result.code === 'NOT_CONFIGURED') return result
    lastError = result
  }

  return (
    lastError ?? {
      ok: false,
      code: 'PROVIDER_ERROR',
      error: 'All configured AI providers failed.',
    }
  )
}

export function isClaudeConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY
}

export async function callClaude(options: CallLLMOptions): Promise<CallLLMResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return {
      ok: false,
      code: 'NOT_CONFIGURED',
      error: 'Claude is not set up yet. Add credits when you are able.',
    }
  }

  const model = options.model || process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929'
  const system = options.messages.find((m) => m.role === 'system')?.content
  const messages = options.messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 60000)

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: options.maxTokens ?? 1024,
        temperature: options.temperature ?? 0.7,
        ...(system ? { system } : {}),
        messages,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      const body = await res.text()
      return {
        ok: false,
        code: 'PROVIDER_ERROR',
        error: `Claude error (${res.status}): ${body}`,
      }
    }

    const data = await res.json()
    const text = Array.isArray(data.content)
      ? data.content
          .filter((part: { type?: string; text?: string }) => part.type === 'text' && part.text)
          .map((part: { text: string }) => part.text)
          .join('\n')
      : ''
    if (!text) {
      return {
        ok: false,
        code: 'PROVIDER_ERROR',
        error: 'Claude returned an empty reply.',
      }
    }

    return { ok: true, text, provider: 'claude' }
  } catch (err: unknown) {
    clearTimeout(timeoutId)
    if (err instanceof Error && err.name === 'AbortError') {
      return {
        ok: false,
        code: 'PROVIDER_ERROR',
        error: 'Claude timed out.',
      }
    }
    const message = err instanceof Error ? err.message : 'Unknown Claude error.'
    return {
      ok: false,
      code: 'PROVIDER_ERROR',
      error: message,
    }
  }
}
