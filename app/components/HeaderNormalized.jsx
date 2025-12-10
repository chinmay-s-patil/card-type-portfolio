'use client'
import { useState, useEffect } from 'react'

export default function HeaderNormalized() {
  const [scrolled, setScrolled] = useState(false)
  const [scale, setScale]   = useState(1)

  const BASE_WIDTH  = 1920
  const BASE_HEIGHT = 1080
  const BASE_PAD    = 40          // 2.5 rem @ 1920×1080

  /* ---------- scroll behaviour ---------- */
  useEffect(() => {
    const container = document.getElementById('sections')
    if (!container) return
    const onScroll = () => setScrolled(container.scrollTop > 50)
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  /* ---------- responsive scale ---------- */
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth  / BASE_WIDTH
      const h = window.innerHeight / BASE_HEIGHT
      setScale(Math.min(w, h))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  /* ---------- render ---------- */
  return (
    <div
      style={{
        position        : 'fixed',
        top             : 0,
        left            : 0,                            // hug left
        transform       : `scale(${scale})`,
        transformOrigin : 'top left',                   // scale from left
        zIndex          : 70,
        width           : BASE_WIDTH,
        paddingLeft     : BASE_PAD,                     // original gap
      }}
    >
      <header
        className="site-header"
        role="banner"
        style={{
          background    : scrolled ? 'rgba(10, 14, 26, 0.8)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          padding       : scrolled ? '0.75rem 1.25rem' : '0',
          borderRadius  : scrolled ? '16px' : '0',
          transition    : 'all 0.3s ease',
          display       : 'flex',
          alignItems    : 'center',
          justifyContent: 'space-between',
          width         : 'fit-content',   // shrink-to-fit
        }}
      >
        <div className="brand">Chinmay Patil</div>

        <nav className="hidden md:flex gap-3 ml-2" aria-label="Primary navigation">
          {['About','Education','Experience','Projects','Events'].map((lbl,i)=>(
            <a key={lbl}
               href={`#${['intro','education','experience','projects','events'][i]}`}
               className="text-sm px-3 py-1 rounded-md hover:bg-white/8 transition-all">
              {lbl}
            </a>
          ))}
        </nav>
      </header>
    </div>
  )
}