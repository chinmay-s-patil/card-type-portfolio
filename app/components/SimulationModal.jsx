'use client'
import { useEffect, useState, useRef } from 'react'

export default function SimulationModal({ simulation, onClose }) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const videoRefs = useRef([])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Manage video playback when media changes
  useEffect(() => {
    // Pause all local videos
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause()
        video.currentTime = 0
      }
    })
    
    // Play current local video if it exists
    const currentVideo = videoRefs.current[currentMediaIndex]
    if (currentVideo && simulation.media[currentMediaIndex]?.type === 'video') {
      currentVideo.play().catch(err => console.log('Autoplay prevented:', err))
    }
  }, [currentMediaIndex, simulation.media])

  // Cleanup videos on unmount
  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.pause()
          video.currentTime = 0
        }
      })
    }
  }, [])

  if (!simulation) return null

  const hasMultipleMedia = simulation.media && simulation.media.length > 1

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % simulation.media.length)
  }

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + simulation.media.length) % simulation.media.length)
  }

// Helper function to convert YouTube URL to embed URL with autoplay and loop
  const getYouTubeEmbedUrl = (url) => {
    // Extract video ID from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&\s]+)/,           // youtube.com/watch?v=VIDEO_ID
      /(?:youtube\.com\/embed\/)([^?\s]+)/,             // youtube.com/embed/VIDEO_ID
      /(?:youtu\.be\/)([^?\s]+)/,                        // youtu.be/VIDEO_ID
      /(?:youtube\.com\/v\/)([^?\s]+)/                   // youtube.com/v/VIDEO_ID
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        const videoId = match[1]
        // Add parameters: autoplay, loop, mute, no controls, playlist (required for loop)
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&mute=1&controls=0&playlist=${videoId}`
      }
    }
    
    // If no pattern matches, return the original URL (might already be an embed URL)
    return url
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)'
        }}
      />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '1200px',
          width: '100%',
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, rgba(15, 20, 32, 0.95), rgba(10, 14, 26, 0.95))',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 80px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            width: '40px',
            height: '40px',
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Content */}
        <div 
          className="modal-content-scroll"
          style={{ 
            overflowY: 'auto', 
            overflowX: 'hidden',
            padding: '2.5rem',
            flex: 1
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              fontSize: '0.85rem',
              color: simulation.color,
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}>
              {simulation.category || 'CFD Simulation'}
            </div>
            
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '0.75rem',
              background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {simulation.title}
            </h2>

            <div style={{
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginTop: '1rem'
            }}>
              {/* Solver Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1.25rem',
                background: `${simulation.color}15`,
                border: `2px solid ${simulation.color}40`,
                borderRadius: '10px',
                fontFamily: 'monospace',
                fontSize: '1rem',
                fontWeight: '700',
                color: simulation.color,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                </svg>
                {simulation.solver}
              </div>

              {/* Year */}
              <div style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.95rem',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                {simulation.year}
              </div>

              {/* Turbulence Model Badge */}
              {simulation.specs?.turbulence && (
                <div style={{
                  padding: '0.5rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  border: `1px solid ${simulation.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}>
                    Model:
                  </span>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    color: simulation.color,
                    fontFamily: 'monospace'
                  }}>
                    {simulation.specs.turbulence}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Media Section */}
          {simulation.media && simulation.media.length > 0 && (
            <div style={{
              position: 'relative',
              width: '100%',
              height: '400px',
              marginBottom: '2rem',
              borderRadius: '16px',
              overflow: 'hidden',
              background: 'rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {simulation.media.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: idx === currentMediaIndex ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: idx === currentMediaIndex ? 'auto' : 'none'
                  }}
                >
                  {/* YouTube Link (embedded) */}
                  {item.type === 'link' && (
                    <iframe
                      src={getYouTubeEmbedUrl(item.src)}
                      title={item.caption || simulation.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none'
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}

                  {/* Local Video */}
                  {item.type === 'video' && (
                    <video
                      ref={el => videoRefs.current[idx] = el}
                      src={item.src}
                      loop
                      muted
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  )}

                  {/* Image */}
                  {item.type === 'image' && (
                    <img
                      src={item.src}
                      alt={item.caption || simulation.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  )}
                </div>
              ))}

              {/* Media Navigation */}
              {hasMultipleMedia && (
                <>
                  <button
                    onClick={prevMedia}
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      zIndex: 10
                    }}
                    className="hover:bg-[rgba(255,255,255,0.2)]"
                    aria-label="Previous media"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  <button
                    onClick={nextMedia}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      zIndex: 10
                    }}
                    className="hover:bg-[rgba(255,255,255,0.2)]"
                    aria-label="Next media"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Indicators */}
                  <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '0.5rem',
                    zIndex: 10
                  }}>
                    {simulation.media.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentMediaIndex(idx)}
                        style={{
                          width: idx === currentMediaIndex ? '32px' : '8px',
                          height: '8px',
                          borderRadius: '4px',
                          background: idx === currentMediaIndex 
                            ? simulation.color
                            : 'rgba(255, 255, 255, 0.4)',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        aria-label={`View media ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Description */}
          {simulation.description && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'rgba(255, 255, 255, 0.95)'
              }}>
                Overview
              </h3>
              <p style={{
                fontSize: '1rem',
                lineHeight: '1.8',
                color: 'var(--muted)'
              }}>
                {simulation.description}
              </p>
            </div>
          )}

          {/* Computational Methods */}
          {simulation.tags && simulation.tags.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'rgba(255, 255, 255, 0.95)'
              }}>
                Computational Methods
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                {simulation.tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '0.5rem 1.25rem',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      background: `${simulation.color}15`,
                      border: `1px solid ${simulation.color}40`,
                      color: simulation.color,
                      transition: 'all 0.2s ease'
                    }}
                    className="hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.15)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
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

        /* Custom scrollbar styling */
        .modal-content-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .modal-content-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .modal-content-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, hsl(var(--accent)), rgba(140, 255, 200, 0.6));
          border-radius: 4px;
          transition: background 0.3s ease;
        }
        .modal-content-scroll::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--accent));
          box-shadow: 0 0 8px hsl(var(--accent) / 0.5);
        }
        /* Firefox scrollbar */
        .modal-content-scroll {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--accent)) rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  )
}