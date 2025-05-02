'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FirstPage() {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 items-center">
        <img
          src="img/globe.png"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Dark overlay to dim background */}
      <div className="absolute inset-0 bg-black bg-opacity-30" />

      {/* Huge Moodsy logo, bleeding off top */}
      <div
        className="absolute top-10 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
      >
        <img
          src="/img/title.png"
          alt="Moodsy logo text"
          className="w-[160%] max-w-none opacity-90"
        />
      </div>

      {/* Centered Register button */}
      <div className="absolute inset-0 flex top-30 items-center justify-center z-20">
        <button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => router.push('/auth/auth.tsx')}
          className={`
            px-14 py-4
            rounded-xl
            text-xl font-semibold
            transition-transform duration-200
            transform hover:scale-105
            ${
              isHovered
                ? 'bg-gradient-to-r from-[#161670] to-[#02020a] text-white shadow-2xl'
                : 'bg-gradient-to-r from-[#161670] to-[#02020a] text-white shadow-lg'
            }
          `}
        >
          Register
        </button>
      </div>
    </div>
  )
}