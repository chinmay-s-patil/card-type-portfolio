

'use client'

import { useState, useEffect, useRef } from 'react'
import STLViewerModal from '../components/STLViewerModal'
import CADList from '../consts/CADList'

export default function CADNormalized() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [scale, setScale] = useState(1)
  const [currentPage, setCurrentPage] = useState(0)
  const scrollContainerRef = useRef(null)
  
  const BASE_WIDTH = 1920
  const BASE_HEIGHT = 1080
  const PROJECTS_PER_PAGE = 4

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

  const projects = CADList
  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE)

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

  const openProject = (project) => {
    setSelectedProject(project)
  }

  const closeProject = () => {
    setSelectedProject(null)
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
              color: 'hsl(30, 100%, 60%)',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              3D Design Portfolio
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
              CAD Projects
            </h2>
            <p style={{
              fontSize: '18px',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.68)',
              maxWidth: '900px'
            }}>
              Explore my mechanical design work — from precision engineering to creative product design. 
              Click any project to view and interact with the 3D model.
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
                    background: idx === currentPage ? 'hsl(30, 100%, 60%)' : 'rgba(255, 255, 255, 0.15)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: idx === currentPage ? '0 0 12px hsl(30, 100%, 60% / 0.5)' : 'none'
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
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gridTemplateRows: 'repeat(2, 1fr)',
                  gap: '24px',
                  width: '100%',
                  height: 'fit-content',
                  maxHeight: '100%'
                }}>
                  {projects
                    .slice(pageIndex * PROJECTS_PER_PAGE, (pageIndex + 1) * PROJECTS_PER_PAGE)
                    .map((project) => (
                      <div
                        key={project.id}
                        onClick={() => openProject(project)}
                        style={{
                          position: 'relative',
                          borderRadius: '20px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                          border: '2px solid rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                        }}
                        className="cad-card"
                      >
                        {/* Image Container with Overlay */}
                        <div style={{
                          position: 'relative',
                          width: '100%',
                          height: '240px',
                          overflow: 'hidden',
                          background: '#000'
                        }}>
                          <img
                            src={project.coverPhoto}
                            alt={project.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.4s ease'
                            }}
                            className="cad-image"
                          />
                          
                          {/* Gradient Overlay */}
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: `linear-gradient(180deg, transparent 0%, ${project.color}40 100%)`,
                            opacity: 0,
                            transition: 'opacity 0.4s ease'
                          }}
                          className="gradient-overlay"
                          />

                          {/* 3D Icon Badge */}
                          <div style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(0, 0, 0, 0.8)',
                            backdropFilter: 'blur(8px)',
                            border: `2px solid ${project.color}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 4px 12px ${project.color}50`
                          }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={project.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M2 17L12 22L22 17" stroke={project.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M2 12L12 17L22 12" stroke={project.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>

                          {/* Year Badge */}
                          <div style={{
                            position: 'absolute',
                            top: '16px',
                            left: '16px',
                            padding: '6px 12px',
                            background: 'rgba(0, 0, 0, 0.8)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '700',
                            color: project.color,
                            border: `1px solid ${project.color}40`
                          }}>
                            {project.year}
                          </div>

                          {/* View 3D Label */}
                          <div style={{
                            position: 'absolute',
                            bottom: '16px',
                            left: '50%',
                            transform: 'translateX(-50%) translateY(10px)',
                            padding: '10px 20px',
                            background: project.color,
                            color: '#0a0e1a',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: '700',
                            opacity: 0,
                            transition: 'all 0.4s ease',
                            boxShadow: `0 4px 16px ${project.color}60`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          className="view-3d-label"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            View in 3D
                          </div>
                        </div>

                        {/* Content */}
                        <div style={{ 
                          padding: '20px 24px',
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <div style={{
                            fontSize: '12px',
                            color: project.color,
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '8px'
                          }}>
                            {project.category}
                          </div>

                          <h3 style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            marginBottom: '12px',
                            color: '#fff',
                            lineHeight: '1.2'
                          }}>
                            {project.title}
                          </h3>

                          <p style={{
                            fontSize: '14px',
                            lineHeight: '1.6',
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: '16px',
                            flex: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {project.description}
                          </p>

                          {/* Tags */}
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px'
                          }}>
                            {project.tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: '500',
                                  background: 'rgba(255, 255, 255, 0.08)',
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  border: '1px solid rgba(255, 255, 255, 0.15)'
                                }}
                              >
                                {tag}
                              </span>
                            ))}
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

      {selectedProject && (
        <STLViewerModal 
          project={selectedProject} 
          onClose={closeProject} 
        />
      )}

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }

        .cad-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }

        .cad-card:hover .cad-image {
          transform: scale(1.1);
        }

        .cad-card:hover .gradient-overlay {
          opacity: 1;
        }

        .cad-card:hover .view-3d-label {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        button:not(:disabled):hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: scale(1.1);
        }

        @media (max-width: 1200px) {
          div[style*="grid-template-columns: repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto !important;
          }
        }
      `}</style>
    </>
  )
}