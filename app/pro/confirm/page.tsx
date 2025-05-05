'use client'

import { useState } from 'react'

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
    <div className="min-h-screen w-full px-4 md:px-8 py-12 bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center">
          <svg className="w-8 h-8 mr-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
          Checkout
        </h1>

        {!submitted ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 text-gray-700">Your Order</h2>
              <div className="flex items-center space-x-5 mb-8">
                <div className="w-24 h-24 bg-indigo-50 rounded-lg p-3">
                  <img src="/img/intro-pro.png" alt="Moodsy PRO" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Moodsy PRO</h3>
                  <p className="text-sm text-gray-500">Advanced mood tracking program</p>
                  <p className="mt-2 font-bold text-indigo-600">${subtotal}/month</p>
                </div>
              </div>

              <div className="space-y-3 border-t pt-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (7%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-semibold pt-2">
                  <span>Total</span>
                  <span className="text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 text-gray-700">Payment Details</h2>
              <div className="space-y-5">
                {[
                  { label: 'Full Name', name: 'name', placeholder: 'John Doe' },
                  { label: 'Email', name: 'email', placeholder: 'john@example.com', type: 'email' },
                  { label: 'Billing Address', name: 'address', placeholder: '123 Main St' }
                ].map(({ label, name, placeholder, type = 'text' }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={form[name as keyof typeof form]}
                      onChange={handleChange}
                      required
                      placeholder={placeholder}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                    />
                  </div>
                ))}

                <div className="border-t pt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-5">Card Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      name="cardNumber"
                      value={form.cardNumber}
                      onChange={handleChange}
                      required
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                      <input
                        name="expiry"
                        value={form.expiry}
                        onChange={handleChange}
                        required
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        name="cvv"
                        value={form.cvv}
                        onChange={handleChange}
                        required
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                  >
                    Confirm Payment
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Your payment is secured with 256-bit SSL encryption
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="mb-5 flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">We've sent your order confirmation to your email</p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center justify-center w-full"
            >
              Place Another Order
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
