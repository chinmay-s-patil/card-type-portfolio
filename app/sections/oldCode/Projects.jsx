'use client'
import { useState, useEffect, useRef } from 'react'
import ProjectCard from '../components/ProjectCard'
import ProjectModal from '../components/ProjectModal'

import projectsList from '../consts/ProjectList'

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [scale, setScale] = useState(1)
  const scrollContainerRef = useRef(null)

  // Helper function to convert project title to URL slug
  const getProjectSlug = (project) => {
    return project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }

  // Handle deep linking on mount and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      const projectMatch = hash.match(/#projects#(.+)/)
      
      if (projectMatch) {
        const projectSlug = projectMatch[1]
        const project = projectsList.find(p => getProjectSlug(p) === projectSlug)
        
        if (project) {
          setSelectedProject(project)
        }
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Open project and update URL
  const openProject = (project) => {
    setSelectedProject(project)
    const slug = getProjectSlug(project)
    window.history.pushState(null, '', `#projects#${slug}`)
  }

  // Close project and clean URL
  const closeProject = () => {
    setSelectedProject(null)
    window.history.pushState(null, '', '#projects')
  }

  // Reference: 2560x1440 @ 100% scale
  const BASE_WIDTH = 1920
  const BASE_HEIGHT = 1080

  useEffect(() => {
    const calculateScale = () => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      const widthScale = viewportWidth / BASE_WIDTH
      const heightScale = viewportHeight / BASE_HEIGHT
      
      const newScale = Math.min(widthScale, heightScale)
      setScale(newScale)
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

  const projects = projectsList

  const PROJECTS_PER_PAGE = 6
  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE)
  
  const [currentPage, setCurrentPage] = useState(0)

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

  const scrollToPage = (pageIndex) => {
    const container = scrollContainerRef.current
    if (!container) return
    
    const containerWidth = container.clientWidth
    container.scrollTo({
      left: containerWidth * pageIndex,
      behavior: 'smooth'
    })
  }

  const goToNext = () => {
    if (currentPage < totalPages - 1) {
      scrollToPage(currentPage + 1)
    }
  }

  const goToPrevious = () => {
    if (currentPage > 0) {
      scrollToPage(currentPage - 1)
    }
  }

  return (
    <>
      <div style={{ 
        maxWidth: `${1400 * scale}px`,
        margin: '0 auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: `0 ${32 * scale}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top center'
      }}>
        {/* Header */}
        <div style={{ 
          flexShrink: 0, 
          marginBottom: `${24 * scale}px`
        }}>
          <div className="kicker" style={{
            fontSize: `${14 * scale}px`,
            marginBottom: `${12 * scale}px`
          }}>
            Portfolio
          </div>
          <h2 style={{
            fontSize: `${48 * scale}px`,
            fontWeight: '700',
            marginBottom: `${16 * scale}px`,
            background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.1'
          }}>
            Selected Projects
          </h2>
          <p className="muted" style={{ 
            maxWidth: '65ch',
            fontSize: `${16 * scale}px`,
            lineHeight: '1.6',
            marginBottom: `${16 * scale}px`
          }}>
            A showcase of computational fluid dynamics simulations, visualization tools, 
            and web applications that demonstrate my technical capabilities and problem-solving approach.
          </p>
        </div>

        {/* Navigation Controls */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: `${20 * scale}px`,
          marginBottom: `${24 * scale}px`,
          flexShrink: 0
        }}>
          <button
            onClick={goToPrevious}
            disabled={currentPage === 0}
            style={{
              width: `${44 * scale}px`,
              height: `${44 * scale}px`,
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
            className="nav-button-hover"
            aria-label="Previous page"
          >
            <svg width={20 * scale} height={20 * scale} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div style={{ 
            display: 'flex', 
            gap: `${10 * scale}px`,
            alignItems: 'center'
          }}>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToPage(idx)}
                style={{
                  width: idx === currentPage ? `${52 * scale}px` : `${36 * scale}px`,
                  height: `${7 * scale}px`,
                  borderRadius: `${4 * scale}px`,
                  background: idx === currentPage 
                    ? 'hsl(var(--accent))' 
                    : 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: idx === currentPage 
                    ? '0 0 12px hsl(var(--accent) / 0.5)' 
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
              width: `${44 * scale}px`,
              height: `${44 * scale}px`,
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
            className="nav-button-hover"
            aria-label="Next page"
          >
            <svg width={20 * scale} height={20 * scale} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Horizontal Scroll Container - ALL CONTENT VISIBLE */}
        <div 
          ref={scrollContainerRef}
          className="projects-scroll"
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
                width: '100%', 
                height: '100%',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div className="projects-grid" style={{
                  display: 'grid',
                  gap: `${24 * scale}px`,
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(2, 1fr)',
                  width: '100%',
                  height: 'fit-content',
                  maxHeight: '100%'
                }}>
                  {projects
                    .slice(pageIndex * PROJECTS_PER_PAGE, (pageIndex + 1) * PROJECTS_PER_PAGE)
                    .map((p, i) => (
                      <ProjectCard 
                        key={pageIndex * PROJECTS_PER_PAGE + i}
                        title={p.title}
                        period={p.period}
                        tags={p.tags}
                        onClick={() => openProject(p)}
                      />
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={closeProject} 
        />
      )}

      <style jsx>{`
        .projects-scroll::-webkit-scrollbar {
          display: none;
        }

        .nav-button-hover:not(:disabled):hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: scale(1.1);
        }

        /* Responsive grid breakpoints */
        @media (min-width: 1400px) {
          .projects-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            grid-template-rows: repeat(2, 1fr) !important;
          }
        }

        @media (min-width: 900px) and (max-width: 1399px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-template-rows: repeat(3, 1fr) !important;
          }
        }

        @media (max-width: 899px) {
          .projects-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto !important;
          }
        }

        .projects-grid > * {
          height: 100%;
          min-height: 0;
        }
      `}</style>
    </>
  )
}