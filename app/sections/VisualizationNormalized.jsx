'use client'

import { useState, useEffect, useRef } from 'react'
import visualizationsList from '../consts/VisualizationList'

export default function VisualizationNormalized() {
  const [scale, setScale] = useState(1)
  const [currentPage, setCurrentPage] = useState(0)
  const [hoveredCard, setHoveredCard] = useState(null)
  const scrollContainerRef = useRef(null)
  
  const BASE_WIDTH = 1920
  const BASE_HEIGHT = 1080
  const ITEMS_PER_PAGE = 6

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

  const visualizations = visualizationsList
  const totalPages = Math.ceil(visualizations.length / ITEMS_PER_PAGE)

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
              Interactive Tools
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
              Visualization Projects
            </h2>
            <p style={{
              fontSize: '18px',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.68)',
              maxWidth: '900px'
            }}>
              Custom visualization tools and interactive dashboards for CFD analysis and scientific computing.
              <span style={{ 
                color: 'hsl(140, 70%, 60%)', 
                fontWeight: '600',
                marginLeft: '8px'
              }}>
                Available on request.
              </span>
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
                width: '44px',
                height: '44px',
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
                    width: idx === currentPage ? '52px' : '36px',
                    height: '7px',
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
                width: '44px',
                height: '44px',
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
                  gridTemplateRows: 'repeat(2, 1fr)',
                  gap: '24px',
                  width: '100%',
                  height: 'fit-content',
                  maxHeight: '100%'
                }}>
                  {visualizations
                    .slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE)
                    .map((viz) => (
                      <div
                        key={viz.id}
                        onMouseEnter={() => setHoveredCard(viz.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{
                          position: 'relative',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          cursor: 'pointer'
                        }}
                        className="viz-card"
                      >
                        {/* WIP Ribbon */}
                        {viz.isWIP && (
                          <div style={{
                            position: 'absolute',
                            top: '16px',
                            left: '-32px',
                            transform: 'rotate(-45deg)',
                            background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
                            color: '#000',
                            padding: '4px 40px',
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            zIndex: 10,
                            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
                            border: '1px solid rgba(255, 215, 0, 0.6)',
                            borderLeft: 'none',
                            borderRight: 'none'
                          }}>
                            WIP
                          </div>
                        )}

                        {/* Screenshot Preview */}
                        <div style={{
                          width: '100%',
                          height: '220px',
                          background: `linear-gradient(135deg, ${viz.color}20, rgba(0, 0, 0, 0.4))`,
                          position: 'relative',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          {/* Placeholder for screenshot - replace with actual image */}
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '48px',
                            color: viz.color,
                            opacity: 0.3
                          }}>
                            📊
                          </div>

                          {/* Year Badge */}
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            padding: '6px 12px',
                            background: 'rgba(0, 0, 0, 0.8)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#fff'
                          }}>
                            {viz.year}
                          </div>

                          {/* Category Badge */}
                          <div style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '12px',
                            padding: '6px 12px',
                            background: 'rgba(0, 0, 0, 0.8)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: viz.color,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            border: `1px solid ${viz.color}60`
                          }}>
                            {viz.category}
                          </div>
                        </div>

                        {/* Content Area */}
                        <div style={{ 
                          padding: '20px',
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            marginBottom: '8px',
                            color: '#fff',
                            lineHeight: '1.3'
                          }}>
                            {viz.title}
                          </h3>

                          <p style={{
                            fontSize: '13px',
                            lineHeight: '1.6',
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: '16px',
                            flex: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {viz.description}
                          </p>

                          {/* Tech Stack */}
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                            marginBottom: '12px'
                          }}>
                            {viz.tech.map((tech, i) => (
                              <span
                                key={i}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: '500',
                                  background: 'rgba(255, 255, 255, 0.06)',
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          {/* Contact CTA */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            background: `${viz.color}10`,
                            borderRadius: '8px',
                            border: `1px solid ${viz.color}30`
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <div style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: viz.color,
                                boxShadow: `0 0 8px ${viz.color}`
                              }} />
                              <span style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: viz.color
                              }}>
                                Get in Touch
                              </span>
                            </div>
                            <svg 
                              width="14" 
                              height="14" 
                              viewBox="0 0 24 24" 
                              fill="none"
                              style={{
                                transition: 'transform 0.3s ease',
                                transform: hoveredCard === viz.id ? 'translateX(4px)' : 'translateX(0)'
                              }}
                            >
                              <path 
                                d="M5 12h14M12 5l7 7-7 7" 
                                stroke={viz.color} 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }

        .viz-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        button:not(:disabled):hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: scale(1.1);
        }

        @media (max-width: 1200px) {
          div[style*="grid-template-columns: repeat(3, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-template-rows: repeat(3, 1fr) !important;
          }
        }

        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto !important;
          }
        }
      `}</style>
    </>
  )
}