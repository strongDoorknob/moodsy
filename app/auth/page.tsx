'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

type FormMode = 'signIn' | 'register'

export default function AuthPage() {
  const [mode, setMode] = useState<FormMode>('signIn')
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [isSubmitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Basic front-end validation
    if (mode === 'register' && form.password !== form.confirm) {
      return setError("Passwords don't match.")
    }

    setSubmitting(true)
    try {
      const url =
        mode === 'signIn'
          ? 'http://localhost:8000/api/auth/login/'
          : 'http://localhost:8000/api/auth/register/'

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',           // for cookies/session
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Authentication failed')
      }

      // On success, redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background */}
      <img
        src="/img/globe.png"
        className="absolute inset-0 h-full w-full object-cover"
        alt="Earth from space"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30" />

      {/* Form container */}
      <div className="absolute inset-0 flex items-center justify-center z-20 p-4">
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full text-white">
          {/* Tabs */}
          <div className="flex mb-6">
            {(['signIn', 'register'] as FormMode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setError(null)
                  setMode(m)
                }}
                className={`
                  flex-1 py-2 text-center font-medium
                  ${
                    mode === m
                      ? 'border-b-2 border-blue-400 text-blue-300'
                      : 'text-gray-300 hover:text-white'
                  }
                `}
              >
                {m === 'signIn' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md bg-black bg-opacity-40 placeholder-gray-400 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md bg-black bg-opacity-40 placeholder-gray-400 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block mb-1 text-sm">Confirm Password</label>
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md bg-black bg-opacity-40 placeholder-gray-400 focus:outline-none"
                  placeholder="••••••••"
                />
              </motion.div>
            )}

            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-3 rounded-lg font-semibold
                transition-transform duration-200
                ${
                  isSubmitting
                    ? 'bg-gray-500 text-gray-200'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105'
                }
              `}
            >
              {isSubmitting
                ? 'Please wait...'
                : mode === 'signIn'
                ? 'Sign In'
                : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
