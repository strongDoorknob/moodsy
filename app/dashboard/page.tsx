'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

type ArticleWithSentiment = {
  title: string
  description: string | null
  url: string
  sentiment: 'positive' | 'neutral' | 'negative'
  imageUrl?: string | null
  publishedAt?: string
}

type CountryMood = {
  country: string
  articles: ArticleWithSentiment[]
}

const ALL_CODES = ['US', 'TH', 'JP', 'GB', 'DE', 'CA', 'FR', 'IT', 'ES', 'AU', 'RU', 'IN'] as const

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://moodsy-backend.onrender.com'

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

  const addCode = () => {
    const code = inputCode.trim().toUpperCase()
    if (!code) return

    if (!ALL_CODES.includes(code as any)) {
      setInputError(`"${code}" invalid`)
    } else if (selectedCodes.includes(code)) {
      setInputError(`"${code}" already added`)
    } else {
      const newCount = fetchCount + 1
      if (newCount >= 10) {
        setShowPopup(true)
        return
      }

      setLoading(true)
      setError(null) // Clear any previous errors
      
      // เรียก API endpoint ที่มีอยู่แล้ว
      fetch(`${API_BASE_URL}/api/sentiment/?country=${code.toLowerCase()}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          return response.json()
        })
        .then(data => {
          // แก้ไขการจัดการ response ให้เข้ากับรูปแบบที่ backend ส่งกลับมา
          let articles: ArticleWithSentiment[] = []
          
          // ตรวจสอบว่า response เป็นรูปแบบใด
          if (Array.isArray(data)) {
            // กรณีที่ backend ส่งข้อมูลมาเป็น array โดยตรง
            articles = data
          } else if (data.results && Array.isArray(data.results)) {
            // กรณีที่ backend ส่งข้อมูลมาในรูปแบบ { status, totalResults, results }
            articles = data.results
          } else if (data.error) {
            throw new Error(data.error)
          } else {
            throw new Error('Invalid API response format')
          }
          
          // เพิ่มข้อมูลประเทศใหม่เข้าไปใน state
          setData(prev => [...prev, { country: code, articles }])
          setSelectedCodes(prev => [...prev, code])
          setFetchCount(newCount)
          setInputError(null)
        })
        .catch((err) => {
          console.error('Fetch error:', err)
          setError(`Failed to fetch data for ${code}: ${err.message}`)
        })
        .finally(() => setLoading(false))
    }

    setInputCode('')
  }

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCode()
    }
  }

  const removeCode = (code: string) => {
    setSelectedCodes(selectedCodes.filter(c => c !== code))
    setData(data.filter(d => d.country !== code))
    setFetchCount(fetchCount - 1)
  }

  const handleProUpgrade = () => {
    router.push('/pro')
  }

  return (
    <div className="min-h-screen p-8 bg-[#FFF7F3] text-[#C599B6] font-pixel">
      {showPopup && (
        <div className="fixed inset-0 bg-[#C599B6]/80 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#FFF7F3] border-4 border-[#C599B6] p-6 shadow-[8px_8px_0_#C599B6] w-[90%] max-w-md text-center relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-[#C599B6] hover:text-[#E6B2BA] text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 border-b-4 border-[#C599B6] pb-2">LIMIT REACHED</h2>
            <p className="mb-4 text-[#E6B2BA]">
              FREE TIER MAXED! UNLOCK PRO FOR UNLIMITED ACCESS
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 border-2 border-[#C599B6] hover:bg-[#C599B6]/10"
              >
                LATER
              </button>
              <button
                onClick={handleProUpgrade}
                className="px-4 py-2 bg-[#C599B6] text-[#FFF7F3] hover:bg-[#E6B2BA] border-2 border-[#C599B6]"
              >
                GO PRO ▲
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 border-4 border-[#C599B6] p-4 bg-[#FFF7F3] shadow-[8px_8px_0_#C599B6]">
            GLOBAL MOOD QUEST
          </h1>
          <p className="text-[#E6B2BA] max-w-2xl mx-auto border-2 border-[#C599B6] p-3 bg-[#FFF7F3]">
            TRACK SENTIMENT ACROSS REALMS
          </p>
        </header>

        <section className="mb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full max-w-md">
              <input
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="ENTER REALM CODE"
                className="w-full px-6 py-3 border-4 border-[#C599B6] bg-[#FFF7F3] font-pixel placeholder-[#C599B6]/60 pr-24 focus:outline-none focus:border-[#E6B2BA]"
                disabled={fetchCount >= 10}
              />
              <button
                onClick={addCode}
                className={`absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 text-sm rounded-md font-bold transition-all duration-200 
                  ${fetchCount >= 10
                    ? 'bg-[#FAD0C4] text-[#FFF7F3] border-2 border-[#E6B2BA] cursor-not-allowed'
                    : 'bg-[#C599B6] text-white border-2 border-[#C599B6] hover:bg-[#E6B2BA]'
                  }`}
                disabled={fetchCount >= 10}
              >
                + ADD REALM
              </button>
            </div>

            <div className="flex gap-2 items-center text-sm text-[#C599B6]">
              <span>VALID REALMS:</span>
              <div className="flex gap-1.5 flex-wrap">
                {ALL_CODES.map(code => (
                  <span key={code} className="px-2 py-1 bg-[#FFF7F3] border-2 border-[#C599B6]">
                    {code}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-sm text-[#C599B6] mt-2">
              REALMS ADDED: <span className={fetchCount >= 10 ? 'text-[#E6B2BA] font-bold' : 'font-bold'}>{fetchCount}</span>/10
            </div>

            {inputError && (
              <div className="flex items-center gap-2 text-[#E6B2BA] mt-2">
                ⚠️ {inputError}
              </div>
            )}
          </div>
        </section>

        {selectedCodes.length > 0 && (
          <section className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {selectedCodes.map(code => (
                <motion.div
                  key={code}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-4 py-2 bg-[#FFF7F3] border-4 border-[#C599B6] flex items-center gap-2 shadow-[4px_4px_0_#C599B6] hover:shadow-[6px_6px_0_#C599B6]"
                >
                  <span className="font-bold">{code}</span>
                  <button
                    onClick={() => removeCode(code)}
                    className="text-[#C599B6] hover:text-[#E6B2BA]"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {loading && (
          <div className="flex justify-center items-center gap-3 text-[#C599B6] py-12">
            <span>SCANNING REALMS...</span>
          </div>
        )}

        {error && (
          <div className="bg-[#E6B2BA] border-4 border-[#C599B6] p-4 text-center text-[#FFF7F3] max-w-2xl mx-auto my-8">
            ⚠️ {error}
          </div>
        )}

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
                className={`relative p-6 border-4 bg-[#FFF7F3] shadow-[8px_8px_0_#C599B6] hover:shadow-[12px_12px_0_#C599B6]
                  ${mainSentiment === 'positive' ? 'border-[#C599B6]' :
                    mainSentiment === 'negative' ? 'border-[#E6B2BA]' : 'border-[#FAD0C4]'}`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 border-4 ${mainSentiment === 'positive' ? 'border-[#C599B6] bg-[#FFF7F3]' :
                      mainSentiment === 'negative' ? 'border-[#E6B2BA] bg-[#FFF7F3]' :
                        'border-[#FAD0C4] bg-[#FFF7F3]'} flex items-center justify-center`}>
                    <span className="text-2xl font-bold">{item.country}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#C599B6]">
                      {new Intl.DisplayNames(['en'], { type: 'region' }).of(item.country)}
                    </h2>
                    <p className="text-[#E6B2BA]">
                      {item.articles.length} ARTICLES ANALYZED
                    </p>
                  </div>
                </div>

                <div className={`absolute top-4 right-[-24px] px-8 py-1 rotate-45 transform origin-center 
                  ${mainSentiment === 'positive' ? 'bg-[#C599B6]' :
                    mainSentiment === 'negative' ? 'bg-[#E6B2BA]' : 'bg-[#FAD0C4]'}
                  text-white text-xs font-bold shadow-md`}>
                  {mainSentiment}
                </div>

                <div className="mb-6">
                  <div className="flex justify-between mb-2 text-sm font-bold text-[#C599B6]">
                    <span className="text-[#C599B6]">POS {sentimentCounts.positive}</span>
                    <span className="text-[#FAD0C4]">NEU {sentimentCounts.neutral}</span>
                    <span className="text-[#E6B2BA]">NEG {sentimentCounts.negative}</span>
                  </div>
                  <div className="h-3 bg-[#FAD0C4] rounded-full overflow-hidden">
                    <div className="flex h-full">
                      <div
                        className="bg-[#C599B6]"
                        style={{ width: `${(sentimentCounts.positive / item.articles.length) * 100}%` }}
                      />
                      <div
                        className="bg-[#FAD0C4]"
                        style={{ width: `${(sentimentCounts.neutral / item.articles.length) * 100}%` }}
                      />
                      <div
                        className="bg-[#E6B2BA]"
                        style={{ width: `${(sentimentCounts.negative / item.articles.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#C599B6] border-b-4 border-[#C599B6] pb-2">
                    TRENDING HEADLINES
                  </h3>
                  {item.articles.slice(0, 3).map((article, j) => (
                    <a
                      key={j}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block hover:bg-[#FAD0C4]/20 p-2 border-2 border-transparent hover:border-[#C599B6]"
                    >
                      <div className="flex gap-3">
                        <div className={`w-1.5 ${article.sentiment === 'positive' ? 'bg-[#C599B6]' :
                            article.sentiment === 'negative' ? 'bg-[#E6B2BA]' : 'bg-[#FAD0C4]'
                          }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#C599B6] line-clamp-2">
                            {article.title}
                          </p>
                          {article.publishedAt && (
                            <p className="text-xs text-[#E6B2BA] mt-1">
                              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              }).toUpperCase()}
                            </p>
                          )}
                        </div>
                        {article.imageUrl && (
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-16 h-16 object-cover border-2 border-[#C599B6]"
                          />
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </motion.article>
            )
          })}
        </section>
      </main>

      <style jsx global>{`
        @font-face {
          font-family: 'PixelFont';
          src: url('/fonts/pixel-font.ttf') format('truetype');
        }

        .font-pixel {
          font-family: 'PixelFont', monospace;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  )
}