'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FaCheckCircle, FaTimesCircle, FaCrown } from 'react-icons/fa'

export default function ProPage() {
  const router = useRouter()

  const features = [
    { name: 'Country Code Access', free: true, pro: true },
    { name: 'Multi-country Comparisons', free: false, pro: true },
    { name: 'Embeddable Charts', free: false, pro: true },
    { name: 'Custom Dashboards', free: false, pro: true },
    { name: 'Priority Support', free: false, pro: true }
  ]

  const handleBuyClick = () => {
    router.push('/pro/confirm')
  }

  return (
    <>
      <div className="min-h-screen bg-[#FFF7F3] py-8 px-4 font-pixel crt-filter">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-4xl font-bold text-[#C599B6] mb-4 border-4 border-[#C599B6] p-4 inline-block shadow-[8px_8px_0_#C599B6]"
            >
              <FaCrown className="inline mr-2 text-[#E6B2BA]" />
              UPGRADE TO PRO MODE
            </motion.h1>
            <p className="text-xl text-[#E6B2BA] border-2 border-[#C599B6] p-3 bg-[#FFF7F3]">
              UNLOCK POWER-UPS FOR FULL ANALYSIS QUEST
            </p>
          </div>

          {/* Feature Comparison */}
          <div className="bg-[#FFF7F3] border-4 border-[#C599B6] shadow-[8px_8px_0_#C599B6] mb-12 p-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-3 gap-4 mb-4 border-b-4 border-[#C599B6] pb-2">
                <div className="text-[#C599B6] font-bold">FEATURE</div>
                <div className="text-center text-[#C599B6] font-bold">FREE</div>
                <div className="text-center text-[#C599B6] font-bold">PRO</div>
              </div>

              {features.map((feature, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-center border-2 border-[#C599B6] p-3">
                  <div className="text-[#E6B2BA]">{feature.name}</div>
                  <div className="text-center">
                    {feature.free ? (
                      <FaCheckCircle className="text-[#C599B6] inline" />
                    ) : (
                      <FaTimesCircle className="text-[#E6B2BA] inline" />
                    )}
                  </div>
                  <div className="text-center bg-[#FAD0C4]/30">
                    {feature.pro ? (
                      <FaCheckCircle className="text-[#C599B6] inline" />
                    ) : (
                      <FaTimesCircle className="text-[#E6B2BA] inline" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto bg-[#FFF7F3] border-4 border-[#C599B6] shadow-[8px_8px_0_#C599B6] p-8">
            <div className="text-center">
              <div className="mb-6 border-4 border-[#C599B6] p-4 bg-[#FFF7F3]">
                <div className="text-4xl font-bold text-[#C599B6]">7.99</div>
                <div className="text-[#E6B2BA]">GOLD COINS / MONTH</div>
              </div>

              <button
                onClick={handleBuyClick}
                className="w-full bg-[#C599B6] text-[#FFF7F3] border-4 border-[#E6B2BA] py-3 px-6 mb-4
                  hover:bg-[#E6B2BA] hover:border-[#C599B6] hover:text-[#C599B6] transition-all"
              >
                ▲ ACTIVATE PRO MODE ▲
              </button>

              <div className="flex items-center justify-center gap-2 text-[#E6B2BA] text-sm">
                <span className="border-2 border-[#C599B6] px-2">30-DAY GOLD BACK</span>
              </div>
            </div>
          </div>

          {/* Pixel Decorations */}
          <div className="flex justify-center gap-4 mt-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 bg-[#E6B2BA] border-2 border-[#C599B6] animate-bounce"></div>
            ))}
          </div>
        </div>
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

        .crt-filter {
          animation: crt-flicker 0.15s infinite;
        }

        @keyframes crt-flicker {
          0% { opacity: 0.9; }
          50% { opacity: 1; }
          100% { opacity: 0.9; }
        }
      `}</style>
    </>
  )
}