'use client'
import { useState, useEffect } from 'react'

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const EVENTS_PER_PAGE = 3
  const [currentPage, setCurrentPage] = useState(0)
  const [slideshowIndices, setSlideshowIndices] = useState({})
  const [scale, setScale] = useState(1)

  // Reference: 2560x1440 @ 100% scale
  const BASE_WIDTH = 2560
  const BASE_HEIGHT = 1080

  useEffect(() => {
    const calculateScale = () => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      // Calculate scale based on viewport dimensions relative to base
      const widthScale = viewportWidth / BASE_WIDTH
      const heightScale = viewportHeight / BASE_HEIGHT
      
      // Use the smaller scale to prevent overflow
      const newScale = Math.min(widthScale, heightScale)
      setScale(newScale)
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

  const events = [
    {
      id: 1,
      title: 'International Symposium on Wind Energy',
      location: 'VIT Chennai',
      date: 'March 2025',
      year: '2025',
      type: 'Symposium',
      images: [
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (1).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (10).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (11).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (12).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (13).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (14).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (15).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (16).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (17).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (18).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (19).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (2).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (20).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (21).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (22).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (3).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (4).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (5).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (6).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (7).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (8).jpg',
        '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (9).jpg',
      ],
      description: 'Intensive hands-on sessions covering advanced meshing strategies, turbulence modeling best practices, and comprehensive validation methodologies for industrial CFD applications.',
      tags: ['Meshing', 'Turbulence', 'Validation'],
      rotation: -2,
      color: '#14ffc8'
    },
    {
      id: 2,
      title: 'IISc Do Drones Workshop',
      location: 'Bangalore, India',
      date: 'March 2025',
      year: '2025',
      type: 'Hands-on Workshop',
      images: [
        '/Events/IISc Do Drone/IISc Do Drone (1).jpg',
        '/Events/IISc Do Drone/IISc Do Drone (2).jpg',
        '/Events/IISc Do Drone/IISc Do Drone (3).jpg',
        '/Events/IISc Do Drone/IISc Do Drone (4).jpg',
        '/Events/IISc Do Drone/IISc Do Drone (5).jpg',
        '/Events/IISc Do Drone/IISc Do Drone (6).jpg',
        '/Events/IISc Do Drone/IISc Do Drone (7).jpg',
        '/Events/IISc Do Drone/IISc Do Drone (8).jpg',
        '/Events/IISc Do Drone/IISc Do Drone (9).jpg',
        '/Events/IISc Do Drone/IISc Do Drone (10).jpg',
        '/Events/IISc Do Drone/IISc Do Drone (11).jpg',
      ],
      description: 'Participated in a hands-on Drone Workshop organized by the Do Drones club at IISc Bangalore. The session began with understanding the theoretical aspects of multirotor flight and control systems. We then spent a full day assembling, calibrating, performing pre-flight checks, and finally flying the S450 drone ourselves. The workshop concluded with an inspiring surprise visit from Dr. S. Somnath, former Chairman of ISRO, who shared valuable insights on India\'s advancements in aerospace and drone technologies.',
      tags: ['Workshop', 'Drones', 'Aerospace'],
      rotation: 3,
      color: '#00d4aa'
    },
    {
      id: 3,
      title: 'National Conference of Wind Engineering (NCWE)',
      location: 'VIT Chennai',
      date: 'March 2024',
      year: '2024',
      type: 'Organizer',
      images: [
        '/Events/NCWE/NCWE (1).jpg',
        '/Events/NCWE/NCWE (2).jpg',
        '/Events/NCWE/NCWE (3).jpg',
        '/Events/NCWE/NCWE (4).jpg',
        '/Events/NCWE/NCWE (5).jpg',
        '/Events/NCWE/NCWE (6).jpg',
        '/Events/NCWE/NCWE (7).jpg',
      ],
      description: 'Served as a member of the organizing committee for the National Conference of Wind Engineering (NCWE) held in March 2024. The event brought together leading experts and researchers in the field, with participation from international delegates and professors from the UK, Italy, Japan, and Germany. Numerous technical papers were presented, accompanied by insightful talks and discussions on the latest advances in wind engineering.',
      tags: ['Organizing', 'Wind Engineering', 'Conference'],
      rotation: 1,
      color: '#005fa3'
    },
    {
      id: 4,
      title: "Drone Workshop and Flight Training",
      location: "VIT Chennai",
      date: "February 2024",
      year: "2024",
      type: "Workshop",
      images: [
        "/Events/Drone VITC/Drone VITC (1).jpg",
        "/Events/Drone VITC/Drone VITC (2).jpg",
        "/Events/Drone VITC/Drone VITC (3).jpg",
        "/Events/Drone VITC/Drone VITC (4).jpg",
        "/Events/Drone VITC/Drone VITC (5).jpg",
        "/Events/Drone VITC/Drone VITC (6).jpg",
        "/Events/Drone VITC/Drone VITC (7).jpg",
      ],
      description: "Participated in a hands-on drone workshop at VIT Chennai focusing on UAV fundamentals and flight dynamics. Disassembled and studied a variety of drones, from simple toy models to an S500 kit, and gained practical experience flying the DJI Mavic Pro 3.",
      tags: ["Drones", "Aerospace", "Flight Dynamics", "UAV"],
      rotation: -1,
      color: "#00b890"
    },
  ]

  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE)
  const currentEvents = events.slice(
    currentPage * EVENTS_PER_PAGE,
    (currentPage + 1) * EVENTS_PER_PAGE
  )

  // Initialize slideshow indices for modal (3 images at once)
  useEffect(() => {
    if (selectedEvent) {
      setSlideshowIndices({
        [selectedEvent.id]: [0, 1, 2]
      })
    }
  }, [selectedEvent])

  // Auto-advance modal slideshow (all 3 images change together)
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

  const goToNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <>
      <div style={{ 
        maxWidth: `${1300 * scale}px`, 
        margin: '0 auto', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        padding: `0 ${32 * scale}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top center'
      }}>
        <div style={{ 
          flexShrink: 0, 
          marginBottom: `${32 * scale}px` 
        }}>
          <div className="kicker" style={{ 
            fontSize: `${14 * scale}px`,
            marginBottom: `${12 * scale}px`
          }}>
            Conferences & Workshops
          </div>
          <h2 style={{ 
            fontSize: `${56 * scale}px`,
            fontWeight: '700',
            marginBottom: `${16 * scale}px`,
            background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.1'
          }}>
            Events & Presentations
          </h2>
          <p className="muted" style={{ 
            maxWidth: '60ch',
            fontSize: `${18 * scale}px`,
            lineHeight: '1.6'
          }}>
            A visual journey through technical conferences, workshops, and speaking engagements.
          </p>
        </div>

        {/* Events Grid */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: `${32 * scale}px`,
          alignItems: 'start',
          marginBottom: `${32 * scale}px`
        }}>
          {currentEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              style={{
                cursor: 'pointer',
                transform: `rotate(${event.rotation}deg)`,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              className="polaroid-card"
            >
              {/* Polaroid Frame */}
              <div style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
                padding: `${16 * scale}px`,
                paddingBottom: `${64 * scale}px`,
                borderRadius: `${8 * scale}px`,
                boxShadow: `0 ${10 * scale}px ${30 * scale}px rgba(0, 0, 0, 0.5), 0 ${1 * scale}px ${8 * scale}px rgba(0, 0, 0, 0.3)`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Year Badge */}
                <div style={{
                  position: 'absolute',
                  top: `${24 * scale}px`,
                  left: `${24 * scale}px`,
                  padding: `${8 * scale}px ${16 * scale}px`,
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: `${8 * scale}px`,
                  fontSize: `${20 * scale}px`,
                  fontWeight: '900',
                  color: event.color,
                  zIndex: 10,
                  border: `2px solid ${event.color}60`,
                  boxShadow: `0 ${4 * scale}px ${12 * scale}px ${event.color}30`
                }}>
                  {event.year}
                </div>

                {/* Photo Preview */}
                <div style={{
                  width: '100%',
                  height: `${280 * scale}px`,
                  background: `linear-gradient(135deg, ${event.color}20, ${event.color}05)`,
                  borderRadius: `${4 * scale}px`,
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: `${16 * scale}px`
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
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.style.display = 'flex'
                      e.target.parentElement.style.alignItems = 'center'
                      e.target.parentElement.style.justifyContent = 'center'
                    }}
                  />
                  
                  {/* Fallback */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: `${48 * scale}px`,
                    fontWeight: '900',
                    color: event.color,
                    opacity: 0.15
                  }}>
                    {event.year}
                  </div>

                  {/* Type Badge */}
                  <div style={{
                    position: 'absolute',
                    top: `${16 * scale}px`,
                    right: `${16 * scale}px`,
                    padding: `${6 * scale}px ${14 * scale}px`,
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: `${20 * scale}px`,
                    fontSize: `${12 * scale}px`,
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
                  fontSize: `${19 * scale}px`,
                  color: '#e0e0e0',
                  textAlign: 'center',
                  marginBottom: `${8 * scale}px`,
                  fontWeight: '600'
                }}>
                  {event.title}
                </div>

                <div style={{
                  fontSize: `${14 * scale}px`,
                  color: '#a0a0a0',
                  textAlign: 'center',
                  marginBottom: `${12 * scale}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: `${8 * scale}px`
                }}>
                  <svg width={14 * scale} height={14 * scale} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {event.location}
                </div>

                <div style={{
                  fontSize: `${13 * scale}px`,
                  color: '#808080',
                  textAlign: 'center',
                  fontStyle: 'italic'
                }}>
                  {event.date}
                </div>

                {/* Tape Effect */}
                <div style={{
                  position: 'absolute',
                  top: `${-8 * scale}px`,
                  left: '50%',
                  transform: 'translateX(-50%) rotate(-2deg)',
                  width: `${80 * scale}px`,
                  height: `${20 * scale}px`,
                  background: 'rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(2px)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: `0 ${2 * scale}px ${4 * scale}px rgba(0, 0, 0, 0.1)`
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: `${16 * scale}px`,
          flexShrink: 0
        }}>
          <button
            onClick={goToPrevious}
            disabled={currentPage === 0}
            style={{
              width: `${40 * scale}px`,
              height: `${40 * scale}px`,
              borderRadius: '50%',
              background: currentPage === 0 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(255, 255, 255, 0.1)',
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
            <svg width={20 * scale} height={20 * scale} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div style={{ 
            display: 'flex', 
            gap: `${8 * scale}px`,
            alignItems: 'center'
          }}>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                style={{
                  width: idx === currentPage ? `${48 * scale}px` : `${32 * scale}px`,
                  height: `${6 * scale}px`,
                  borderRadius: `${3 * scale}px`,
                  background: idx === currentPage 
                    ? 'hsl(var(--accent))' 
                    : 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: idx === currentPage 
                    ? `0 0 ${12 * scale}px hsl(var(--accent) / 0.5)` 
                    : 'none'
                }}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={currentPage === totalPages - 1}
            style={{
              width: `${40 * scale}px`,
              height: `${40 * scale}px`,
              borderRadius: '50%',
              background: currentPage === totalPages - 1 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(255, 255, 255, 0.1)',
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
            <svg width={20 * scale} height={20 * scale} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `${32 * scale}px`,
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => setSelectedEvent(null)}
        >
          {/* Backdrop */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)'
          }} />

          {/* Modal Content */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: `${1400 * scale}px`,
              width: '95%',
              maxHeight: '90vh',
              background: 'linear-gradient(135deg, rgba(15, 20, 32, 0.95), rgba(10, 14, 26, 0.95))',
              borderRadius: `${24 * scale}px`,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: `0 ${20 * scale}px ${80 * scale}px rgba(0, 0, 0, 0.6)`,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedEvent(null)}
              style={{
                position: 'absolute',
                top: `${24 * scale}px`,
                right: `${24 * scale}px`,
                width: `${40 * scale}px`,
                height: `${40 * scale}px`,
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 10
              }}
              className="hover:bg-[rgba(255,255,255,0.1)]"
              aria-label="Close modal"
            >
              <svg width={20 * scale} height={20 * scale} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Content */}
            <div style={{ 
              overflowY: 'auto', 
              padding: `${40 * scale}px`,
              flex: 1
            }}>
              {/* Header */}
              <div style={{ marginBottom: `${32 * scale}px` }}>
                <div style={{
                  fontSize: `${14 * scale}px`,
                  color: selectedEvent.color,
                  fontWeight: '600',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: `${12 * scale}px`
                }}>
                  {selectedEvent.type}
                </div>
                
                <h2 style={{
                  fontSize: `${40 * scale}px`,
                  fontWeight: '700',
                  marginBottom: `${12 * scale}px`,
                  background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {selectedEvent.title}
                </h2>

                <div style={{
                  display: 'flex',
                  gap: `${32 * scale}px`,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginTop: `${16 * scale}px`
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: `${8 * scale}px`,
                    fontSize: `${15 * scale}px`,
                    color: 'var(--muted)'
                  }}>
                    <svg width={16 * scale} height={16 * scale} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {selectedEvent.location}
                  </div>

                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: `${14 * scale}px`,
                    color: selectedEvent.color,
                    padding: `${6 * scale}px ${16 * scale}px`,
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: `${8 * scale}px`,
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    {selectedEvent.date}
                  </div>
                </div>
              </div>

              {/* 3-Image Slideshow */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: `${16 * scale}px`,
                marginBottom: `${32 * scale}px`,
                height: `${400 * scale}px`
              }}>
                {(slideshowIndices[selectedEvent.id] || [0, 1, 2]).map((imgIndex, slotIndex) => (
                  <div
                    key={slotIndex}
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      borderRadius: `${12 * scale}px`,
                      overflow: 'hidden',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <img
                      src={selectedEvent.images[imgIndex]}
                      alt={`${selectedEvent.title} - ${imgIndex + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Description */}
              <div style={{ marginBottom: `${32 * scale}px` }}>
                <h3 style={{
                  fontSize: `${20 * scale}px`,
                  fontWeight: '600',
                  marginBottom: `${16 * scale}px`,
                  color: 'rgba(255, 255, 255, 0.95)'
                }}>
                  Overview
                </h3>
                <p style={{
                  fontSize: `${16 * scale}px`,
                  lineHeight: '1.8',
                  color: 'var(--muted)'
                }}>
                  {selectedEvent.description}
                </p>
              </div>

              {/* Tags */}
              <div style={{ marginBottom: `${32 * scale}px` }}>
                <h3 style={{
                  fontSize: `${20 * scale}px`,
                  fontWeight: '600',
                  marginBottom: `${16 * scale}px`,
                  color: 'rgba(255, 255, 255, 0.95)'
                }}>
                  Topics
                </h3>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: `${12 * scale}px`
                }}>
                  {selectedEvent.tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        padding: `${8 * scale}px ${20 * scale}px`,
                        borderRadius: `${12 * scale}px`,
                        fontSize: `${14 * scale}px`,
                        fontWeight: '600',
                        background: `${selectedEvent.color}15`,
                        border: `1px solid ${selectedEvent.color}40`,
                        color: selectedEvent.color,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap');

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .polaroid-card:hover {
          transform: rotate(0deg) scale(1.05) translateY(-8px) !important;
          z-index: 10;
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