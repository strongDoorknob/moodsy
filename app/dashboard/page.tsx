'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

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
          .then(r => r.ok ? r.json() : Promise.reject())
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

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 to-blue-100 text-black">
      <h1 className="text-3xl font-bold text-center mb-6">🌍 Mood Dashboard</h1>

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
        {inputError && <p className="text-red-600">{inputError}</p>}
      </div>

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

      {loading && <p className="text-center">Loading…</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          data.map((item, i) => (
            <motion.div
              key={item.country}
              className="rounded-2xl p-5 border shadow bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <h2 className="text-xl font-semibold mb-3">{item.country}</h2>
              <ul className="space-y-3">
                {item.articles.map((a, j) => (
                  <li key={j} className="p-3 border rounded-lg">
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block font-medium hover:underline"
                    >
                      {a.title}
                    </a>
                    <p className="text-sm mt-1 capitalize">
                      Sentiment: <strong>{a.sentiment}</strong>
                    </p>
                  </li>
                ))}
                {!item.articles.length && (
                  <p className="text-sm italic text-gray-500">No articles</p>
                )}
              </ul>
            </motion.div>
          ))}
      </div>
    </div>
  )
}
