// app/preview/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Lock } from 'lucide-react'

export default function PreviewPage() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  
  useEffect(() => {
    setLoaded(true)
  }, [])

  const features = [
    { 
      title: "Global Mood Tracker", 
      pro: false,
      icon: "🌐"
    },
    { 
      title: "Interactive Globe View", 
      pro: false,
      icon: "🔄"
    },
    { 
      title: "Deep Dive Analytics", 
      pro: true,
      icon: "📈"
    },
    { 
      title: "Multi-region Comparison", 
      pro: true,
      icon: "🔍"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-900 text-white font-sans overflow-hidden">
      {/* Animated Grid Background */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            'repeating-linear-gradient(45deg, rgba(99,102,241,0.1) 0%, rgba(79,70,229,0.1) 10%, transparent 10%, transparent 50%)',
            'repeating-linear-gradient(-45deg, rgba(99,102,241,0.1) 0%, rgba(79,70,229,0.1) 10%, transparent 10%, transparent 50%)'
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
            Experience Emotional Intelligence
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-blue-100 max-w-2xl mx-auto"
          >
            Harness real-time sentiment analysis with our intuitive platform
          </motion.p>
        </header>

        {/* Feature Access Panel */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="relative group"
              onHoverStart={() => feature.pro && setShowTooltip(feature.title)}
              onHoverEnd={() => setShowTooltip(null)}
            >
              <button
                className={`w-full h-40 flex flex-col items-center justify-center gap-4 p-6 rounded-2xl transition-all
                  ${feature.pro 
                    ? 'bg-white/5 cursor-not-allowed opacity-50' 
                    : 'bg-white/10 hover:bg-white/20 cursor-pointer'}
                  ${!feature.pro && 'hover:shadow-cyan-500/20 hover:shadow-lg'}`}
                disabled={feature.pro}
              >
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="text-lg font-medium text-center">{feature.title}</h3>
                {feature.pro && (
                  <div className="absolute top-3 right-3 text-cyan-400">
                    <Lock size={18} />
                  </div>
                )}
              </button>
              
              {feature.pro && showTooltip === feature.title && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-black/80 rounded-lg text-sm"
                >
                  Pro feature — Unlock with Moodsy Pro
                </motion.div>
              )}
            </motion.div>
          ))}
        </section>

        {/* Upgrade CTA Card */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
        >
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
              Unlock Advanced Insights
            </h2>
            <p className="text-blue-100 text-lg">
              Access deep analytics, multi-region comparisons, and historical trends 
              with our Pro tier. Join organizations worldwide making data-driven decisions.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/pro')}
              className="mx-auto px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl font-bold text-black hover:shadow-cyan-500/30 hover:shadow-lg transition-all"
            >
              Upgrade to Pro 🚀
            </motion.button>
          </div>
        </motion.div>

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
          <div className="w-64 h-64 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Simplified globe animation */}
            <div className="absolute inset-0 border-2 border-white/10 rounded-full" />
            <div className="absolute w-full h-0.5 bg-white/10 top-1/3" />
            <div className="absolute w-full h-0.5 bg-white/10 top-2/3" />
          </div>
        </motion.div>

        {/* Updated CTA Section */}
        <section className="text-center py-20">
          <h2 className="text-4xl font-bold mb-6">Ready to Explore?</h2>
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push('/dashboard')}
              className="px-8 py-4 bg-cyan-500 rounded-xl font-bold hover:bg-cyan-400 transition-all"
            >
              Start Free Trial
            </motion.button>
          </div>
        </section>
      </main>

      {/* Animated Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-blue-200">
        <p>© 2024 Moodsy. All rights reserved.</p>
      </footer>
    </div>
  )
}