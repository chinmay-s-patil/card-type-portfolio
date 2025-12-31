'use client'
import { useEffect, useState, useRef } from 'react'
import ScaledNavWrapper from './ScaledNavWrapper'

export default function NavDots({ sections }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const container = document.getElementById('sections')
    if (!container) return

    const sectionEls = Array.from(container.querySelectorAll('.section'))
    
    // Intersection Observer for active section detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = sectionEls.indexOf(entry.target)
            if (idx >= 0) {
              setActive(idx)
              const id = entry.target.id
              if (id && window.history.replaceState) {
                window.history.replaceState(null, '', `#${id}`)
              }
              // Add active class for animations
              sectionEls.forEach((el, i) => {
                el.classList.toggle('active', i === idx)
              })
            }
          }
        })
      },
      { 
        root: container, 
        threshold: [0.5, 0.6, 0.7],
        rootMargin: '-10% 0px -10% 0px'
      }
    )

    sectionEls.forEach(el => observer.observe(el))

    // Keyboard navigation
    function onKey(e) {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        goTo(Math.min(active + 1, sectionEls.length - 1))
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        goTo(Math.max(active - 1, 0))
      } else if (e.key === 'Home') {
        e.preventDefault()
        goTo(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        goTo(sectionEls.length - 1)
      }
    }

    window.addEventListener('keydown', onKey)

    return () => {
      observer.disconnect()
      window.removeEventListener('keydown', onKey)
    }
  }, [active, sections])

  function goTo(idx) {
    const container = document.getElementById('sections')
    const sectionEls = Array.from(container.querySelectorAll('.section'))
    const target = sectionEls[idx]
    if (!target) return
    
    target.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start',
      inline: 'nearest'
    })
  }

  return (
    <ScaledNavWrapper side="right">
      {/* Navigation dots on the right */}
      <div 
        style={{
          position: 'fixed',
          right: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 60,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'flex-end',
          animation: 'fadeInRight 0.8s ease-out'
        }}
        aria-label="Section navigation"
      >
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--muted)',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          letterSpacing: '0.15em',
          marginBottom: '0.5rem'
        }}>NAVIGATION</div>
        
        <div style={{ height: '1rem' }} />

        {sections.map((s, i) => (
          <div 
            key={s.id} 
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 10px',
              alignItems: 'center',
              gap: '1rem',
              position: 'relative',
              width: '100%'
            }}
          >
            <div 
              style={{
                opacity: 0,
                transform: 'translateX(-12px)',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                pointerEvents: 'none',
                justifySelf: 'end',
                fontWeight: i === active ? '600' : '400'
              }}
              className="dot-label-hover"
            >
              {s.label}
            </div>
            <button
              aria-label={`Go to ${s.label} section`}
              aria-current={i === active ? 'true' : 'false'}
              title={s.label}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: i === active ? 'hsl(var(--accent))' : 'rgba(255, 255, 255, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                justifySelf: 'center',
                transform: i === active ? 'scale(1.4)' : 'scale(1)',
                boxShadow: i === active ? '0 0 16px hsl(var(--accent) / 0.6)' : 'none'
              }}
              className={`nav-dot-hover ${i === active ? 'active' : ''}`}
              onClick={() => goTo(i)}
            >
              {/* Ripple effect for active dot */}
              {i === active && (
                <span
                  style={{
                    content: '',
                    position: 'absolute',
                    inset: '-4px',
                    borderRadius: '50%',
                    border: '1px solid hsl(var(--accent))',
                    animation: 'pulse 2s infinite'
                  }}
                />
              )}
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translate(20px, -50%);
          }
          to {
            opacity: 1;
            transform: translate(0, -50%);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .nav-dot-hover:hover {
          background: rgba(255, 255, 255, 0.3) !important;
          transform: scale(1.2) !important;
        }

        .nav-dot-hover:hover + .dot-label-hover,
        div:has(.nav-dot-hover:hover) .dot-label-hover {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
      `}</style>
    </ScaledNavWrapper>
  )
}