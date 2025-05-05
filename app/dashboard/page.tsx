// app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

const ALL_CODES = ['US', 'TH', 'JP', 'GB', 'DE', 'CA', 'FR', 'IT', 'ES', 'AU', 'RU', 'IN'] as const

export default function DashboardPage() {
  const [data, setData] = useState<CountryMood[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])
  const [inputCode, setInputCode] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)
  const [fetchCount, setFetchCount] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const router = useRouter()

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
      const newCount = fetchCount + 1
      setFetchCount(newCount)
      if (newCount >= 10) {
        setShowPopup(true)
        return
      }
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
    router.push('/pro')
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-blue-50 text-black font-sans">
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Limit Reached</h2>
            <p className="mb-6">You've reached your limit of 10 mood data fetches. Unlock unlimited access with Pro edition.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleProUpgrade}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Go Pro
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Global Mood Monitor
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track real-time sentiment analysis across global news. Add country codes below to monitor media sentiment.
          </p>
        </header>

        <section className="mb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full max-w-md">
              <input
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Enter country code (e.g., US, FR)"
                className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors pr-24"
                disabled={fetchCount >= 10}
              />
              <button
                onClick={addCode}
                className={`absolute right-2 top-2 px-6 py-2 rounded-lg transition-colors ${
                  fetchCount >= 10
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                disabled={fetchCount >= 10}
              >
                Add Country
              </button>
            </div>

            <div className="flex gap-2 items-center text-sm text-gray-500">
              <span>Supported codes:</span>
              <div className="flex gap-1.5 flex-wrap">
                {ALL_CODES.map(code => (
                  <span key={code} className="px-2 py-1 bg-gray-100 rounded-md">{code}</span>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-600 mt-2">
              Countries added: <span className={fetchCount >= 10 ? 'text-red-600 font-bold' : 'font-semibold'}>{fetchCount}</span>/10
            </div>

            {inputError && (
              <div className="flex items-center gap-2 text-red-500 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {inputError}
              </div>
            )}
          </div>
        </section>


        {/* Selected Countries */}
        {selectedCodes.length > 0 && (
          <section className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {selectedCodes.map(code => (
                <motion.div
                  key={code}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-full flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="font-medium">{code}</span>
                  <button
                    onClick={() => removeCode(code)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove country"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center gap-3 text-gray-500 py-12">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Analyzing global sentiment...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center text-red-600 max-w-2xl mx-auto my-8">
            {error}
          </div>
        )}

        {/* Country Cards Grid */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item, i) => {
            const sentimentCounts = item.articles.reduce(
              (acc, article) => {
                acc[article.sentiment] += 1
                return acc
              },
              { positive: 0, neutral: 0, negative: 0 }
            )

            const mainSentiment = Object.entries(sentimentCounts).reduce(
              (a, b) => (b[1] > a[1] ? b : a),
              ['neutral', 0]
            )[0]

            return (
              <motion.article
                key={item.country}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <header className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {item.country}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{item.articles.length} articles analyzed</span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${mainSentiment === 'positive'
                        ? 'bg-green-100 text-green-800'
                        : mainSentiment === 'negative'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {mainSentiment.charAt(0).toUpperCase() + mainSentiment.slice(1)}
                  </span>
                </header>

                <div className="space-y-6">
                  {/* Sentiment Meter */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Positive</span>
                      <span>Negative</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                        style={{
                          width: `${(sentimentCounts.positive / item.articles.length) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{sentimentCounts.positive}</span>
                      <span>{sentimentCounts.negative}</span>
                    </div>
                  </div>

                  {/* News Articles */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Trending News
                    </h3>
                    <div className="space-y-3">
                      {item.articles.slice(0, 3).map((article, j) => (
                        <a
                          key={j}
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-1.5 h-full rounded-full ${article.sentiment === 'positive'
                                  ? 'bg-green-500'
                                  : article.sentiment === 'negative'
                                    ? 'bg-red-500'
                                    : 'bg-gray-400'
                                }`}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                {article.title}
                              </p>
                              {article.description && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                  {article.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </section>
      </main>
    </div>
  )
}

