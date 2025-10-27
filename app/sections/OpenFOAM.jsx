'use client'

import { useState, useEffect, useRef } from 'react'

import SimulationModal from '../components/SimulationModal'

export default function OpenFOAMSection() {
  const [selectedSim, setSelectedSim] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const [scale, setScale] = useState(1)
  const scrollContainerRef = useRef(null)

  // Reference: 2560x1440 @ 100% scale
  const BASE_WIDTH = 2560
  const BASE_HEIGHT = 1440

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

  const simulations = [
    {
      id: 1,
      title: 'BubbleSim',
      category: 'Multiphase Flow',
      solver: 'interIsoFoam',
      year: '2024',
      description: 'Two-phase bubble dynamics simulation capturing interface evolution and surface tension effects using the Volume of Fluid (VOF) method.',
      specs: {
        turbulence: 'LAMINAR',
      },
      tags: ['VOF', 'Multiphase', 'Interface Tracking'],
      media: [
        { type: 'video', src: '/OpenFoam/BubbleSim/BubbleSim.mp4' },
      ],
      color: '#00c4b3',
      learnings: [
        'Implemented VOF method for interface tracking',
        'Optimized surface tension modeling',
        'Achieved stable bubble dynamics simulation'
      ]
    },
    {
      id: 2,
      title: 'F1 Aerodynamics',
      category: 'Vehicle Aerodynamics',
      solver: 'pimpleFoam',
      year: '2025',
      description: 'Aerodynamic analysis of a Formula 1 car under ground effect conditions. Simulated flow separation, diffuser efficiency, and pressure distribution.',
      specs: {
        turbulence: 'k-ω SST',
      },
      tags: ['CFD', 'Aerodynamics', 'Motorsport'],
      media: [
        { type: 'video', src: '/OpenFoam/F1/F1.mp4' },
      ],
      color: '#ff006e',
      learnings: [
        'Modeled ground effect aerodynamics',
        'Analyzed flow separation patterns',
        'Optimized diffuser efficiency'
      ]
    },
    {
      id: 3,
      title: 'FSAE Car Simulation',
      category: 'Vehicle Aerodynamics',
      solver: 'pimpleFoam',
      year: '2024',
      description: 'Flow simulation of a Formula SAE racecar to optimize aerodynamic balance and drag-to-lift ratio using transient PIMPLE coupling.',
      specs: {
        turbulence: 'k-ω SST',
      },
      tags: ['FSAE', 'Transient', 'Vehicle'],
      media: [
        { type: 'video', src: '/OpenFoam/FSAE Car Sim/DES-video-with-car-slower-fixed-Perspective-Q-Criterion.mp4' },
        { type: 'video', src: '/OpenFoam/FSAE Car Sim/LES-video-with-car-slower-fixed-perspective-Q-Criterion.mp4' },
        { type: 'video', src: '/OpenFoam/FSAE Car Sim/LES-With_VOR-Q-crit-4 Slowed.mp4' }
      ],
      color: '#00b4d8',
      learnings: [
        'Optimized aerodynamic balance',
        'Analyzed transient flow effects',
        'Improved drag-to-lift ratio'
      ]
    },
    {
      id: 4,
      title: 'Propeller Simulation',
      category: 'Aeroacoustics',
      solver: 'pimpleFoam',
      year: '2025',
      description: 'Unsteady simulation of rotating propeller blades capturing wake interaction and thrust generation under realistic RPM conditions.',
      specs: {
        turbulence: 'LES (WALE)',
      },
      tags: ['LES', 'Rotation', 'Propulsion'],
      media: [
        { type: 'video', src: '/OpenFoam/Propeller Simulation/Propeller Simulation.mp4' },
      ],
      color: '#48cae4',
      learnings: [
        'Implemented sliding mesh for rotation',
        'Captured wake interaction dynamics',
        'Analyzed thrust generation'
      ]
    },
    {
      id: 5,
      title: 'Engine Combustion',
      category: 'Combustion',
      solver: 'reactingFoam',
      year: '2024',
      description: 'Simplified combustion chamber simulation using detailed reaction mechanisms to predict flame propagation and heat release.',
      specs: {
        turbulence: 'LES (WALE)',
      },
      tags: ['Combustion', 'CHT', 'Energy'],
      media: [
        { type: 'video', src: '/Openfoam/Engine Combustion/Engine Combustion CO2.mp4' },
        { type: 'video', src: '/Openfoam/Engine Combustion/Engine Combustion CH4.mp4' },
      ],
      color: '#ff7b00',
      learnings: [
        'Modeled detailed reaction mechanisms',
        'Predicted flame propagation',
        'Analyzed heat release patterns'
      ]
    },
    {
      id: 6,
      title: 'Solar Panel Wind Load',
      category: 'Wind Engineering',
      solver: 'simpleFoam',
      year: '2024',
      description: 'Aerodynamic loading study on solar panels. RANS and transient PIMPLE simulations performed to determine optimal tilt-angle load characteristics.',
      specs: {
        turbulence: 'k-ε',
      },
      tags: ['Wind Load', 'ABL', 'Transient'],
      media: [
        { type: 'video', src: '/Openfoam/SolarPanel/SolarPanelBig (1).mp4' },
      ],
      color: '#90e0ef',
      learnings: [
        'Analyzed wind loading effects',
        'Optimized tilt angle',
        'Developed ABL profiles'
      ]
    },
    {
      id: 7,
      title: 'Stirred Tank Mixing',
      category: 'Multiphase Flow',
      solver: 'twoPhaseEulerFoam',
      year: '2023',
      description: 'Multiphase mixing simulation in a stirred tank using the MRF approach to model impeller rotation. Captured gas–liquid interaction and evaluated mixing efficiency and flow patterns.',
      specs: {
        cells: '~2M',
        turbulence: 'mixture k-ε',
        runtime: '36 hours',
        cores: '8'
      },
      tags: ['Mixing', 'MRF', 'Gas-Liquid'],
      media: [
        { type: 'video', src: '/OpenFoam/stirringTank/stirringTank.mp4' },
      ],
      color: '#00a896',
      learnings: [
        'Implemented MRF for impeller rotation',
        'Simulated gas–liquid flow behavior',
        'Analyzed mixing uniformity and turbulence characteristics'
      ]
    },
    {
      id: 8,
      title: 'Supersonic Airfoil',
      category: 'High-Speed Flow',
      solver: 'sonicFoam',
      year: '2025',
      description: 'Supersonic flow simulation over a wedge-type airfoil capturing shock formation, expansion fans, and pressure distribution at Mach 2.0.',
      specs: {
        cells: '~2.8M',
        turbulence: 'Spalart–Allmaras',
        runtime: '30 hours',
        cores: '8'
      },
      tags: ['Compressible', 'Shock', 'Supersonic'],
      media: [
        { type: 'video', src: '/OpenFoam/SupersonicAirfoil/SupersonicAirfoil U.mp4' },
        { type: 'video', src: '/OpenFoam/SupersonicAirfoil/SupersonicAirfoil p.mp4' },
      ],
      color: '#0077b6',
      learnings: [
        'Captured shock wave formation',
        'Analyzed expansion fans',
        'Validated supersonic flow physics'
      ]
    },
    {
      id: 9,
      title: 'Supersonic Prism',
      category: 'High-Speed Flow',
      solver: 'sonicFoam',
      year: '2025',
      description: 'Compressible flow past a sharp-edged prism generating oblique shock structures and expansion fans, analyzed for Mach 3 freestream.',
      specs: {
        cells: '~3.5M',
        turbulence: 'Spalart–Allmaras',
        runtime: '40 hours',
        cores: '8'
      },
      tags: ['Mach Flow', 'Shock Wave', 'Compressible'],
      media: [
        { type: 'video', src: '/openfoam/prism.mp4' },
        { type: 'image', src: '/openfoam/prism-1.jpg' }
      ],
      color: '#023e8a',
      learnings: [
        'Modeled oblique shock structures',
        'Analyzed Mach 3 flow features',
        'Captured expansion fan dynamics'
      ]
    },
    {
      id: 10,
      title: 'Water Droplet Impact',
      category: 'Multiphase Flow',
      solver: 'interIsoFoam',
      year: '2025',
      description: 'High-resolution simulation of a droplet impact event on a water surface capturing crown formation and secondary breakup dynamics.',
      specs: {
        cells: '~1.5M',
        turbulence: 'LES',
        runtime: '20 hours',
        cores: '8'
      },
      tags: ['Impact', 'VOF', 'Splash'],
      media: [
        { type: 'video', src: '/openfoam/waterdrop.mp4' },
        { type: 'image', src: '/openfoam/waterdrop-1.jpg' }
      ],
      color: '#00b4d8',
      learnings: [
        'Captured crown formation',
        'Analyzed secondary breakup',
        'High-resolution interface tracking'
      ]
    }
  ]

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