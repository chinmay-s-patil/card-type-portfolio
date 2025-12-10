'use client'

import { useState, useEffect, useRef } from 'react'
import eventsList from '../consts/EventsList'
import EventsModal from '../components/EventsModal'

export default function EventsNormalized() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [slideshowIndices, setSlideshowIndices] = useState({})
  const [scale, setScale] = useState(1)
  const [currentPage, setCurrentPage] = useState(0)
  const scrollContainerRef = useRef(null)
  
  const BASE_WIDTH = 1920
  const BASE_HEIGHT = 1080
  const EVENTS_PER_PAGE = 3

  // Scale calculation
  useEffect(() => {
    const calculateScale = () => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const widthScale = viewportWidth / BASE_WIDTH
      const heightScale = viewportHeight / BASE_HEIGHT
      setScale(Math.min(widthScale, heightScale))
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

  const events = eventsList
  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE)

  // Modal slideshow effect
  useEffect(() => {
    if (selectedEvent) {
      setSlideshowIndices({ [selectedEvent.id]: [0, 1, 2] })
    }
  }, [selectedEvent])

  useEffect(() => {
    if (!selectedEvent) return

    const timer = setInterval(() => {
      setSlideshowIndices(prev => {
        const current = prev[selectedEvent.id] || [0, 1, 2]
        const totalImages = selectedEvent.images.length
        const newIndices = current.map(idx => (idx + 3) % totalImages)
        return { ...prev, [selectedEvent.id]: newIndices }
      })
    }, 4000)

    return () => clearInterval(timer)
  }, [selectedEvent])

  // Deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      const eventMatch = hash.match(/#events#(.+)/)
      
      if (eventMatch) {
        const eventSlug = eventMatch[1]
        const event = events.find(e => 
          e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === eventSlug
        )
        if (event) setSelectedEvent(event)
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [events])

  // Scroll detection
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const containerWidth = container.clientWidth
      const page = Math.round(scrollLeft / containerWidth)
      setCurrentPage(Math.min(page, totalPages - 1))
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => container.removeEventListener('scroll', handleScroll)
  }, [totalPages])

  const scrollToPage = (index) => {
    const container = scrollContainerRef.current
    if (!container) return
    
    const containerWidth = container.clientWidth
    container.scrollTo({ left: containerWidth * index, behavior: 'smooth' })
  }

  const openModal = (event) => {
    setSelectedEvent(event)
    const slug = event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    window.history.pushState(null, '', `#events#${slug}`)
  }

  const closeModal = () => {
    setSelectedEvent(null)
    window.history.pushState(null, '', '#events')
  }

  return (
    <>
      {/* Main scaled container */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          position: 'relative',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Content container */}
        <div
          style={{
            position: 'relative',
            width: '1400px',
            height: '900px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0'
          }}
        >
          {/* Header */}
          <div style={{ flexShrink: 0, marginBottom: '32px' }}>
            <div style={{
              fontSize: '14px',
              color: 'hsl(140, 70%, 60%)',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              Conferences & Workshops
            </div>
            <h2 style={{
              fontSize: '56px',
              fontWeight: '700',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.1'
            }}>
              Events & Presentations
            </h2>
            <p style={{
              fontSize: '18px',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.68)',
              maxWidth: '900px'
            }}>
              A visual journey through technical conferences, workshops, and speaking engagements.
            </p>
          </div>

          {/* Page Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '24px',
            flexShrink: 0
          }}>
            <button
              onClick={() => scrollToPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: currentPage === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: currentPage === 0 ? 0.3 : 1,
                transition: 'all 0.3s ease'
              }}
              aria-label="Previous page"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToPage(idx)}
                  style={{
                    width: idx === currentPage ? '48px' : '36px',
                    height: '8px',
                    borderRadius: '4px',
                    background: idx === currentPage ? 'hsl(var(--accent))' : 'rgba(255, 255, 255, 0.15)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: idx === currentPage ? '0 0 12px hsl(var(--accent) / 0.5)' : 'none'
                  }}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => scrollToPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: currentPage === totalPages - 1 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: currentPage === totalPages - 1 ? 0.3 : 1,
                transition: 'all 0.3s ease'
              }}
              aria-label="Next page"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Horizontal Scroll Container */}
          <div 
            ref={scrollContainerRef}
            style={{
              flex: 1,
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory',
              display: 'flex',
              WebkitOverflowScrolling: 'touch',
              minHeight: 0
            }}
          >
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div
                key={pageIndex}
                style={{
                  minWidth: '100%',
                  width: '100%',
                  height: '100%',
                  flexShrink: 0,
                  scrollSnapAlign: 'start',
                  scrollSnapStop: 'always',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '32px',
                  alignItems: 'start',
                  width: '100%',
                  height: 'fit-content'
                }}>
                  {events
                    .slice(pageIndex * EVENTS_PER_PAGE, (pageIndex + 1) * EVENTS_PER_PAGE)
                    .map((event) => (
                      <div
                        key={event.id}
                        onClick={() => openModal(event)}
                        style={{
                          cursor: 'pointer',
                          transform: `rotate(${event.rotation}deg)`,
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        className="polaroid-card"
                      >
                        {/* Polaroid Frame */}
                        <div style={{
                          background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
                          padding: '16px',
                          paddingBottom: '64px',
                          borderRadius: '8px',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 1px 8px rgba(0, 0, 0, 0.3)',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          {/* Year Badge */}
                          <div style={{
                            position: 'absolute',
                            top: '24px',
                            left: '24px',
                            padding: '8px 16px',
                            background: 'rgba(0, 0, 0, 0.8)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '8px',
                            fontSize: '20px',
                            fontWeight: '900',
                            color: event.color,
                            zIndex: 10,
                            border: `2px solid ${event.color}60`,
                            boxShadow: `0 4px 12px ${event.color}30`
                          }}>
                            {event.year}
                          </div>

                          {/* Photo Preview */}
                          <div style={{
                            width: '100%',
                            height: '280px',
                            background: `linear-gradient(135deg, ${event.color}20, ${event.color}05)`,
                            borderRadius: '4px',
                            overflow: 'hidden',
                            position: 'relative',
                            marginBottom: '16px'
                          }}>
                            <img
                              src={event.images[0]}
                              alt={event.title}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'brightness(0.9)'
                              }}
                            />

                            {/* Type Badge */}
                            <div style={{
                              position: 'absolute',
                              top: '16px',
                              right: '16px',
                              padding: '6px 14px',
                              background: 'rgba(0, 0, 0, 0.75)',
                              backdropFilter: 'blur(8px)',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '700',
                              color: event.color,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em'
                            }}>
                              {event.type}
                            </div>
                          </div>

                          {/* Caption Area */}
                          <div style={{
                            fontFamily: "'Caveat', cursive",
                            fontSize: '19px',
                            color: '#e0e0e0',
                            textAlign: 'center',
                            marginBottom: '8px',
                            fontWeight: '600'
                          }}>
                            {event.title}
                          </div>

                          <div style={{
                            fontSize: '14px',
                            color: '#a0a0a0',
                            textAlign: 'center',
                            marginBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2"/>
                              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            {event.location}
                          </div>

                          <div style={{
                            fontSize: '13px',
                            color: '#808080',
                            textAlign: 'center',
                            fontStyle: 'italic'
                          }}>
                            {event.date}
                          </div>

                          {/* Tape Effect */}
                          <div style={{
                            position: 'absolute',
                            top: '-8px',
                            left: '50%',
                            transform: 'translateX(-50%) rotate(-2deg)',
                            width: '80px',
                            height: '20px',
                            background: 'rgba(255, 255, 255, 0.3)',
                            backdropFilter: 'blur(2px)',
                            border: '1px solid rgba(0, 0, 0, 0.05)',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                          }} />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <EventsModal
          event={selectedEvent}
          onClose={closeModal}
          scale={scale}
          imageIndices={slideshowIndices[selectedEvent.id]}
        />
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap');

        .polaroid-card:hover {
          transform: rotate(0deg) scale(1.05) translateY(-8px) !important;
          z-index: 10;
        }

        button:not(:disabled):hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: scale(1.1);
        }

        /* Hide scrollbar for WebKit browsers */
        div::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 1200px) {
          div[style*="grid-template-columns: repeat(3, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}