// app/page.tsx (or pages/dashboard.tsx)
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

type ArticleWithSentiment = {
  title: string
  description: string | null
  url: string
  sentiment: 'positive' | 'neutral' | 'negative'
}

type CountryMood = {
  country: string
  articles: ArticleWithSentiment[]
}

const ALL_CODES = ['US', 'TH', 'JP', 'GB', 'DE', 'CA', 'FR', 'IT', 'ES', 'AU'] as const

export default function DashboardPage() {
  const [data, setData] = useState<CountryMood[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])
  const [inputCode, setInputCode] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedCodes.length) {
      setData([])
      return
    }
    setLoading(true)
    setError(null)
    Promise.all(
      selectedCodes.map(code =>
        fetch(`/api/mood?country=${code}`)
          .then(r => (r.ok ? r.json() : Promise.reject()))
          .then((arr: ArticleWithSentiment[]) => ({ country: code, articles: arr }))
          .catch(() => ({ country: code, articles: [] }))
      )
    )
      .then(setData)
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }, [selectedCodes])

  const addCode = () => {
    const code = inputCode.trim().toUpperCase()
    if (!code) return
    if (!ALL_CODES.includes(code as any)) {
      setInputError(`"${code}" invalid`)
    } else if (selectedCodes.includes(code)) {
      setInputError(`"${code}" already added`)
    } else {
      setSelectedCodes([...selectedCodes, code])
      setInputError(null)
    }
    setInputCode('')
  }

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCode()
    }
  }

  const removeCode = (code: string) =>
    setSelectedCodes(selectedCodes.filter(c => c !== code))

  const handleProUpgrade = () => {
    // redirect to your pricing or upgrade page
    window.open('/pricing', '_blank')
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 to-blue-100 text-black">
      {/* Top bar with Back link and Upgrade button */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="font-bold text-lg hover:underline">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-center flex-1">🌍 Mood Dashboard</h1>
        <button
          onClick={handleProUpgrade}
          className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          Upgrade to Pro
        </button>
      </div>

      {/* Input & Add */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <div className="flex gap-2">
          <input
            value={inputCode}
            onChange={e => setInputCode(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Country code"
            className="p-2 border rounded-l-md w-40"
          />
          <button
            onClick={addCode}
            className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        {inputError && <p className="text-red-600 self-center">{inputError}</p>}
      </div>

      {/* Selected codes pills */}
      {selectedCodes.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {selectedCodes.map(code => (
            <span
              key={code}
              className="px-3 py-1 bg-gray-200 rounded-full flex items-center"
            >
              {code}
              <button
                onClick={() => removeCode(code)}
                className="ml-2 text-gray-600 hover:text-red-600"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Loading / Error */}
      {loading && <p className="text-center">Loading…</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* Country cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          data.map((item, i) => {
            const mainSentiment = item.articles.some(a => a.sentiment === 'positive')
              ? 'Positive'
              : item.articles.some(a => a.sentiment === 'negative')
                ? 'Negative'
                : 'Neutral'

            return (
              <motion.div
                key={item.country}
                className="rounded-2xl p-6 border shadow bg-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-bold">{item.country}</h2>
                  <div className="text-right">
                    <p className="font-semibold">Sentiment:</p>
                    <p className="text-lg">{mainSentiment}</p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Map placeholder */}
                  <div className="flex-1 border flex items-center justify-center h-48 rounded-lg">
                    <p className="text-center text-gray-500">country’s map</p>
                  </div>

                  {/* Related news */}
                  <div className="flex-1">
                    <p className="font-semibold mb-2">Related news:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {item.articles.slice(0, 6).map((a, j) => (
                        <a
                          key={j}
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border p-2 rounded hover:bg-gray-100 text-sm"
                        >
                          {a.title}
                        </a>
                      ))}
                      {item.articles.length === 0 && (
                        <p className="italic text-gray-500 col-span-2">No articles</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
      </div>
    </div>
  )
}
