// app/components/ScaledNavWrapper.jsx
'use client'

import { useState, useEffect } from 'react'

export default function ScaledNavWrapper({ children, side = 'left' }) {
  const [scale, setScale] = useState(1)

  const BASE_WIDTH = 1920
  const BASE_HEIGHT = 1080

  useEffect(() => {
    const calculateScale = () => {
      const widthScale = window.innerWidth / BASE_WIDTH
      const heightScale = window.innerHeight / BASE_HEIGHT
      setScale(Math.min(widthScale, heightScale))
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        [side]: '2rem',
        transform: `translateY(-50%) scale(${scale})`,
        transformOrigin: 'center',
        zIndex: 60,
      }}
    >
      {children}
    </div>
  )
}