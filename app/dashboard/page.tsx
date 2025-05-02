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
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between mb-12">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">Back to Home</span>
        </Link>
        <button
          onClick={handleProUpgrade}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white shadow-lg hover:shadow-xl transition-all"
        >
          <span className="font-semibold">Upgrade to Pro</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Global Mood Monitor
            </span>
            🌏
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track real-time sentiment analysis across global news. Add country codes below to
            monitor media sentiment.
          </p>
        </header>

        {/* Country Input Section */}
        <section className="mb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full max-w-md">
              <input
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Enter country code (e.g., US, FR)"
                className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors pr-24"
              />
              <button
                onClick={addCode}
                className="absolute right-2 top-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Country
              </button>
            </div>
            
            <div className="flex gap-2 items-center text-sm text-gray-500">
              <span>Supported codes:</span>
              <div className="flex gap-1.5 flex-wrap">
                {ALL_CODES.map(code => (
                  <span key={code} className="px-2 py-1 bg-gray-100 rounded-md">
                    {code}
                  </span>
                ))}
              </div>
            </div>

            {inputError && (
              <div className="flex items-center gap-2 text-red-500 mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
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
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      mainSentiment === 'positive'
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
                              className={`w-1.5 h-full rounded-full ${
                                article.sentiment === 'positive'
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

