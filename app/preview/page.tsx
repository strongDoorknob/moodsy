'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faGlobe, faLock, faSearch } from '@fortawesome/free-solid-svg-icons'

export default function PreviewPage() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  useEffect(() => {
    setLoaded(true)
  }, [])

  const features = [
    {
      title: 'Global Mood Tracker',
      pro: false,
      icon: faGlobe,
      path: '/dashboard',
    },
    {
      title: 'Deep Dive Analytics',
      pro: true,
      icon: faChartLine,
      path: '/analytics',
    },
    {
      title: 'Multi-region Comparison',
      pro: true,
      icon: faSearch,
      path: '/comparison',
    },
  ]

  return (
    <div className="min-h-screen bg-[#FFF7F3] text-[#C599B6] font-pixel overflow-hidden crt-filter">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center py-16 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold border-4 border-[#C599B6] p-6 shadow-[8px_8px_0_#C599B6] bg-[#FFF7F3] mx-4"
          >
            EMOTIONAL 8-BIT INTELLIGENCE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg md:text-xl text-[#E6B2BA] max-w-2xl mx-auto border-2 border-[#C599B6] p-4 bg-[#FFF7F3]"
          >
            POWER-UP YOUR SENTIMENT ANALYSIS
          </motion.p>
        </header>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              <div
                className={`w-full flex flex-col items-center p-6 border-4 ${
                  feature.pro ? 'border-[#E6B2BA]' : 'border-[#C599B6]'
                } bg-[#FFF7F3] shadow-[8px_8px_0_#C599B6] hover:shadow-[12px_12px_0_#C599B6] transition-shadow`}
                onMouseEnter={() => feature.pro && setShowTooltip(feature.title)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <div className="mb-4 text-4xl text-[#C599B6]">
                  <FontAwesomeIcon icon={feature.icon} className="pixelate" />
                </div>
                <h3 className="text-xl text-center mb-4 px-4">{feature.title}</h3>
                
                <button
                  className={`w-full py-3 border-4 font-bold ${
                    feature.pro 
                      ? 'border-[#E6B2BA] text-[#E6B2BA] cursor-not-allowed' 
                      : 'border-[#C599B6] hover:bg-[#C599B6] hover:text-[#FFF7F3]'
                  }`}
                  disabled={feature.pro}
                  onClick={() => !feature.pro && router.push(feature.path)}
                >
                  {feature.pro ? (
                    <div className="flex items-center justify-center gap-2">
                      <FontAwesomeIcon icon={faLock} />
                      <span>PRO LOCKED</span>
                    </div>
                  ) : 'START →'}
                </button>
              </div>

              {showTooltip === feature.title && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 p-4 bg-[#FFF7F3] border-4 border-[#C599B6] text-[#E6B2BA] text-center"
                >
                  ▲ REQUIRES MOODSY PRO ▲
                </motion.div>
              )}
            </motion.div>
          ))}
        </section>

        <section className="my-16 border-4 border-[#C599B6] bg-[#FFF7F3] p-8 shadow-[12px_12px_0_#C599B6]">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold border-b-4 border-[#C599B6] pb-4">
              UNLOCK SUPER POWERS
            </h2>
            <p className="text-[#E6B2BA] text-lg">
              LEVEL UP WITH ANALYTICS, COMPARISONS & HISTORICAL DATA
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/pro')}
                className="px-8 py-4 bg-[#C599B6] text-[#FFF7F3] border-4 border-[#E6B2BA] hover:bg-[#E6B2BA]"
              >
                ▲ UPGRADE TO PRO ▲
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/dashboard')}
                className="px-8 py-4 border-4 border-[#C599B6] hover:bg-[#C599B6]/10"
              >
                FREE TRIAL (NO COINS)
              </motion.button>
            </div>
          </div>
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
        
        .crt-filter {
          animation: crt-flicker 0.15s infinite;
        }
        
        @keyframes crt-flicker {
          0% { opacity: 0.9; }
          50% { opacity: 1; }
          100% { opacity: 0.9; }
        }
        
        .pixelate {
          image-rendering: pixelated;
        }
      `}</style>
    </div>
  )
}