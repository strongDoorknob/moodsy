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
    
    if (!validateEmail(form.email)) return setError('Please enter a valid email address')
    if (mode === 'register' && passwordStrength < 3)
      return setError('Password must meet minimum strength requirements')
    if (mode === 'register' && form.password !== form.confirm)
      return setError('Passwords do not match')

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

      if (res.status === 429) throw new Error('Too many attempts. Please wait.')
      if (!res.ok) throw new Error((await res.json()).detail || 'Authentication failed')

      setTimeout(() => router.push('/preview'), 1000)
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  const PasswordStrength = () => (
    <div className="w-full bg-white/5 rounded-full h-2 mt-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ 
          width: `${passwordStrength * 25}%`,
          backgroundColor: passwordStrength < 2 ? '#ef4444' : 
                          passwordStrength < 3 ? '#eab308' : '#22c55e'
        }}
        className="h-full rounded-full transition-colors"
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 to-purple-900/40"
      >
        <img
          src="/img/globe.png"
          className="h-full w-full object-cover mix-blend-soft-light opacity-50"
          alt="Background"
        />
      </motion.div>

      <div className="z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10"
        >
          <div className="flex gap-4 mb-8 relative">
            {(['signIn', 'register'] as FormMode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setError(null)
                  setMode(m)
                }}
                className={`text-lg font-medium px-4 py-2 relative ${
                  mode === m ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`}
              >
                {m === 'signIn' ? 'Sign In' : 'Register'}
                {mode === m && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400"
                  />
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="relative group">
              <FontAwesomeIcon 
                icon={faEnvelope} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-cyan-400" 
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                placeholder="Email address"
                required
                className="w-full pl-12 pr-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 placeholder-white/30"
              />
            </div>

            <div className="relative group">
              <FontAwesomeIcon 
                icon={faShieldHalved} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-cyan-400" 
              />
              <div className="relative">
                <input
                  type={passwordVisibility ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={(e) => {
                    setForm({...form, password: e.target.value})
                    if (mode === 'register') debouncedStrength(e.target.value)
                  }}
                  placeholder="Password"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 placeholder-white/30"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisibility(!passwordVisibility)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-cyan-400"
                >
                  <FontAwesomeIcon icon={passwordVisibility ? faEyeSlash : faEye} />
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
                  className="relative group"
                >
                  <div className="relative">
                    <input
                      type={passwordVisibility ? 'text' : 'password'}
                      name="confirm"
                      value={form.confirm}
                      onChange={(e) => setForm({...form, confirm: e.target.value})}
                      placeholder="Confirm password"
                      required
                      className="w-full pl-12 pr-12 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 placeholder-white/30"
                    />
                    <FontAwesomeIcon 
                      icon={faShieldHalved} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-cyan-400" 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all relative overflow-hidden"
            >
              <span className="relative z-10">
                {isSubmitting ? 'Processing...' : mode === 'signIn' ? 'Sign In' : 'Create Account'}
              </span>
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: isSubmitting ? '100%' : '0%' }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-white/10"
              />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}