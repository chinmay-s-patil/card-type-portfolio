'use client'
import { useEffect, useState, useRef } from 'react'

export default function NavDots({ sections }) {
  const [active, setActive] = useState(0)
  const progressRef = useRef(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef(null)

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

    // Scroll progress tracking
    function onScroll() {
      const total = container.scrollHeight - container.clientHeight
      const pos = container.scrollTop
      const pct = total > 0 ? (pos / total) * 100 : 0
      if (progressRef.current) {
        progressRef.current.style.height = `${pct}%`
      }

      // Debounce scrolling state
      setIsScrolling(true)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

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
      container.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKey)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
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
    <>
      {/* Progress bar on the left */}
      <div 
        style={{
          position: 'fixed',
          left: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          animation: 'fadeInLeft 0.8s ease-out'
        }}
        aria-label="Scroll progress"
      >
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--muted)',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          letterSpacing: '0.15em',
          marginBottom: '0.5rem'
        }}>SECTIONS</div>
        
        <div 
          style={{
            width: '3px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '999px',
            position: 'relative',
            overflow: 'hidden'
          }}
          role="progressbar" 
          aria-valuemin="0" 
          aria-valuemax="100" 
          aria-valuenow={Math.round((active / (sections.length - 1)) * 100)}
          aria-label="Scroll progress"
        >
          <div 
            ref={progressRef} 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(180deg, hsl(var(--accent)), rgba(140, 255, 200, 0.6))',
              height: '0%',
              transition: 'height 0.2s ease-out',
              boxShadow: '0 0 12px hsl(var(--accent) / 0.4)'
            }}
          />
        </div>
      </div>

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
                transform: i === active ? 'scale(1.4)' : isScrolling && i !== active ? 'scale(0.9)' : 'scale(1)',
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
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translate(-20px, -50%);
          }
          to {
            opacity: 1;
            transform: translate(0, -50%);
          }
        }

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
    </>
  )
}