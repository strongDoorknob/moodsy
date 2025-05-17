'use client'

import { useState, useEffect, ChangeEvent, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faShieldHalved, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import debounce from 'lodash.debounce'

type FormMode = 'signIn' | 'register'

const authVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<FormMode>('signIn')
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [isSubmitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordVisibility, setPasswordVisibility] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [honeypot, setHoneypot] = useState('')

  const validateEmail = (email: string) => 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const calculateStrength = useCallback((password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }, [])

  const debouncedStrength = useMemo(() => 
    debounce((password: string) => {
      setPasswordStrength(calculateStrength(password))
    }, 200)
  , [calculateStrength])

  useEffect(() => {
    if (honeypot) {
      setError('Invalid request')
      setSubmitting(false)
    }
  }, [honeypot])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!validateEmail(form.email)) return setError('Invalid email!')
    if (mode === 'register' && passwordStrength < 3)
      return setError('Weak password!')
    if (mode === 'register' && form.password !== form.confirm)
      return setError('Password mismatch!')

    setSubmitting(true)
    
    try {
      const endpoint = mode === 'signIn' ? 'login' : 'register'
      const res = await fetch(`http://localhost:8000/api/auth/${endpoint}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      })

      if (res.status === 429) throw new Error('Too many tries!')
      if (!res.ok) throw new Error((await res.json()).detail || 'Auth failed')

      setTimeout(() => router.push('/preview'), 1000)
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  const PasswordStrength = () => (
    <div className="w-full bg-[#FAD0C4] h-3 mt-2 border-2 border-[#C599B6]">
      <motion.div
        initial={{ width: 0 }}
        animate={{ 
          width: `${passwordStrength * 25}%`,
          backgroundColor: passwordStrength < 2 ? '#FF0000' : 
                          passwordStrength < 3 ? '#FFFF00' : '#00FF00'
        }}
        className="h-full pixelate"
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FFF7F3] flex items-center justify-center relative overflow-hidden crt-filter">
      {/* 8-bit Background Pattern */}
      <div className="absolute inset-0 bg-[#E6B2BA] pattern-grid opacity-20" />

      <div className="z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFF7F3] p-6 border-4 border-[#C599B6] shadow-[8px_8px_0_#C599B6] relative"
        >
          {/* Pixel Corner Decorations */}
          <div className="absolute top-2 left-2 w-3 h-3 bg-[#C599B6]" />
          <div className="absolute top-2 right-2 w-3 h-3 bg-[#C599B6]" />
          <div className="absolute bottom-2 left-2 w-3 h-3 bg-[#C599B6]" />
          <div className="absolute bottom-2 right-2 w-3 h-3 bg-[#C599B6]" />

          <div className="flex gap-4 mb-6 justify-center">
            {(['signIn', 'register'] as FormMode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setError(null)
                  setMode(m)
                }}
                className={`text-xl font-pixel px-4 py-1 ${
                  mode === m 
                    ? 'text-[#C599B6] border-b-4 border-[#E6B2BA]' 
                    : 'text-[#C599B6]/60 hover:text-[#C599B6]'
                }`}
              >
                {m === 'signIn' ? 'SIGN IN' : 'REGISTER'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="relative">
              <div className="flex items-center border-4 border-[#C599B6] bg-[#FFF7F3] p-2">
                <span className="text-[#C599B6] px-2">📧</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  placeholder="EMAIL"
                  required
                  className="w-full bg-transparent outline-none font-pixel placeholder-[#C599B6]/60 text-[#C599B6]"
                />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center border-4 border-[#C599B6] bg-[#FFF7F3] p-2">
                <span className="text-[#C599B6] px-2">🔒</span>
                <input
                  type={passwordVisibility ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={(e) => {
                    setForm({...form, password: e.target.value})
                    if (mode === 'register') debouncedStrength(e.target.value)
                  }}
                  placeholder="PASSWORD"
                  required
                  className="w-full bg-transparent outline-none font-pixel placeholder-[#C599B6]/60 text-[#C599B6]"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisibility(!passwordVisibility)}
                  className="text-[#C599B6] px-2 hover:text-[#E6B2BA]"
                >
                  {passwordVisibility ? '👁️' : '👁️🗨️'}
                </button>
              </div>
              {mode === 'register' && <PasswordStrength />}
            </div>

            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  variants={authVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="relative"
                >
                  <div className="flex items-center border-4 border-[#C599B6] bg-[#FFF7F3] p-2">
                    <span className="text-[#C599B6] px-2">🔁</span>
                    <input
                      type={passwordVisibility ? 'text' : 'password'}
                      name="confirm"
                      value={form.confirm}
                      onChange={(e) => setForm({...form, confirm: e.target.value})}
                      placeholder="CONFIRM"
                      required
                      className="w-full bg-transparent outline-none font-pixel placeholder-[#C599B6]/60 text-[#C599B6]"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="p-2 bg-[#E6B2BA] text-[#FFF7F3] font-pixel text-center border-4 border-[#C599B6]"
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
              className="w-full py-3 bg-[#C599B6] text-[#FFF7F3] font-pixel border-4 border-[#E6B2BA] hover:border-[#FAD0C4] hover:text-[#FAD0C4] transition-all"
            >
              {isSubmitting ? (
                <span className="animate-pulse">LOADING...</span>
              ) : mode === 'signIn' ? (
                'START QUEST ▶'
              ) : (
                'CREATE ACCOUNT ▲'
              )}
            </motion.button>
          </form>
        </motion.div>

        <div className="mt-4 text-center font-pixel text-[#C599B6]">
          {mode === 'signIn' ? 'NEW USER? ' : 'EXISTING USER? '}
          <button
            onClick={() => setMode(mode === 'signIn' ? 'register' : 'signIn')}
            className="underline hover:text-[#E6B2BA]"
          >
            {mode === 'signIn' ? 'REGISTER HERE' : 'LOGIN HERE'}
          </button>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @font-face {
          font-family: 'PixelFont';
          src: url('/fonts/pixel-font.ttf') format('truetype');
        }
        
        .font-pixel {
          font-family: 'PixelFont', monospace;
          letter-spacing: 1px;
        }
        
        .pattern-grid {
          background-image: linear-gradient(#C599B6 1px, transparent 1px),
                          linear-gradient(90deg, #C599B6 1px, transparent 1px);
          background-size: 16px 16px;
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