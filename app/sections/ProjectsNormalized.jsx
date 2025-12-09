'use client'

import { useState, useEffect, useRef } from 'react'
import ProjectCard from '../components/ProjectCard'
import ProjectModal from '../components/ProjectModal'
import projectsList from '../consts/ProjectList'

export default function ProjectsNormalized() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [scale, setScale] = useState(1)
  const [activeCategory, setActiveCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const scrollContainerRef = useRef(null)
  
  const BASE_WIDTH = 1920
  const BASE_HEIGHT = 1080
  const PROJECTS_PER_PAGE = 6

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

  // Extract unique categories from all category arrays (flatMap for multi-category support)
  const allCategories = projectsList.flatMap(p => 
    Array.isArray(p.category) ? p.category : [p.category]
  )
  const categories = ['all', ...new Set(allCategories.filter(Boolean))]
  
  const projects = projectsList
  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => {
        // Handle multi-category projects
        const projectCategories = Array.isArray(p.category) ? p.category : [p.category]
        return projectCategories.includes(activeCategory)
      })
  
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE)

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(0)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0
    }
  }, [activeCategory])

  // Deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      const projectMatch = hash.match(/#projects#(.+)/)
      
      if (projectMatch) {
        const projectSlug = projectMatch[1]
        const project = projects.find(p => 
          p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === projectSlug
        )
        if (project) setSelectedProject(project)
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [projects])

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
    const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    window.history.pushState(null, '', `#projects#${slug}`)
  }

  const closeProject = () => {
    setSelectedProject(null)
    window.history.pushState(null, '', '#projects')
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
              Portfolio
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
              Selected Projects
            </h2>
            <p style={{
              fontSize: '18px',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.68)',
              maxWidth: '900px'
            }}>
              A showcase of computational fluid dynamics simulations, visualization tools, 
              and web applications that demonstrate my technical capabilities.
            </p>
          </div>

          {/* Category Filter Pills - with horizontal scroll and more margin */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '16px', // Added top margin for glow effect
            marginBottom: '32px', // Increased bottom margin
            flexShrink: 0,
            overflowX: 'auto', // Enable horizontal scrolling
            paddingBottom: '8px',
            scrollbarWidth: 'none', // Hide scrollbar for Firefox
            msOverflowStyle: 'none' // Hide scrollbar for IE/Edge
          }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: activeCategory === category
                    ? 'linear-gradient(135deg, hsl(var(--accent), 0.25), hsl(var(--accent), 0.1))'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: activeCategory === category
                    ? '2px solid hsl(var(--accent))'
                    : '2px solid rgba(255, 255, 255, 0.1)',
                  color: activeCategory === category
                    ? 'hsl(var(--accent))'
                    : 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: activeCategory === category
                    ? '0 6px 24px hsl(var(--accent) / 0.25)'
                    : 'none',
                  textTransform: 'capitalize', // Capitalize category names
                  whiteSpace: 'nowrap' // Prevent text wrapping
                }}
              >
                {category}
              </button>
            ))}
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
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    display: 'grid',
                    gap: '24px',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gridTemplateRows: 'repeat(2, 1fr)',
                    width: '100%',
                    height: 'fit-content',
                    maxHeight: '100%'
                  }}>
                    {filteredProjects
                      .slice(pageIndex * PROJECTS_PER_PAGE, (pageIndex + 1) * PROJECTS_PER_PAGE)
                      .map((p, i) => (
                        <ProjectCard 
                          key={`${p.title}-${i}`}
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
      </div>

      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={closeProject} 
        />
      )}

      <style jsx>{`
        /* Hide category scrollbar for WebKit browsers */
        div::-webkit-scrollbar {
          display: none;
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