'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ProPage() {
  const router = useRouter()

  const handleBuyClick = () => {
    router.push('/pro/confirm')
  }

  return (
    <div className="w-full flex flex-col items-center bg-[#FAFAFA] font-sans text-black">
      {/* Top image banner section */}
      <div className="w-full flex justify-center items-center text-center py-24">
        <div className="w-3/4 max-w-5xl rounded-xl overflow-hidden">
          <Image
            src="/img/top-section.png"
            alt="Pro Banner"
            width={1200}
            height={400}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16" />

      {/* Unlock Pro text and illustration */}
      <div className="w-full max-w-4xl px-6 md:px-12 py-24 flex justify-center">
        <Image
          src="/img/intro-pro.png"
          alt="Unlock Pro Section"
          width={800}
          height={400}
          className="w-full h-auto"
        />
      </div>

      {/* Spacer */}
      <div className="h-24" />

      {/* Feature 1 */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center px-6 md:px-12 mb-16">
        <Image
          src="/img/ccodes.png"
          alt="Country Codes"
          width={600}
          height={400}
          className="w-full md:w-1/2 rounded-lg"
        />
        <div className="md:ml-12 mt-6 md:mt-0">
          <h2 className="text-3xl font-bold mb-4">Any country code you like.</h2>
          <ul className="list-disc list-inside text-lg text-gray-700">
            <li>Track mood data for any country code</li>
            <li>Access daily sentiment back-catalog going back months or years [In Production]</li>
          </ul>
        </div>
      </div>

      {/* Feature 2 */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center px-6 md:px-12 mb-24">
        <Image
          src="/dashboard.png"
          alt="Dashboard"
          width={600}
          height={400}
          className="w-full md:w-1/2 rounded-lg"
        />
        <div className="md:ml-12 mt-6 md:mt-0">
          <h2 className="text-3xl font-bold mb-4">Custom dashboards & Embedded view</h2>
          <ul className="list-disc list-inside text-lg text-gray-700">
            <li>Multi-country comparison views (side-by-side mood graphs)</li>
            <li>Embeddable charts for intranets, blogs, or decks</li>
          </ul>
        </div>
      </div>

      {/* Get Pro Section */}
      <div className="flex-shrink-0 w-full h-full snap-start">
        <div className="bg-white w-full h-full flex flex-col justify-center items-center px-6 py-12">
          <h2 className="text-5xl font-bold text-black mb-12">Get your PRO now!!</h2>

          <div className="w-full max-w-lg bg-gradient-to-r from-blue-600 to-blue-300 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-6xl font-bold text-white">PRO</h3>
              <h3 className="text-5xl font-bold text-white">$7.99</h3>
            </div>
            <p className="text-white text-sm mt-1">*Include Tax 7%</p>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleBuyClick}
                className="bg-blue-900 text-white font-bold text-xl px-12 py-3 rounded-lg"
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
