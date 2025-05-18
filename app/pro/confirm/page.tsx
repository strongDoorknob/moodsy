'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGamepad, faCheckCircle, faShieldHalved } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

export default function ConfirmPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const subtotal = 7.99
  const tax = parseFloat((subtotal * 0.07).toFixed(2))
  const total = parseFloat((subtotal + tax).toFixed(2))

  return (
    <div className="min-h-screen w-full px-4 py-8 bg-[#FFF7F3] text-[#C599B6] font-pixel">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 border-4 border-[#C599B6] p-4 inline-block shadow-[8px_8px_0_#C599B6]">
          <FontAwesomeIcon icon={faGamepad} className="mr-2" />
          PRO MODE CHECKOUT
        </h1>

        {!submitted ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Product Summary */}
            <div className="bg-[#FFF7F3] p-6 border-4 border-[#C599B6] shadow-[8px_8px_0_#C599B6]">
              <h2 className="text-xl font-bold mb-6 border-b-4 border-[#C599B6] pb-2">YOUR QUEST ITEMS</h2>
              <div className="flex items-center space-x-5 mb-8">
                <div className="w-24 h-24 bg-[#FAD0C4] border-4 border-[#C599B6] p-2">
                  <Image src="/img/intro-pro.png" alt="Moodsy PRO" className="w-full h-full object-contain pixelate" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">MOODSY PRO EDITION</h3>
                  <p className="text-[#E6B2BA]">FULL ACCESS PASS</p>
                  <p className="mt-2 font-bold text-[#C599B6]">${subtotal}/MOON</p>
                </div>
              </div>

              <div className="space-y-3 border-t-4 border-[#C599B6] pt-6">
                <div className="flex justify-between">
                  <span>BASE GOLD</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>KING`&apos;S TAX</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t-4 border-[#C599B6]">
                  <span>TOTAL</span>
                  <span className="text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className="bg-[#FFF7F3] p-6 border-4 border-[#C599B6] shadow-[8px_8px_0_#C599B6]">
              <h2 className="text-xl font-bold mb-6 border-b-4 border-[#C599B6] pb-2">PAYMENT CONSOLE</h2>
              <div className="space-y-4">
                {[
                  { label: 'HERO NAME', name: 'name', placeholder: 'JOHN DOE' },
                  { label: 'SCROLL ADDRESS', name: 'email', placeholder: 'JOHN@EXAMPLE.COM', type: 'email' },
                  { label: 'CASTLE ADDRESS', name: 'address', placeholder: '123 MAIN KEEP' }
                ].map(({ label, name, placeholder, type = 'text' }) => (
                  <div key={name}>
                    <label className="block text-sm font-bold mb-1">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={form[name as keyof typeof form]}
                      onChange={handleChange}
                      required
                      placeholder={placeholder}
                      className="w-full px-4 py-3 border-4 border-[#C599B6] bg-[#FFF7F3] placeholder-[#E6B2BA] focus:outline-none"
                    />
                  </div>
                ))}

                <div className="border-t-4 border-[#C599B6] pt-6">
                  <h3 className="text-sm font-bold mb-5">DRAGON CARD INFO</h3>

                  <div>
                    <label className="block text-sm font-bold mb-1">CARD NUMBERS</label>
                    <input
                      name="cardNumber"
                      value={form.cardNumber}
                      onChange={handleChange}
                      required
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border-4 border-[#C599B6] bg-[#FFF7F3]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">EXPIRY MOON</label>
                      <input
                        name="expiry"
                        value={form.expiry}
                        onChange={handleChange}
                        required
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border-4 border-[#C599B6] bg-[#FFF7F3]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">MAGIC CODE</label>
                      <input
                        name="cvv"
                        value={form.cvv}
                        onChange={handleChange}
                        required
                        placeholder="123"
                        className="w-full px-4 py-3 border-4 border-[#C599B6] bg-[#FFF7F3]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-[#C599B6] text-[#FFF7F3] font-bold py-4 border-4 border-[#E6B2BA] hover:bg-[#E6B2BA] hover:border-[#C599B6] transition-all"
                  >
                    CONFIRM PAYMENT ▲
                  </button>
                </div>

                <p className="text-center text-sm text-[#E6B2BA] mt-4">
                  <FontAwesomeIcon icon={faShieldHalved} className="mr-1" />
                   PROTECTED BY ANCIENT SPELLS
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-[#FFF7F3] p-8 border-4 border-[#C599B6] shadow-[8px_8px_0_#C599B6] text-center">
            <div className="mb-5 flex justify-center">
              <div className="w-16 h-16 bg-[#FAD0C4] border-4 border-[#C599B6] rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-[#C599B6]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3">QUEST COMPLETE!</h2>
            <p className="text-[#E6B2BA] mb-6">MAGIC SCROLL SENT TO YOUR TOWER</p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-[#C599B6] hover:text-[#E6B2BA] font-bold w-full border-4 border-[#C599B6] p-2 hover:border-[#E6B2BA]"
            >
              NEW QUEST ➔
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @font-face {
          font-family: 'PixelFont';
          src: url('/fonts/pixel-font.ttf') format('truetype');
        }

        .font-pixel {
          font-family: 'PixelFont', monospace;
          letter-spacing: 1px;
        }

        .pixelate {
          image-rendering: pixelated;
        }
      `}</style>
    </div>
  )
}