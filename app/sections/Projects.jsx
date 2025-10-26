'use client'
import { useState, useEffect, useRef } from 'react'
import ProjectCard from '../components/ProjectCard'
import ProjectModal from '../components/ProjectModal'

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [scale, setScale] = useState(1)
  const scrollContainerRef = useRef(null)

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

  const projects = [
    {
      title: 'Optimization of Pyrolysis-Based Plastic Oil Yield',
      category: 'B.Tech Thesis',
      subtitle: 'ML Model · Experimental Analysis',
      period: 'Jul 2024 — Jan 2025',
      description: 'Designed and executed Taguchi-based pyrolysis experiments on HDPE, PS, and blended feeds to maximize oil conversion. Characterized feedstocks via TGA, SEM-EDAX, and analyzed pyrolysis oils with GC-MS. Implemented and benchmarked five ML models, achieving up to 95.96% R² for yield prediction.',
      learnings: [
        'Designed DOE experiments using Taguchi methodology',
        'Built ML models with 95.96% R² accuracy',
        'Analyzed materials with TGA, SEM-EDAX, GC-MS'
      ],
      tags: ['Alternative Fuels', 'Machine Learning', 'Thermal', 'Experimental Design'],
      media: [
        { type: 'image', src: '/Projects/Pyrolysis of Plastics/Pyrolysis of Plastics (1).jpg'},
        { type: 'image', src: '/Projects/Pyrolysis of Plastics/Pyrolysis of Plastics (2).jpg'},
        { type: 'image', src: '/Projects/Pyrolysis of Plastics/Pyrolysis of Plastics (3).jpg'},
        { type: 'image', src: '/Projects/Pyrolysis of Plastics/Pyrolysis of Plastics (4).jpg'},
        { type: 'image', src: '/Projects/Pyrolysis of Plastics/Pyrolysis of Plastics (5).jpg'},
        { type: 'image', src: '/Projects/Pyrolysis of Plastics/Pyrolysis of Plastics (6).jpg'},
      ],
      href: '#'
    },
    {
      title: 'Hybrid Battery Cooling Mechanism',
      category: 'Thermal Management',
      subtitle: 'Ansys CFD · SolidWorks',
      period: 'Jul 2024 — Jan 2025',
      description: 'Developed a thermal management system using TIM, PCM, and liquid coolant to enhance battery performance. Utilized SolidWorks for 3D design and Ansys for simulation, realizing a 67.31% improvement in cooling efficiency.',
      learnings: [
        'Achieved 67.31% cooling efficiency improvement',
        'Integrated TIM, PCM, and liquid coolant systems',
        'Performed transient thermal CFD analysis'
      ],
      tags: ['Thermal Management', 'CFD', 'Batteries', 'Ansys'],
      media: [
        { type: 'image', src: '/Projects/Battery Thermal Management System/Battery Thermal Management System (1).jpg' },
        { type: 'image', src: '/Projects/Battery Thermal Management System/Battery Thermal Management System (2).jpg' },
        { type: 'image', src: '/Projects/Battery Thermal Management System/Battery Thermal Management System (3).jpg' },
        { type: 'image', src: '/Projects/Battery Thermal Management System/Battery Thermal Management System (4).jpg' }
      ],
    },
    {
      title: 'Reverse Engineering S500 Drone',
      category: '3D Scanning & CAD',
      subtitle: '3D Scanning · Geomagic',
      period: 'Jan 2024 — Mar 2024',
      description: 'Captured detailed 3D scans and rebuilt a SolidWorks model with 0.01mm tolerance for the S500 drone, including full assembly validation against kit documentation.',
      learnings: [
        'Performed high-precision 3D scanning',
        'CAD reconstruction with 0.01mm tolerance',
        'Full assembly validation and documentation'
      ],
      tags: ['Reverse Engineering', 'CAD', 'SolidWorks', '3D Scanning'],
      media: [
        { type: 'image', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (1).jpg' },
        { type: 'video', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (1).mp4' },
        { type: 'image', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (2).jpg' },
        { type: 'video', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (2).mp4' },
        { type: 'image', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (3).jpg' },
        { type: 'video', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (3).mp4' },
        { type: 'image', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (4).jpg' },
        { type: 'video', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (4).mp4' },
        { type: 'image', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (5).jpg' },
        { type: 'video', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (5).mp4' },
        { type: 'image', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (6).jpg' },
        { type: 'image', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (7).jpg' },
      ],
      href: '#'
    },
    {
      title: 'CFD Evaluation of Drone Propeller Downwash',
      category: 'Aerodynamics',
      subtitle: 'OpenFOAM · Flow Analysis',
      period: 'Jan 2025 — Feb 2025',
      description: 'Simulated drone propeller downwash in OpenFOAM. Quantified lift coefficient distribution and provided design recommendations for improved flight stability.',
      learnings: [
        'Simulated propeller aerodynamics in OpenFOAM',
        'Quantified downwash effects on lift coefficient',
        'Developed design optimization recommendations'
      ],
      tags: ['CFD', 'Aerodynamics', 'OpenFOAM', 'Propeller'],
      media: [
        { type: 'image', src: '/Projects/CFD Evaluation of Drone Propeller Downwash/CFD Evaluation of Drone Propeller Downwash.mp4' }
      ],
      href: '#'
    },
    {
      title: 'Wind Turbine Simulation in StarCCM+',
      category: 'Renewable Energy',
      subtitle: 'StarCCM+ · CFD Simulation',
      period: 'Oct 2024',
      description: 'Performed a detailed CFD simulation of a wind turbine using StarCCM+. The simulation included mesh generation, setup of physics models, and boundary conditions to analyze aerodynamic performance. A video of the simulation will be incorporated to demonstrate results and workflow.',
      learnings: [
        'Set up a high-quality CFD mesh in StarCCM+',
        'Configured fluid continuum and boundary conditions',
        'Analyzed aerodynamic performance characteristics'
      ],
      tags: ['CFD', 'Wind Energy', 'StarCCM+', 'Simulation'],
      media: [
        { type: 'video', src: '/Projects/Wind Turbine Simulation/Wind Turbine Simulation.mp4' }
      ],
      href: '#'
    },
    {
      title: 'Solar Parapet Roof Panel Aerodynamics',
      category: 'Building CFD',
      subtitle: 'OpenFOAM · Custom ABL',
      period: 'Mar 2025',
      description: 'Simulated wind loads on parapet roof-mounted solar panels in OpenFOAM using custom atmospheric boundary layer conditions. Assessed parapet height effects for durable installations.',
      learnings: [
        'Developed custom ABL boundary conditions',
        'Analyzed wind load distribution on solar arrays',
        'Evaluated parapet height effects on sheltering'
      ],
      tags: ['CFD', 'Solar', 'Building', 'OpenFOAM'],
      media: [
        { type: 'image', src: '/projects/solar-parapet.jpg' }
      ],
      href: '#'
    },
    {
      title: 'Propeller Aeroacoustics Study',
      category: 'Acoustics',
      subtitle: 'LES · FW-H · Ansys Fluent',
      period: 'Apr 2025',
      description: 'LES-based aeroacoustic simulations of propellers in ANSYS Fluent using sliding mesh and FW-H analogy. Compared acoustic performance of standard, foldable, and toroidal geometries at multiple receiver locations.',
      learnings: [
        'Performed LES with sliding mesh technique',
        'Applied FW-H analogy for noise prediction',
        'Compared acoustic performance of multiple designs'
      ],
      tags: ['Aeroacoustics', 'Noise', 'CFD', 'LES', 'Ansys'],
      media: [
        { type: 'image', src: '/projects/propeller-acoustics.jpg' }
      ],
      href: '#'
    },
    {
      title: 'Natural Gas Combustion Simulation',
      category: 'Combustion',
      subtitle: 'OpenFOAM · AMR',
      period: 'May 2025 — Present',
      description: 'Simulating combustion of Indian natural gas on a stove burner in OpenFOAM using adaptive mesh refinement. Investigating flame structure, pollutant formation, and efficiency under varying burner configurations.',
      learnings: [
        'Implemented adaptive mesh refinement for combustion',
        'Modeled pollutant formation and emissions',
        'Optimized burner design for efficiency'
      ],
      tags: ['Combustion', 'CFD', 'Energy', 'OpenFOAM'],
      media: [
        { type: 'image', src: '/projects/combustion.jpg' }
      ],
      href: '#'
    },
    {
      title: 'Laser Bed Powder Fusion Simulations',
      category: 'Additive Manufacturing',
      subtitle: 'Process Analysis · Thermal',
      period: 'Nov 2024 — Feb 2025',
      description: 'Simulated melting, solidification, and microstructure evolution during LBPF additive manufacturing. Evaluated how laser and powder parameters impact defect rate and mechanical properties.',
      learnings: [
        'Simulated LBPF melting and solidification',
        'Analyzed microstructure evolution',
        'Optimized process parameters for quality'
      ],
      tags: ['Additive Manufacturing', 'Thermal', 'Materials', 'Process'],
      media: [
        { type: 'image', src: '/projects/lbpf.jpg' }
      ],
      href: '#'
    },
    {
      title: 'Immersion Cooling in Battery Thermal Management',
      category: 'Thermal Systems',
      subtitle: 'Parametric Study · OpenFOAM',
      period: 'Nov 2024 — Feb 2025',
      description: 'Parametric analysis of coolant type, C-rating, and inlet velocity for battery cooling in OpenFOAM. Achieved a 43.99% temperature reduction with optimal configuration.',
      learnings: [
        'Conducted parametric thermal analysis',
        'Achieved 43.99% temperature improvement',
        'Compared multiple coolant configurations'
      ],
      tags: ['Thermal', 'Batteries', 'CFD', 'OpenFOAM'],
      media: [
        { type: 'image', src: '/projects/immersion-cooling.jpg' }
      ],
      href: '#'
    },
    {
      title: 'Simulation of Truck Platooning',
      category: 'Vehicle Aerodynamics',
      subtitle: 'OpenFOAM · Drag Reduction',
      period: 'Nov 2024 — Feb 2025',
      description: 'CFD simulation in OpenFOAM studying aerodynamic interactions in truck platooning. Investigated drag reduction and fuel efficiency improvements with optimal vehicle spacing.',
      learnings: [
        'Quantified drag reduction in platooning',
        'Optimized vehicle spacing for efficiency',
        'Analyzed wake interactions between vehicles'
      ],
      tags: ['CFD', 'Transport', 'Optimization', 'OpenFOAM'],
      media: [
        { type: 'image', src: '/projects/truck-platoon.jpg' }
      ],
      href: '#'
    },
    {
      title: 'PINN for CFD Simulations',
      category: 'Machine Learning',
      subtitle: 'Physics-Informed Neural Net',
      period: 'Dec 2024 — Mar 2024',
      description: 'Developed a Physics-Informed Neural Network model for simulating flow around a cylinder. Explored variable geometry embedding and model validation against classical CFD.',
      learnings: [
        'Developed PINN for fluid dynamics',
        'Trained model on cylinder flow physics',
        'Validated against traditional CFD results'
      ],
      tags: ['Machine Learning', 'CFD', 'Physics', 'Neural Networks'],
      media: [
        { type: 'image', src: '/projects/pinn.jpg' }
      ],
      href: '#'
    },
    {
      title: 'Bullet Impact Simulations',
      category: 'Impact Dynamics',
      subtitle: 'Abaqus · FEA',
      period: 'Dec 2024 — Present',
      description: 'Explicit dynamics simulation of bullet impact on bolted plates using Abaqus. Evaluated stress distribution, deformation, and ballistic resistance to support protective structure design.',
      learnings: [
        'Performed explicit dynamics simulation in Abaqus',
        'Analyzed high-velocity impact mechanics',
        'Evaluated stress and deformation patterns'
      ],
      tags: ['Impact', 'FEA', 'Materials', 'Abaqus'],
      media: [
        { type: 'image', src: '/Projects/Bullet Impact Simulations/Bullet Impact Simulations (1).avi' },
        { type: 'image', src: '/Projects/Bullet Impact Simulations/Bullet Impact Simulations (2).avi' }
      ],
      href: '#'
    },
    {
      title: 'Aerodynamics of Ground-Mounted Solar Arrays',
      category: 'Renewable Energy',
      subtitle: 'CFD · Pressure Mapping',
      period: 'Dec 2024 — Feb 2025',
      description: 'Steady-state and transient CFD mapping of pressure and force on solar panel arrays. Assessment guided design for optimized structural durability and cost-efficiency.',
      learnings: [
        'Mapped pressure distributions on solar arrays',
        'Performed transient wind load analysis',
        'Optimized panel orientation for loading'
      ],
      tags: ['CFD', 'Solar', 'Optimization', 'Wind Loading'],
      media: [
        { type: 'video', src: '/Projects/Aerodynamics of Ground-Mounted Solar Arrays/Aerodynamics of Ground-Mounted Solar Arrays.mp4' }
      ],
      href: '#'
    },
    {
      title: 'CAD Model of Solar Vortex Engine',
      category: 'Design Engineering',
      subtitle: 'SolidWorks · Precision Modeling',
      period: 'Sept 2024',
      description: 'Designed research-grade CAD model of Solar Vortex Engine with 1mm tolerance for CFD baseline and future parametric optimization.',
      learnings: [
        'Developed detailed CAD model with 1mm tolerance',
        'Incorporated research-based design standards',
        'Created parametric model for optimization'
      ],
      tags: ['CAD', 'Design', 'Energy', 'SolidWorks'],
      media: [
        { type: 'image', src: 'Projects/SVE/SVE (1).png' },
        { type: 'image', src: 'Projects/SVE/SVE (2).png' }
      ],
      href: '#'
    },
    {
      title: 'Wind Tunnel Test Section Modeling',
      category: 'Experimental Setup',
      subtitle: 'SolidWorks · Precision CAD',
      period: 'Jan 2024',
      description: '3D modeled a wind tunnel test section in SolidWorks from field measurements, maintaining 0.01mm tolerance for experimental reliability.',
      learnings: [
        'Precision modeling with 0.01mm tolerance',
        'Field measurement to CAD workflow',
        'Design for instrumentation integration'
      ],
      tags: ['CAD', 'Experiment', 'Aerodynamics', 'SolidWorks'],
      media: [
        { type: 'image', src: 'Projects/CAD Modeling of Wind Tunnel Test Section/CAD Modeling of Wind Tunnel Test Section.jpg' },
        { type: 'image', src: 'Projects/CAD Modeling of Wind Tunnel Test Section/CAD Modeling of Wind Tunnel Test Section.png' }
      ],
      href: '#'
    },
    {
      title: 'Computational Correlation of J-Integral parameter for Inclined Crack using FEM and ML',
      category: 'Structural Analysis',
      subtitle: 'COMSOL · J-Integral · ML',
      period: 'Nov 2023 — Dec 2023',
      description: 'Simulated angled crack propagation in COMSOL with the J-integral method. Compiled data from 172,000+ fracture cases and built neural network models achieving 99.99% accuracy.',
      learnings: [
        'Simulated crack propagation with J-integral',
        'Generated comprehensive fracture dataset',
        'Built ML models with >99% accuracy'
      ],
      tags: ['Fracture', 'ML', 'FEA', 'COMSOL'],
      media: [
        { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (1).png' },
        { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (10).png' },
        { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (2).png' },
        { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (3).png' },
        { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (4).png' },
        { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (5).png' },
        { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (6).png' },
        { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (7).png' },
        { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (8).png' },
        { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (9).png' }
      ],
      href: '#'
    },
    {
      title: 'Graphite Rupture Strength Prediction',
      category: 'Materials Science',
      subtitle: 'Deep Learning · Property Prediction',
      period: 'Aug 2024',
      description: 'Developed a deep learning model (98.1% accuracy) for predicting graphite rupture strength using historic nuclear graphite datasets. Model accelerates property screening for reactor-grade materials.',
      learnings: [
        'Achieved 98.1% prediction accuracy',
        'Processed nuclear-grade graphite datasets',
        'Developed property prediction framework'
      ],
      tags: ['Deep Learning', 'Materials', 'Prediction', 'Neural Networks'],
      media: [
        { type: 'image', src: '/Projects/Nuclear Graphite/Nuclear Graphite (1).png' },
        { type: 'image', src: '/Projects/Nuclear Graphite/Nuclear Graphite (2).png' }
      ],
      href: '#'
    },
    {
      title: 'Language Identification in Music',
      category: 'Audio Processing',
      subtitle: 'Python · PyTorch · MFCC',
      period: 'Aug 2024 — Nov 2024',
      description: 'Designed a deep learning model (97% accuracy) for identifying language in music using MFCC features. Built a robust preprocessing pipeline in PyTorch for noisy real-world inputs.',
      learnings: [
        'Achieved 97% language detection accuracy',
        'Implemented MFCC feature extraction',
        'Built end-to-end audio processing pipeline'
      ],
      tags: ['Deep Learning', 'Audio', 'PyTorch', 'Signal Processing'],
      media: [
        { type: 'image', src: '/projects/music-language.jpg' }
      ],
      href: '#'
    },
    {
      title: 'Guitar Design Project',
      category: 'Product Design',
      subtitle: 'CAD · Showcase',
      period: 'Feb 2022',
      description: 'Created a detailed, visually optimized CAD guitar model for a showcase project. Demonstrated surface modeling, assembly design, and engineering graphics skills.',
      learnings: [
        'Detailed surface and solid modeling',
        'Assembly design and visualization',
        'Engineering graphics fundamentals'
      ],
      tags: ['Design', 'CAD', 'Showcase', 'Product Design'],
      media: [
        { type: 'image', src: '/Projects/Guitar Design Project/Guitar Design Project (1).jpg' },
        { type: 'image', src: '/Projects/Guitar Design Project/Guitar Design Project (2).jpg' },
        { type: 'image', src: '/Projects/Guitar Design Project/Guitar Design Project (3).jpg' },
        { type: 'image', src: '/Projects/Guitar Design Project/Guitar Design Project (4).jpg' },
        { type: 'image', src: '/Projects/Guitar Design Project/Guitar Design Project (5).jpg' },
        { type: 'image', src: '/Projects/Guitar Design Project/Guitar Design Project (6).jpg' }
      ],
      href: '#'
    },
    {
      title: 'Aerodynamics Lab Experiments',
      category: 'Experimental Research',
      subtitle: 'Instrumentation · Wind Tunnel',
      period: 'Feb 2023 — Mar 2025',
      description: 'Hands-on experiments in the Aerodynamics Laboratory (wind turbine instrumentation, hot-wire anemometry, pitot tube analysis) under Dr. Vinayagamurthy. Gained practical expertise in wind measurement and analysis techniques.',
      learnings: [
        'Wind turbine instrumentation setup',
        'Hot-wire anemometry measurements',
        'Pitot tube calibration and analysis'
      ],
      tags: ['Experiment', 'Wind', 'Instrumentation', 'Measurement'],
      media: [
        { type: 'image', src: '/Projects/Aerodynamics Lab Experiments/Aerodynamics Lab Experiments (1).jpg' },
        { type: 'image', src: '/Projects/Aerodynamics Lab Experiments/Aerodynamics Lab Experiments (2).jpg' },
        { type: 'image', src: '/Projects/Aerodynamics Lab Experiments/Aerodynamics Lab Experiments (3).jpg' },
        { type: 'image', src: '/Projects/Aerodynamics Lab Experiments/Aerodynamics Lab Experiments (4).jpg' }
      ],
      href: '#'
    }
  ]

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
          marginBottom: `${40 * scale}px`
        }}>
          <div className="kicker" style={{
            fontSize: `${14 * scale}px`,
            marginBottom: `${12 * scale}px`
          }}>
            Portfolio
          </div>
          <h2 style={{
            fontSize: `${56 * scale}px`,
            fontWeight: '700',
            marginBottom: `${20 * scale}px`,
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
            fontSize: `${18 * scale}px`,
            lineHeight: '1.6',
            marginBottom: `${24 * scale}px`
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
          marginBottom: `${40 * scale}px`,
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

        {/* Horizontal Scroll Container */}
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
                flexShrink: 0,
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                display: 'flex',
                alignItems: 'flex-start',
                paddingTop: `${20 * scale}px`
              }}
            >
              <div style={{ width: '100%' }}>
                <div className="projects-grid" style={{
                  display: 'grid',
                  gap: `${28 * scale}px`,
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(2, 1fr)'
                }}>
                  {projects
                    .slice(pageIndex * PROJECTS_PER_PAGE, (pageIndex + 1) * PROJECTS_PER_PAGE)
                    .map((p, i) => (
                      <ProjectCard 
                        key={pageIndex * PROJECTS_PER_PAGE + i}
                        title={p.title}
                        period={p.period}
                        tags={p.tags}
                        onClick={() => setSelectedProject(p)}
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
          onClose={() => setSelectedProject(null)} 
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
            grid-template-rows: repeat(2, 1fr);
          }
        }

        @media (min-width: 900px) and (max-width: 1399px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-template-rows: repeat(3, 1fr);
          }
        }

        @media (max-width: 899px) {
          .projects-grid {
            grid-template-columns: 1fr !important;
            grid-auto-rows: auto;
          }
        }

        /* Ensure consistent aspect ratio for cards */
        .projects-grid > * {
          min-height: clamp(200px, 30vh, 280px);
        }
      `}</style>
    </>
  )
}