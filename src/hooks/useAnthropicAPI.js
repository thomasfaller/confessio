import { useState } from 'react'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

// TODO: Move this to a serverless function (Cloudflare Workers / Netlify Functions)
// to avoid exposing the key in the client bundle.
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || ''

export function useAnthropicAPI() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function callClaude(prompt) {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      if (!response.ok) throw new Error(`API error ${response.status}`)

      const data  = await response.json()
      const text  = data.content.map(b => b.text || '').join('')
      const clean = text.replace(/```json|```/g, '').trim()
      return JSON.parse(clean)
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { callClaude, loading, error }
}
