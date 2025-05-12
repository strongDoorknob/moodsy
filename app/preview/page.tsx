// app/preview/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PreviewPage() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['US', 'JP', 'DE'])
  
  useEffect(() => {
    setLoaded(true)
  }, [])

  const features = [
    {
      title: "Real-time Sentiment Analysis",
      description: "Instant mood detection across global news sources",
      icon: "🌍"
    },
    {
      title: "Multilingual Processing",
      description: "Supports 15+ languages with AI-powered translation",
      icon: "🤖"
    },
    {
      title: "Interactive Visualizations",
      description: "Beautiful data representations updated every 5 minutes",
      icon: "📊"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-900 text-white font-sans overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full opacity-10"
        animate={{
          background: [
            'radial-gradient(circle at 10% 20%, #4F46E5, transparent)',
            'radial-gradient(circle at 90% 80%, #9333EA, transparent)',
            'radial-gradient(circle at 50% 50%, #3B82F6, transparent)'
          ]
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <header className="text-center py-20 space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent"
          >
            Here's come the features of Moodsy!!
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-blue-100 max-w-2xl mx-auto"
          >
            Harness AI-powered sentiment analysis to monitor global news moods in real-time across 10+ countries (free version)
          </motion.p>

          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <button
              onClick={() => router.push('/dashboard')}
              className="group px-8 py-4 bg-cyan-500 rounded-xl font-bold text-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30"
            >
              Launch Dashboard
              <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">
                ➔
              </span>
            </button>
          </motion.div>
        </header>

        {/* Floating Globe Visualization */}
        <motion.div 
          className="my-20 flex justify-center items-center"
          animate={{
            rotate: 360,
            y: [0, -20, 0]
          }}
          transition={{
            rotate: {
              duration: 60,
              repeat: Infinity,
              ease: 'linear'
            },
            y: {
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          }}
        >
          <div className="w-64 h-64 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full shadow-2xl relative overflow-hidden">
            {selectedCountries.map((country, idx) => (
              <div
                key={country}
                className="absolute w-4 h-4 bg-white rounded-full animate-pulse"
                style={{
                  left: `${30 + (idx * 25)}%`,
                  top: `${50 + Math.sin(idx) * 30}%`
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8 py-20">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-blue-100">{feature.description}</p>
            </motion.div>
          ))}
        </section>

        {/* Interactive Preview */}
        <section className="py-20">
          <div className="bg-black/30 rounded-3xl p-8 backdrop-blur-lg">
            <h2 className="text-3xl font-bold mb-8">Preview</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Country Selector Preview */}
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  {selectedCountries.map(country => (
                    <div
                      key={country}
                      className="px-4 py-2 bg-cyan-500/20 rounded-full flex items-center gap-2"
                    >
                      <span>{country}</span>
                      <button className="text-cyan-300 hover:text-white">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="relative">
                  <input
                    placeholder="Try adding 'FR' or 'ES'..."
                    className="w-full px-6 py-3 bg-white/5 rounded-xl border border-white/20 focus:outline-none focus:border-cyan-400"
                  />
                  <button className="absolute right-2 top-2 px-6 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-400">
                    Add
                  </button>
                </div>
              </div>

              {/* Sentiment Chart Preview */}
              <div className="bg-black/40 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full" />
                  <span className="text-sm">73% Positive</span>
                </div>
                <div className="space-y-4">
                  {['🇺🇸 US: 68% 😊', '🇯🇵 JP: 82% 😃', '🇩🇪 DE: 59% 😐'].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10"
                    >
                      <div className="w-1/3">{item.split(':')[0]}</div>
                      <div className="flex-1 h-2 bg-gray-700 rounded-full">
                        <div
                          className="h-2 bg-cyan-400 rounded-full"
                          style={{ width: `${parseInt(item.split('%')[0].slice(-2))}%` }}
                        />
                      </div>
                      <span>{item.split(' ')[2]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-20">
          <h2 className="text-4xl font-bold mb-6">Ready to Explore?</h2>
          <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
            Join hundreds of analysts and journalists already decoding the world's
            emotional landscape
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-4 bg-cyan-500 rounded-xl font-bold hover:bg-cyan-400 transition-all transform hover:scale-105"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => router.push('/pro')}
              className="px-8 py-4 border border-cyan-400 rounded-xl font-bold hover:bg-cyan-400/20 transition-all"
            >
              Go Pro
            </button>
          </div>
        </section>
      </main>

      {/* Animated Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-blue-200">
        <p>© 2024 MoodSphere. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="#" className="hover:text-cyan-400">Privacy</a>
          <a href="#" className="hover:text-cyan-400">Terms</a>
          <a href="#" className="hover:text-cyan-400">Contact</a>
        </div>
      </footer>
    </div>
  )
}