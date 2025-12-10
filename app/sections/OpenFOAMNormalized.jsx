'use client'

import { useState, useEffect, useRef } from 'react'
import SimulationModal from '../components/SimulationModal'
import simulationsList from '../consts/OpenfoamList'

export default function OpenFOAMNormalized() {
  const [selectedSim, setSelectedSim] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const [scale, setScale] = useState(1)
  const scrollContainerRef = useRef(null)

  const BASE_WIDTH = 1920
  const BASE_HEIGHT = 1080
  const ITEMS_PER_PAGE = 3

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

  const simulations = simulationsList
  const solvers = ['all', ...new Set(simulations.map(s => s.solver))]
  
  const filteredSimulations = activeFilter === 'all' 
    ? simulations 
    : simulations.filter(s => s.solver === activeFilter)
  
  const totalPages = Math.ceil(filteredSimulations.length / ITEMS_PER_PAGE)

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(0)
  }, [activeFilter])

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

  const openModal = (sim) => {
    setSelectedSim(sim)
  }

  const closeModal = () => {
    setSelectedSim(null)
  }

  return (
    <>
      {/* Main scaled container */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
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
              Computational Fluid Dynamics
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
              OpenFOAM Simulations
            </h2>
            <p style={{
              fontSize: '18px',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.68)',
              maxWidth: '900px'
            }}>
              Production-grade CFD simulations showcasing advanced meshing strategies, turbulence modeling, 
              and high-performance computing workflows.
            </p>
          </div>

          {/* Solver Filter Pills */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '32px',
            flexShrink: 0
          }}>
            {solvers.map((solver) => (
              <button
                key={solver}
                onClick={() => setActiveFilter(solver)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: activeFilter === solver
                    ? 'linear-gradient(135deg, hsl(var(--accent), 0.25), hsl(var(--accent), 0.1))'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: activeFilter === solver
                    ? '2px solid hsl(var(--accent))'
                    : '2px solid rgba(255, 255, 255, 0.1)',
                  color: activeFilter === solver
                    ? 'hsl(var(--accent))'
                    : 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: activeFilter === solver
                    ? '0 6px 24px hsl(var(--accent) / 0.25)'
                    : 'none',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase'
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

            <div style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: 'rgba(255, 255, 255, 0.7)',
              minWidth: '80px',
              textAlign: 'center'
            }}>
              {filteredSimulations.length > 0 ? `${currentPage + 1} / ${totalPages}` : '0 / 0'}
            </div>

            <button
              onClick={() => scrollToPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: currentPage >= totalPages - 1 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: currentPage >= totalPages - 1 ? 0.3 : 1,
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
                    gap: '32px',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gridTemplateRows: '1fr',
                    width: '100%',
                    height: 'fit-content',
                    maxHeight: '100%'
                  }}>
                    {filteredSimulations
                      .slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE)
                      .map((sim) => (
                        <div
                          key={sim.id}
                          onClick={() => openModal(sim)}
                          style={{
                            position: 'relative',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                          }}
                          className="sim-card"
                        >
                          {/* Preview Area */}
                          <div style={{
                            width: '100%',
                            height: '240px',
                            background: `linear-gradient(135deg, ${sim.color}15, rgba(0, 0, 0, 0.4))`,
                            position: 'relative',
                            overflow: 'hidden',
                            flexShrink: 0
                          }}>
                            <div style={{
                              position: 'absolute',
                              inset: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '32px',
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
                              top: '12px',
                              left: '12px',
                              padding: '6px 12px',
                              background: 'rgba(0, 0, 0, 0.8)',
                              backdropFilter: 'blur(8px)',
                              borderRadius: '6px',
                              fontSize: '11px',
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
                              {sim.year}
                            </div>

                            {/* Category Badge */}
                            <div style={{
                              position: 'absolute',
                              bottom: '12px',
                              left: '12px',
                              padding: '6px 12px',
                              background: 'rgba(0, 0, 0, 0.7)',
                              backdropFilter: 'blur(4px)',
                              borderRadius: '6px',
                              fontSize: '11px',
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
                            padding: '20px 24px',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <h3 style={{
                              fontSize: '20px',
                              fontWeight: '700',
                              marginBottom: '12px',
                              color: '#fff',
                              lineHeight: '1.2'
                            }}>
                              {sim.title}
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
                              {sim.description}
                            </p>

                            {/* Mini Specs Grid */}
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: '8px',
                              marginBottom: '16px',
                              padding: '12px',
                              background: 'rgba(0, 0, 0, 0.3)',
                              borderRadius: '8px',
                              border: '1px solid rgba(255, 255, 255, 0.05)'
                            }}>
                              <div>
                                <div style={{
                                  fontSize: '10px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                  color: 'rgba(255, 255, 255, 0.5)',
                                  marginBottom: '4px'
                                }}>
                                  Mesh
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  color: sim.color,
                                  fontFamily: 'monospace'
                                }}>
                                  {sim.specs.cells || 'N/A'}
                                </div>
                              </div>
                              <div>
                                <div style={{
                                  fontSize: '10px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                  color: 'rgba(255, 255, 255, 0.5)',
                                  marginBottom: '4px'
                                }}>
                                  Model
                                </div>
                                <div style={{
                                  fontSize: '12px',
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
                              gap: '8px'
                            }}>
                              {sim.tags.slice(0, 3).map((tag, i) => (
                                <span
                                  key={i}
                                  style={{
                                    padding: '5px 10px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
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
                            bottom: '16px',
                            right: '16px',
                            width: '32px',
                            height: '32px',
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
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M9 18L15 12L9 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedSim && (
        <SimulationModal 
          simulation={selectedSim} 
          onClose={closeModal} 
        />
      )}

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }

        .sim-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        .sim-card:hover .card-arrow {
          opacity: 1;
          background: hsl(var(--accent));
        }

        .filter-pill:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          transform: translateY(-2px);
        }

        button:not(:disabled):hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: scale(1.1);
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