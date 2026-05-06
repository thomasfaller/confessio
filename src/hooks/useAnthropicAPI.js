import { useState } from 'react'

/**
 * @typedef {{ title: string, questions: string[] }} Category
 * @typedef {{ categories: Category[] }} ExaminationResponse
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'
const MODEL = 'claude-sonnet-4-20250514'
const MAX_TOKENS = 1500

// ⚠️  SECURITY WARNING
// Reading the key from VITE_* env means it is INLINED into the public JS bundle.
// Anyone visiting the deployed site can extract it from the bundle.
// Before going to production, move this fetch to a server-side endpoint
// (Cloudflare Workers / Netlify Functions / Vercel Edge Functions) and
// have the browser POST to your endpoint instead. See README "Roadmap".
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || ''

/**
 * Hook that calls Claude with a prompt and parses the JSON response.
 *
 * @returns {{
 *   callClaude: (prompt: string) => Promise<ExaminationResponse | null>,
 *   loading: boolean,
 *   error: string | null,
 * }}
 */
export function useAnthropicAPI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  async function callClaude(prompt) {
    if (!API_KEY) {
      const message =
        'No Anthropic API key configured. Add VITE_ANTHROPIC_API_KEY to your .env file (see .env.example).'
      setError(message)
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': ANTHROPIC_VERSION,
          // Required for direct browser fetches; otherwise the request is
          // rejected with a CORS-style error from the Anthropic API.
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(`API error ${response.status}${text ? `: ${text.slice(0, 200)}` : ''}`)
      }

      const data = await response.json()
      const text = (data.content || []).map(b => b.text || '').join('')
      const clean = text.replace(/```json|```/g, '').trim()
      return JSON.parse(clean)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { callClaude, loading, error }
}
