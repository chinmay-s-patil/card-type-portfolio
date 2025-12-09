'use client'

import { useState, useEffect, useRef } from 'react'

import SimulationModal from '../components/SimulationModal'

import simulationsList from '../consts/OpenfoamList'

export default function OpenFOAMSection() {
  const [selectedSim, setSelectedSim] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const [scale, setScale] = useState(1)
  const scrollContainerRef = useRef(null)

  // Reference: 2560x1440 @ 100% scale
  const BASE_WIDTH = 1920
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

  const simulations = simulationsList

  // Get unique solvers for filter
  const solvers = ['all', ...new Set(simulations.map(s => s.solver))]

  // Filter simulations based on active solver
  const filteredSimulations = activeFilter === 'all' 
    ? simulations 
    : simulations.filter(s => s.solver === activeFilter)

  const itemsPerPage = 3
  const totalPages = Math.ceil(filteredSimulations.length / itemsPerPage)

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(0)
  }, [activeFilter])

  // Scroll to specific page
  const scrollToPage = (pageIndex) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const cardWidth = container.scrollWidth / filteredSimulations.length
      const scrollPosition = pageIndex * itemsPerPage * cardWidth
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' })
      setCurrentPage(pageIndex)
    }
  }

  const scrollLeft = () => {
    if (currentPage > 0) {
      scrollToPage(currentPage - 1)
    }
  }

  const scrollRight = () => {
    if (currentPage < totalPages - 1) {
      scrollToPage(currentPage + 1)
    }
  }

  return (
    <>
      <div style={{ 
        maxWidth: `${1600 * scale}px`,
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
          marginBottom: `${32 * scale}px` 
        }}>
          <div className="kicker" style={{
            fontSize: `${14 * scale}px`,
            marginBottom: `${12 * scale}px`,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: '900'
          }}>
            Computational Fluid Dynamics
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
            OpenFOAM Simulations
          </h2>
          <p style={{ 
            maxWidth: '65ch',
            fontSize: `${18 * scale}px`,
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            Production-grade CFD simulations showcasing advanced meshing strategies, turbulence modeling, 
            and high-performance computing workflows.
          </p>
        </div>

        {/* Solver Filter Pills */}
        <div style={{
          display: 'flex',
          gap: `${12 * scale}px`,
          marginBottom: `${32 * scale}px`,
          overflowX: 'auto',
          scrollbarWidth: 'thin',
          paddingBottom: `${8 * scale}px`,
          flexShrink: 0
        }}>
          {solvers.map((solver) => (
            <button
              key={solver}
              onClick={() => setActiveFilter(solver)}
              style={{
                padding: `${10 * scale}px ${24 * scale}px`,
                borderRadius: `${10 * scale}px`,
                fontSize: `${14 * scale}px`,
                fontWeight: '600',
                background: activeFilter === solver
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(59, 130, 246, 0.1))'
                  : 'rgba(255, 255, 255, 0.05)',
                border: activeFilter === solver
                  ? '2px solid rgb(59, 130, 246)'
                  : '2px solid rgba(255, 255, 255, 0.1)',
                color: activeFilter === solver
                  ? 'rgb(59, 130, 246)'
                  : 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: activeFilter === solver
                  ? `0 ${6 * scale}px ${24 * scale}px rgba(59, 130, 246, 0.25)`
                  : 'none',
                whiteSpace: 'nowrap',
                fontFamily: 'monospace'
              }}
              className="filter-pill"
            >
              {solver}
            </button>
          ))}
        </div>

        {/* Navigation Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: `${16 * scale}px`,
          marginBottom: `${32 * scale}px`,
          flexShrink: 0
        }}>
          <button
            onClick={scrollLeft}
            disabled={currentPage === 0}
            style={{
              width: `${44 * scale}px`,
              height: `${44 * scale}px`,
              borderRadius: '50%',
              background: currentPage === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              opacity: currentPage === 0 ? 0.3 : 1
            }}
            className="scroll-button"
            aria-label="Previous page"
          >
            <svg width={20 * scale} height={20 * scale} viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div style={{
            fontSize: `${14 * scale}px`,
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.7)',
            minWidth: `${80 * scale}px`,
            textAlign: 'center'
          }}>
            {filteredSimulations.length > 0 ? `${currentPage + 1} / ${totalPages}` : '0 / 0'}
          </div>

          <button
            onClick={scrollRight}
            disabled={currentPage >= totalPages - 1}
            style={{
              width: `${44 * scale}px`,
              height: `${44 * scale}px`,
              borderRadius: '50%',
              background: currentPage >= totalPages - 1 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              opacity: currentPage >= totalPages - 1 ? 0.3 : 1
            }}
            className="scroll-button"
            aria-label="Next page"
          >
            <svg width={20 * scale} height={20 * scale} viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Horizontal Scrolling Container */}
        <div
          ref={scrollContainerRef}
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: 'calc(33.333% - 1.33rem)',
            gap: `${32 * scale}px`,
            overflowX: 'hidden',
            scrollbarWidth: 'none',
            paddingBottom: `${16 * scale}px`,
            flex: 1,
            alignItems: 'stretch'
          }}
          className="openfoam-scroll"
        >
          {filteredSimulations.map((sim) => (
            <div
              key={sim.id}
              onClick={() => setSelectedSim(sim)}
              style={{
                position: 'relative',
                borderRadius: `${16 * scale}px`,
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column'
              }}
              className="sim-card-horizontal"
            >
              {/* Preview Area */}
              <div style={{
                width: '100%',
                height: `${240 * scale}px`,
                background: `linear-gradient(135deg, ${sim.color}15, rgba(0, 0, 0, 0.4))`,
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {/* Placeholder */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: `${32 * scale}px`,
                  fontWeight: '900',
                  color: sim.color,
                  opacity: 0.2,
                  fontFamily: 'monospace'
                }}>
                  {sim.solver}
                </div>

                {/* Solver Badge */}
                <div style={{
                  position: 'absolute',
                  top: `${12 * scale}px`,
                  left: `${12 * scale}px`,
                  padding: `${6 * scale}px ${12 * scale}px`,
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: `${6 * scale}px`,
                  fontSize: `${11 * scale}px`,
                  fontWeight: '700',
                  color: sim.color,
                  border: `1px solid ${sim.color}60`,
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {sim.solver}
                </div>

                {/* Year Badge */}
                <div style={{
                  position: 'absolute',
                  top: `${12 * scale}px`,
                  right: `${12 * scale}px`,
                  padding: `${6 * scale}px ${12 * scale}px`,
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: `${6 * scale}px`,
                  fontSize: `${12 * scale}px`,
                  fontWeight: '700',
                  color: '#fff'
                }}>
                  {sim.year}
                </div>

                {/* Category Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: `${12 * scale}px`,
                  left: `${12 * scale}px`,
                  padding: `${6 * scale}px ${12 * scale}px`,
                  background: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: `${6 * scale}px`,
                  fontSize: `${11 * scale}px`,
                  fontWeight: '600',
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {sim.category}
                </div>
              </div>

              {/* Content Area */}
              <div style={{ 
                padding: `${20 * scale}px ${24 * scale}px`,
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Title */}
                <h3 style={{
                  fontSize: `${20 * scale}px`,
                  fontWeight: '700',
                  marginBottom: `${12 * scale}px`,
                  color: '#fff',
                  lineHeight: '1.2'
                }}>
                  {sim.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: `${14 * scale}px`,
                  lineHeight: '1.6',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: `${16 * scale}px`,
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {sim.description}
                </p>

                {/* Mini Specs Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: `${8 * scale}px`,
                  marginBottom: `${16 * scale}px`,
                  padding: `${12 * scale}px`,
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: `${8 * scale}px`,
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div>
                    <div style={{
                      fontSize: `${10 * scale}px`,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginBottom: `${4 * scale}px`
                    }}>
                      Mesh
                    </div>
                    <div style={{
                      fontSize: `${12 * scale}px`,
                      fontWeight: '600',
                      color: sim.color,
                      fontFamily: 'monospace'
                    }}>
                      {sim.specs.cells || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: `${10 * scale}px`,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginBottom: `${4 * scale}px`
                    }}>
                      Model
                    </div>
                    <div style={{
                      fontSize: `${12 * scale}px`,
                      fontWeight: '600',
                      color: sim.color,
                      fontFamily: 'monospace'
                    }}>
                      {sim.specs.turbulence}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: `${8 * scale}px`
                }}>
                  {sim.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        padding: `${5 * scale}px ${10 * scale}px`,
                        borderRadius: `${6 * scale}px`,
                        fontSize: `${11 * scale}px`,
                        fontWeight: '500',
                        background: `${sim.color}15`,
                        color: sim.color,
                        border: `1px solid ${sim.color}30`
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover Indicator */}
              <div style={{
                position: 'absolute',
                bottom: `${16 * scale}px`,
                right: `${16 * scale}px`,
                width: `${32 * scale}px`,
                height: `${32 * scale}px`,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'all 0.3s ease',
                pointerEvents: 'none'
              }}
              className="card-arrow"
              >
                <svg width={16 * scale} height={16 * scale} viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedSim && (
        <SimulationModal 
          simulation={selectedSim} 
          onClose={() => setSelectedSim(null)} 
        />
      )}

      <style jsx>{`
        .openfoam-scroll::-webkit-scrollbar {
          display: none;
        }

        .sim-card-horizontal:hover {
          transform: translateY(-6px);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        .sim-card-horizontal:hover .card-arrow {
          opacity: 1;
          background: rgb(59, 130, 246);
        }

        .scroll-button:not(:disabled):hover {
          background: rgba(255, 255, 255, 0.15);
          transform: scale(1.1);
        }

        .filter-pill:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          transform: translateY(-2px);
        }

        @media (max-width: 1024px) {
          .openfoam-scroll {
            grid-auto-columns: calc(50% - 0.75rem) !important;
          }
        }

        @media (max-width: 768px) {
          .openfoam-scroll {
            grid-auto-columns: 100% !important;
          }
        }
      `}</style>
    </>
  )
}