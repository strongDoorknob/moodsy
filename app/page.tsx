'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

export default function FirstPage() {
  const [isHovered, setIsHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
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

  const particlePositions = Array.from({ length: 50 }).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100
  }))

  return (
    <motion.div className="relative h-screen w-full overflow-hidden bg-[#FFF7F3]">
      {/* Animated background tiles */}
      <div className="absolute inset-0 bg-[#FAD0C4] pattern-8bit-grid opacity-40" />

      {/* Floating islands */}
      <motion.div
        className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#E6B2BA] border-4 border-[#C599B6] shadow-[16px_16px_0_#C599B6]"
        animate={{ y: 10 }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }
        }}
      >
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#FFF7F3] border-4 border-[#C599B6] shadow-[8px_8px_0_#C599B6]" />
      </motion.div>

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pt-40 space-y-8">
        {/* Animated title with bouncing effect */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 10
          }}
        >
          <div className="pixelate border-4 border-[#C599B6] p-8 bg-[#FFF7F3] shadow-[12px_12px_0_#C599B6] hover:shadow-[16px_16px_0_#C599B6] transition-shadow">
            <h1 className="text-6xl text-center font-pixel text-[#C599B6] hover:text-[#E6B2BA] transition-colors">
              M O O D S Y
            </h1>
          </div>

          <AnimatePresence>
            {showEasterEgg && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-8 -right-8 w-16 h-16 bg-[#E6B2BA] border-4 border-[#C599B6] flex items-center justify-center shadow-[8px_8px_0_#C599B6]"
              >
                <span className="font-pixel text-4xl">🎮</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Interactive health bar */}
        <div className="w-64 h-8 border-4 border-[#C599B6] bg-[#FFF7F3] mb-8 shadow-[8px_8px_0_#C599B6]">
          <motion.div
            className="h-full bg-[#E6B2BA]"
            initial={{ width: '0%' }}
            animate={{ width: '72%' }}
            transition={{ duration: 2, delay: 0.5 }}
          />
        </div>

        {/* Animated button with power-up effect */}
        <motion.button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => router.push('/auth')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative px-16 py-5 text-2xl font-pixel transition-all duration-300 overflow-hidden border-4 border-[#C599B6] shadow-[8px_8px_0_#C599B6] bg-[#FFF7F3] hover:shadow-[12px_12px_0_#C599B6] group"
        >
          <div className="absolute inset-0 bg-[#E6B2BA] opacity-0 group-hover:opacity-10 transition-opacity" />

          <span className="relative z-10 text-[#E6B2BA] flex items-center space-x-3">
            <motion.span
              animate={isHovered ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              ⚡
            </motion.span>
            <span>START QUEST</span>
            <motion.span
              animate={isHovered ? { x: 5, rotate: [0, 10, -10, 0] } : { x: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              ▲
            </motion.span>
          </span>
        </motion.button>

        {/* Pixel art scene */}
        <div className="relative w-64 h-32 mt-16 border-4 border-[#C599B6] bg-[#FFF7F3] shadow-[8px_8px_0_#C599B6]">
          {/* Animated character */}
          <motion.div
            className="absolute bottom-0 left-8 w-12 h-16 bg-[#E6B2BA]"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute -top-4 left-2 w-8 h-8 bg-[#C599B6]" />
          </motion.div>

          {/* Floating hearts */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-8 right-8 w-6 h-6 bg-[#C599B6]"
              animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Retro status bar */}
        {isMounted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 w-full max-w-2xl px-8"
          >
            <div className="border-4 border-[#C599B6] bg-[#FFF7F3] p-4 shadow-[8px_8px_0_#C599B6]">
              <div className="flex justify-between items-center font-pixel text-[#C599B6]">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-[#E6B2BA] border-2 border-[#C599B6]" />
                  <span>LEVEL 1 HERO</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="animate-pulse">♥</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Animated particles */}
      {isMounted && (
        <div className="absolute inset-0 pointer-events-none">
          {particlePositions.map((pos, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-[#E6B2BA]"
              initial={{
                opacity: 0,
                x: `${pos.x}%`,
                y: `${pos.y}%`
              }}
              animate={{
                opacity: [0, 0.7, 0],
                scale: [0, 1, 0],
                rotate: [0, 180]
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

      {/* Global styles */}
      <style jsx global>{`
        @font-face {
          font-family: 'PixelFont';
          src: url('/fonts/pixel-font.ttf') format('truetype');
        }
        
        .font-pixel {
          font-family: 'PixelFont', monospace;
          text-shadow: 2px 2px 0 #C599B6;
        }
        
        .pattern-8bit-grid {
          background-image: 
            linear-gradient(to right, #C599B6 2px, transparent 2px),
            linear-gradient(to bottom, #C599B6 2px, transparent 2px);
          background-size: 32px 32px;
        }
        
        .crt-effect {
          animation: crt-flicker 0.15s infinite;
        }
        
        @keyframes crt-flicker {
          0% { opacity: 0.9; }
          50% { opacity: 1; }
          100% { opacity: 0.9; }
        }
        
        ::-webkit-scrollbar {
          width: 8px;
          background: #FFF7F3;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #E6B2BA;
          border: 2px solid #C599B6;
        }
      `}</style>
    </motion.div>
  )
}