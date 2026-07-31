import { canMakeAICall } from '@/lib/usageTracking'

export type AIProvider = 'groq' | 'grok' | 'openai'

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

  const model =
    options.model || process.env.GROQ_MODEL || 'llama-3.1-8b-instant'

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
  const configured: AIProvider[] = []
  if (isGroqConfigured()) configured.push('groq')
  if (isGrokConfigured()) configured.push('grok')
  if (isOpenAIConfigured()) configured.push('openai')

  if (configured.length === 0) return []

  const pref = process.env.AI_DEFAULT_PROVIDER || 'auto'
  if (pref === 'groq' && isGroqConfigured()) return ['groq']
  if (pref === 'grok' && isGrokConfigured()) return ['grok']
  if (pref === 'openai' && isOpenAIConfigured()) return ['openai']

  // auto: cheapest first — Groq, then Grok, then OpenAI
  const order: AIProvider[] = []
  if (isGroqConfigured()) order.push('groq')
  if (isGrokConfigured()) order.push('grok')
  if (isOpenAIConfigured()) order.push('openai')
  return order
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
