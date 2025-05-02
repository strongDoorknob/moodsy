'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

type FormMode = 'signIn' | 'register'

export default function AuthPage() {
  const [mode, setMode] = useState<FormMode>('signIn')
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [isSubmitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [emailValid, setEmailValid] = useState(true)
  const [honeypot, setHoneypot] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  // Password strength calculator
  const calculateStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (password.match(/[A-Z]/)) strength += 1
    if (password.match(/[0-9]/)) strength += 1
    if (password.match(/[^A-Za-z0-9]/)) strength += 1
    return strength
  }

  // Email validation
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Honeypot detection
  useEffect(() => {
    if (honeypot) {
      setError('Invalid request')
      setSubmitting(false)
    }
  }, [honeypot])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (honeypot) return
    if (!validateEmail(form.email)) return setError('Invalid email address')
    if (mode === 'register' && passwordStrength < 3) return setError('Password too weak')
    if (mode === 'register' && form.password !== form.confirm) return setError("Passwords don't match")

    setSubmitting(true)
    try {
      const url = mode === 'signIn' 
        ? 'http://localhost:8000/api/auth/login/' 
        : 'http://localhost:8000/api/auth/register/'

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          // Add CAPTCHA token here if using service like reCAPTCHA
        }),
      })

      if (res.status === 429) {
        throw new Error('Too many attempts. Please try again later.')
      }

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Authentication failed')
      }

      // Success animation
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Password strength meter
  const StrengthIndicator = () => (
    <div className="flex gap-1 mt-2">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ width: 0 }}
          animate={{ width: passwordStrength > i ? '100%' : '0%' }}
          className={`h-1 rounded-full ${
            passwordStrength > i 
              ? passwordStrength < 2 ? 'bg-red-500' 
              : passwordStrength < 3 ? 'bg-yellow-500' 
              : 'bg-green-500'
              : 'bg-gray-600'
          }`}
          style={{ flex: 1 }}
        />
      ))}
    </div>
  )

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    throw new Error('Function not implemented.')
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Animated Background */}
      <motion.div 
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80"
      >
        <img
          src="/img/globe.png"
          className="h-full w-full object-cover mix-blend-soft-light"
          alt="Earth from space"
        />
      </motion.div>

      {/* Form container */}
      <div className="absolute inset-0 flex items-center justify-center z-20 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 max-w-md w-full text-white shadow-2xl"
        >
          {/* Honeypot field */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="absolute opacity-0 h-0 w-0 pointer-events-none"
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Tabs */}
          <div className="flex mb-8 relative">
            {(['signIn', 'register'] as FormMode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setError(null)
                  setMode(m)
                }}
                className={`flex-1 py-4 text-center font-medium text-lg relative ${
                  mode === m ? 'text-white' : 'text-gray-300 hover:text-white/80'
                }`}
              >
                {m === 'signIn' ? 'Sign In' : 'Register'}
                {mode === m && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative group">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={() => setEmailValid(validateEmail(form.email))}
                required
                className="w-full px-4 py-3 bg-white/5 rounded-xl border ${
                  emailValid ? 'border-white/10' : 'border-red-400/50'
                } focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all peer"
                placeholder=" "
              />
              <label className="absolute left-4 top-3.5 text-gray-300 pointer-events-none transition-all 
                peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 
                peer-focus:-top-2.5 peer-focus:text-sm peer-valid:-top-2.5 peer-valid:text-sm">
                Email Address
              </label>
              {!emailValid && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute right-3 top-3 text-red-400"
                >
                  ✖
                </motion.div>
              )}
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={(e) => {
                    handleChange(e)
                    setPasswordStrength(calculateStrength(e.target.value))
                  }}
                  required
                  className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all peer"
                  placeholder=" "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? '👁️' : '👁️🗨️'}
                </button>
              </div>
              <label className="absolute left-4 top-3.5 text-gray-300 pointer-events-none transition-all 
                peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 
                peer-focus:-top-2.5 peer-focus:text-sm peer-valid:-top-2.5 peer-valid:text-sm">
                Password
              </label>
              {mode === 'register' && <StrengthIndicator />}
            </div>

            {/* Confirm Password */}
            <AnimatePresence mode='wait'>
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative group"
                >
                  <input
                    type="password"
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all peer"
                    placeholder=" "
                  />
                  <label className="absolute left-4 top-3.5 text-gray-300 pointer-events-none transition-all 
                    peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 
                    peer-focus:-top-2.5 peer-focus:text-sm peer-valid:-top-2.5 peer-valid:text-sm">
                    Confirm Password
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-500/20 border border-red-400/30 rounded-lg flex items-center gap-3"
                >
                  <div className="text-red-400">⚠️</div>
                  <span className="text-sm text-red-200">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Animation */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex justify-center"
                >
                  <svg
                    className="checkmark text-green-400 w-12 h-12"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                  >
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || success}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2
                transition-all relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600
                hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-5 h-5 border-2 border-white/50 border-t-transparent rounded-full"
                />
              ) : success ? (
                'Success!'
              ) : mode === 'signIn' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </motion.button>

            {/* Forgot Password */}
            {mode === 'signIn' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-gray-400 hover:text-blue-300 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => router.push('/reset-password')}
                >
                  Forgot Password?
                </button>
              </motion.div>
            )}

            {/* Social Login */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                onClick={() => {
                  // Implement WebAuthn biometric login
                  if (typeof PublicKeyCredential !== 'undefined') {
                    navigator.credentials.get({ publicKey: {
                      challenge: new Uint8Array(32),
                      rpId: window.location.hostname,
                    }})
                  } else {
                    setError('Biometric login not supported')
                  }
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12.25c1.24 0 2.25-1.01 2.25-2.25S13.24 7.75 12 7.75 9.75 8.76 9.75 10s1.01 2.25 2.25 2.25zm4.5 4c0-1.5-3-2.25-4.5-2.25s-4.5.75-4.5 2.25V17h9v-.75zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                </svg>
                <span>Biometric</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                </svg>
                <span>Google</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}