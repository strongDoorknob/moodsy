//app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function FirstPage() {
  const [isHovered, setIsHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, 100])

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => {
      const offset = window.pageYOffset
      document.documentElement.style.setProperty('--parallax-offset', `${offset * 0.5}px`)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const particlePositions = Array.from({ length: 30 }).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100
  }))

  return (
    <motion.div className="relative h-screen w-full overflow-hidden">
      <motion.div 
        className="absolute inset-0"
        style={{ y }}
      >
        <img
          src="img/globe.png"
          className="h-full w-full object-cover scale-110"
          alt="Global background"
          role="presentation"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#02020a]/80 via-[#161670]/50 to-[#02020a]/90" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10 w-[80vw] max-w-4xl"
      >
        <img
          src="/img/title.png"
          alt="Moodsy"
          className="w-full opacity-95 drop-shadow-[0_5px_35px_rgba(255,255,255,0.25)]"
        />
      </motion.div>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pt-40 space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a0a0f0] mb-4">
            Emotional Wellness Tracker
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto px-4">
            Understand your emotional patterns and improve mental health through AI-powered mood analysis
          </p>
        </motion.div>

        <motion.button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => router.push('/dashboard')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative px-16 py-5 rounded-2xl text-2xl font-bold transition-all duration-300 group overflow-hidden shadow-xl hover:shadow-[0_0_40px_-5px_rgba(22,22,112,0.6)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#161670] to-[#02020a] opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3030c0] to-[#161670] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <span className="relative z-10 text-white flex items-center space-x-3">
            <span>Get Started</span>
            <motion.span
              animate={isHovered ? { x: 5 } : { x: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              →
            </motion.span>
          </span>
        </motion.button>

        {isMounted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-12 text-gray-300 text-sm flex items-center space-x-4"
          >
            <span>Trusted by 1 user worldwide LMAO TT</span>
            <div className="h-4 w-px bg-gray-400" />
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-3">
                {[1].map((i) => (
                  <img
                    key={i}
                    src={`/img/avatars/${i}.png`}
                    className="w-8 h-8 rounded-full border-2 border-white"
                    alt="User avatar"
                    loading="lazy"
                  />
                ))}
              </div>
              <span>Join our community</span>
            </div>
          </motion.div>
        )}
      </div>

      {isMounted && (
        <div className="absolute inset-0 pointer-events-none">
          {particlePositions.map((pos, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                opacity: 0,
                x: `${pos.x}%`,
                y: `${pos.y}%`
              }}
              animate={{
                opacity: [0, 0.3, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}