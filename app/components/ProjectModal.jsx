'use client'
import { useEffect, useState, useRef } from 'react'

export default function ProjectModal({ project, onClose }) {
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

  // Only manage local video playback
  useEffect(() => {
    const currentMedia = project.media[currentMediaIndex]
    
    // Pause all local videos
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause()
        video.currentTime = 0
      }
    })
    
    // Play current local video if it exists
    const currentVideo = videoRefs.current[currentMediaIndex]
    if (currentVideo && currentMedia?.type === 'video') {
      currentVideo.play().catch(err => console.log('Autoplay prevented:', err))
    }
  }, [currentMediaIndex, project.media])

  // Cleanup on unmount
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

  if (!project) return null

  const hasMultipleMedia = project.media && project.media.length > 1

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % project.media.length)
  }

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + project.media.length) % project.media.length)
  }

  // Helper function to convert YouTube URL to embed URL
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
        return `https://www.youtube.com/embed/${match[1]}`
      }
    }
    
    // If no pattern matches, return the original URL (might already be an embed URL)
    return url
  }

  const currentMedia = project.media?.[currentMediaIndex]

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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
              color: 'hsl(var(--accent))',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}>
              {project.category || 'Project'}
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
              {project.title}
            </h2>

            <div style={{
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginTop: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
                color: 'var(--muted)'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {project.period}
              </div>

              {project.subtitle && (
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  color: 'hsl(var(--accent))',
                  padding: '0.4rem 1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {project.subtitle}
                </div>
              )}
            </div>
          </div>

          {/* Media Section */}
          {project.media && project.media.length > 0 && (
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
              {project.media.map((item, idx) => (
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
                      title={item.caption || project.title}
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
                      alt={item.caption || project.title}
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
                    {project.media.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentMediaIndex(idx)}
                        style={{
                          width: idx === currentMediaIndex ? '32px' : '8px',
                          height: '8px',
                          borderRadius: '4px',
                          background: idx === currentMediaIndex 
                            ? 'hsl(var(--accent))' 
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

              {/* Media Caption */}
              {currentMedia?.caption && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  zIndex: 10
                }}>
                  {currentMedia.caption}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {project.description && (
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
                {project.description}
              </p>
            </div>
          )}

          {/* Key Learnings */}
          {project.learnings && project.learnings.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'rgba(255, 255, 255, 0.95)'
              }}>
                Key Learnings
              </h3>
              <ul style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1rem',
                listStyle: 'none',
                padding: 0
              }}>
                {project.learnings.map((learning, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      transition: 'all 0.2s ease'
                    }}
                    className="hover:bg-[rgba(255,255,255,0.05)]"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '0.2rem' }}>
                      <circle cx="12" cy="12" r="10" stroke="hsl(var(--accent))" strokeWidth="2"/>
                      <path d="M8 12l2 2 4-4" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      color: 'rgba(255, 255, 255, 0.85)'
                    }}>
                      {learning}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies */}
          {project.tags && project.tags.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'rgba(255, 255, 255, 0.95)'
              }}>
                Technologies
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '0.5rem 1.25rem',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      transition: 'all 0.2s ease'
                    }}
                    className="hover:bg-[rgba(255,255,255,0.1)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {(project.links || project.href) && (
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {project.href && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: 'hsl(var(--accent))',
                    color: '#0a0e1a',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  className="hover:opacity-90"
                >
                  View Project
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}
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
        }

        .modal-content-scroll::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--accent));
        }
      `}</style>
    </div>
  )
}