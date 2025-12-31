"use client"
import { useState, useEffect, useRef } from 'react'

// CAD Projects List with glTF files
const CADList = [
  {
    id: 1,
    title: 'Guitar Design',
    category: 'Product Design',
    year: '2022',
    description: 'Detailed CAD model of an acoustic guitar featuring advanced surface modeling techniques, assembly design, and precise component integration.',
    coverPhoto: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=600&fit=crop',
    gltfFile: '/CAD/Guitar/Guitar.gltf',
    tags: ['SolidWorks', 'Surface Modeling', 'Product Design', 'Assembly'],
    color: '#ff6b35',
    transparency: 0
  },
  {
    id: 2,
    title: 'Aerofoil',
    category: 'Aerodynamics',
    year: '2022',
    description: 'Precision aerodynamic profile designed for optimal lift-to-drag ratio in subsonic flow conditions.',
    coverPhoto: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop',
    gltfFile: '/CAD/Aerofoil/Aerofoil.gltf',
    tags: ['CFD', 'Aerodynamics', 'Analysis'],
    color: '#4ecdc4',
    transparency: 50
  },
  {
    id: 3,
    title: 'Wind Tunnel Test Section',
    category: 'Experimental Equipment',
    year: '2024',
    description: 'Precision 3D model of wind tunnel test section from field measurements with 0.01mm tolerance.',
    coverPhoto: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
    gltfFile: '/CAD/WindTunnel/tunnel.gltf',
    tags: ['Precision Modeling', 'Experimental', 'Aerodynamics'],
    color: '#8338ec',
    transparency: 30
  },
  {
    id: 4,
    title: 'Solar Vortex Engine',
    category: 'Energy Systems',
    year: '2024',
    description: 'Research-grade CAD model designed for CFD baseline and parametric optimization studies.',
    coverPhoto: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    gltfFile: '/CAD/SVE/sve.gltf',
    tags: ['Energy', 'Parametric', 'CFD-Ready'],
    color: '#ffbe0b',
    transparency: 0
  }
]

// glTF Viewer Modal Component
function GLTFViewerModal({ project, onClose }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const meshRef = useRef(null)
  const animationRef = useRef(null)
  const [threeReady, setThreeReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isTransparent, setIsTransparent] = useState(project.transparency > 0)
  const [showInfo, setShowInfo] = useState(true)

  const ctrlRef = useRef({
    isRotating: false,
    isPanning: false,
    lastX: 0,
    lastY: 0,
    target: null,
    spherical: null,
    panOffset: null
  })

  // Load Three.js
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.THREE) {
      setThreeReady(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    script.onload = () => setThreeReady(true)
    script.onerror = () => setError('Could not load 3D engine')
    document.head.appendChild(script)
  }, [])

  // Scene setup
  useEffect(() => {
    if (!threeReady || !containerRef.current) return

    const THREE = window.THREE
    document.body.style.overflow = 'hidden'

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0e1a)
    sceneRef.current = scene

    const cam = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    cameraRef.current = cam

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const d1 = new THREE.DirectionalLight(0xffffff, 0.8)
    d1.position.set(5, 5, 5)
    scene.add(d1)
    const d2 = new THREE.DirectionalLight(0xffffff, 0.4)
    d2.position.set(-5, -5, -5)
    scene.add(d2)
    scene.add(new THREE.GridHelper(10, 10, 0x444444, 0x222222))

    ctrlRef.current.target = new THREE.Vector3()
    ctrlRef.current.spherical = new THREE.Spherical(5, Math.PI / 3, Math.PI / 4)
    ctrlRef.current.panOffset = new THREE.Vector3()

    loadGLTF(project.gltfFile)

    const onResize = () => {
      if (!containerRef.current) return
      cam.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      cam.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', onResize)

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      updateCamera()
      renderer.render(scene, cam)
    }
    animate()

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('resize', onResize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      rendererRef.current?.dispose()
    }
  }, [project, threeReady])

  function loadGLTF(url) {
    // Placeholder: Create a simple colored cube as demo
    const THREE = window.THREE
    const geometry = new THREE.BoxGeometry(2, 2, 2)
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(project.color),
      transparent: isTransparent,
      opacity: isTransparent ? project.transparency / 100 : 1.0,
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(geometry, material)
    sceneRef.current.add(mesh)
    meshRef.current = mesh
    setIsLoading(false)
  }

  const updateCamera = () => {
    const { spherical, target, panOffset } = ctrlRef.current
    const pos = new window.THREE.Vector3().setFromSpherical(spherical)
    cameraRef.current.position.copy(target).add(pos).add(panOffset)
    cameraRef.current.lookAt(target.clone().add(panOffset))
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    ctrlRef.current.isRotating = e.button === 0
    ctrlRef.current.isPanning = e.button === 2
    ctrlRef.current.lastX = e.clientX
    ctrlRef.current.lastY = e.clientY
  }

  const handleMouseMove = (e) => {
    const c = ctrlRef.current
    if (!c.isRotating && !c.isPanning) return
    const dx = e.clientX - c.lastX
    const dy = e.clientY - c.lastY
    if (c.isRotating) {
      c.spherical.theta -= dx * 0.01
      c.spherical.phi += dy * 0.01
      c.spherical.phi = window.THREE.MathUtils.clamp(c.spherical.phi, 0.1, Math.PI - 0.1)
    }
    if (c.isPanning) {
      const pan = new window.THREE.Vector3()
      pan.copy(cameraRef.current.position).sub(c.target).normalize()
      pan.cross(cameraRef.current.up).setLength(dx * 0.005)
      pan.addScaledVector(cameraRef.current.up, dy * 0.005)
      c.panOffset.add(pan)
    }
    c.lastX = e.clientX
    c.lastY = e.clientY
  }

  const handleMouseUp = () => {
    ctrlRef.current.isRotating = ctrlRef.current.isPanning = false
  }

  const handleWheel = (e) => {
    e.preventDefault()
    ctrlRef.current.spherical.radius = Math.max(
      1,
      Math.min(20, ctrlRef.current.spherical.radius + e.deltaY * 0.01)
    )
  }

  const resetView = () => {
    ctrlRef.current.spherical.set(5, Math.PI / 3, Math.PI / 4)
    ctrlRef.current.target.set(0, 0, 0)
    ctrlRef.current.panOffset.set(0, 0, 0)
  }

  const toggleTransparency = () => {
    if (!meshRef.current) return
    const newTransparent = !isTransparent
    setIsTransparent(newTransparent)
    meshRef.current.material.transparent = newTransparent
    meshRef.current.material.opacity = newTransparent ? project.transparency / 100 : 1.0
    meshRef.current.material.needsUpdate = true
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        background: 'rgba(0,0,0,.95)',
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Controls */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '.5rem',
          background: 'rgba(0,0,0,.8)',
          backdropFilter: 'blur(12px)',
          padding: '.75rem 1rem',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,.1)',
          zIndex: 10
        }}
      >
        <div
          style={{
            padding: '0 1rem',
            display: 'flex',
            alignItems: 'center',
            fontSize: '.9rem',
            fontWeight: '600',
            color: '#fff',
            borderRight: '1px solid rgba(255,255,255,.2)'
          }}
        >
          {project.title}
        </div>

        <button
          onClick={resetView}
          title="Reset View"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,.1)',
            border: '1px solid rgba(255,255,255,.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 12a9 9 0 109 9 9 9 0 00-9-9z" stroke="currentColor" strokeWidth="2" />
            <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <button
          onClick={toggleTransparency}
          title="Toggle Transparency"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: isTransparent ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.1)',
            border: '1px solid rgba(255,255,255,.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(0,0,0,.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          cursor: 'pointer',
          color: '#fff'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          cursor: ctrlRef.current.isRotating || ctrlRef.current.isPanning ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
      >
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              color: '#fff'
            }}
          >
            Loading model...
          </div>
        )}
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            right: '2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '320px',
            maxHeight: '80vh',
            overflowY: 'auto',
            background: 'rgba(0,0,0,.9)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,.1)',
            padding: '1.5rem',
            zIndex: 10
          }}
        >
          <button
            onClick={() => setShowInfo(false)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,.1)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            ✕
          </button>

          <div style={{ fontSize: '12px', color: project.color, fontWeight: '600', marginBottom: '8px' }}>
            {project.category}
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
            {project.title}
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,.7)', marginBottom: '20px' }}>
            {project.description}
          </p>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.5)', marginBottom: '8px' }}>
              YEAR
            </div>
            <div style={{ fontSize: '16px', color: '#fff', fontWeight: '600' }}>{project.year}</div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.5)', marginBottom: '8px' }}>
              TECHNOLOGIES
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: 'rgba(255,255,255,.1)',
                    color: 'rgba(255,255,255,.9)',
                    border: '1px solid rgba(255,255,255,.15)'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {!showInfo && (
        <button
          onClick={() => setShowInfo(true)}
          style={{
            position: 'absolute',
            right: '2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            zIndex: 10
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {/* Help Text */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,.8)',
          backdropFilter: 'blur(12px)',
          padding: '.75rem 1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,.1)',
          fontSize: '.85rem',
          color: 'rgba(255,255,255,.7)',
          display: 'flex',
          gap: '2rem',
          zIndex: 10
        }}
      >
        <span>
          <kbd style={{ background: 'rgba(255,255,255,.1)', padding: '.25rem .5rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '.8rem' }}>
            Drag
          </kbd>{' '}
          to rotate
        </span>
        <span>
          <kbd style={{ background: 'rgba(255,255,255,.1)', padding: '.25rem .5rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '.8rem' }}>
            Scroll
          </kbd>{' '}
          to zoom
        </span>
        <span>
          <kbd style={{ background: 'rgba(255,255,255,.1)', padding: '.25rem .5rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '.8rem' }}>
            Right-click
          </kbd>{' '}
          to pan
        </span>
      </div>
    </div>
  )
}

// Main CAD Gallery Component
export default function CADGalleryNormalized() {
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
          {/* Header - MATCHES OTHER SECTIONS */}
          <div style={{ flexShrink: 0, marginBottom: '32px' }}>
            <div style={{
              fontSize: '14px',
              color: 'hsl(140, 70%, 60%)',
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
                        onClick={() => setSelectedProject(project)}
                        style={{
                          borderRadius: '16px',
                          overflow: 'hidden',
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          cursor: 'pointer',
                          transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)'
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        {/* Image */}
                        <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
                          <img
                            src={project.coverPhoto}
                            alt={project.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '12px',
                              left: '12px',
                              padding: '6px 12px',
                              background: 'rgba(0, 0, 0, 0.8)',
                              backdropFilter: 'blur(8px)',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: '700',
                              color: project.color
                            }}
                          >
                            {project.year}
                          </div>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <h3
                            style={{
                              fontSize: '20px',
                              fontWeight: '700',
                              color: '#fff',
                              marginBottom: '8px'
                            }}
                          >
                            {project.title}
                          </h3>
                          <div
                            style={{
                              fontSize: '14px',
                              color: 'rgba(255, 255, 255, 0.5)',
                              fontWeight: '500',
                              marginBottom: '12px'
                            }}
                          >
                            {project.category}
                          </div>
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginTop: 'auto'
                          }}>
                            {project.tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: '500',
                                  background: 'rgba(255, 255, 255, 0.06)',
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)'
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

      {selectedProject && <GLTFViewerModal project={selectedProject} onClose={() => setSelectedProject(null)} />}

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  )
}