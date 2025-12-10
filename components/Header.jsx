'use client'
import { useState, useEffect } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const container = document.getElementById('sections')
    if (!container) return

    const handleScroll = () => {
      setScrolled(container.scrollTop > 50)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className="site-header" 
      role="banner"
      style={{
        background: scrolled ? 'rgba(10, 14, 26, 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        padding: scrolled ? '0.75rem 1.25rem' : '0',
        borderRadius: scrolled ? '16px' : '0',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="brand">Chinmay Patil</div>
      <nav className="hidden md:flex gap-3 ml-2" aria-label="Primary navigation">
        <a 
          href="#intro" 
          className="text-sm px-3 py-1 rounded-md hover:bg-white/8 transition-all"
        >
          About
        </a>
        <a 
          href="#education" 
          className="text-sm px-3 py-1 rounded-md hover:bg-white/8 transition-all"
        >
          Education
        </a>
        <a 
          href="#experience" 
          className="text-sm px-3 py-1 rounded-md hover:bg-white/8 transition-all"
        >
          Experience
        </a>
        <a 
          href="#projects" 
          className="text-sm px-3 py-1 rounded-md hover:bg-white/8 transition-all"
        >
          Projects
        </a>
        <a 
          href="#events" 
          className="text-sm px-3 py-1 rounded-md hover:bg-white/8 transition-all"
        >
          Events
        </a>
      </nav>
    </header>
  )
}