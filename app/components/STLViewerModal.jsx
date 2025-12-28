'use client'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function STLViewerModal({ project, onClose }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const meshRef = useRef(null)
  const animationFrameRef = useRef(null)
  
  // Camera controls state
  const controlsRef = useRef({
    isRotating: false,
    isPanning: false,
    lastX: 0,
    lastY: 0,
    rotationX: 0,
    rotationY: 0,
    panX: 0,
    panY: 0,
    zoom: 5,
    touches: []
  })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Disable body scroll
    document.body.style.overflow = 'hidden'

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0e1a)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight1.position.set(5, 5, 5)
    scene.add(directionalLight1)

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4)
    directionalLight2.position.set(-5, -5, -5)
    scene.add(directionalLight2)

    // Grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222)
    scene.add(gridHelper)

    // Load STL
    const loader = new THREE.STLLoader()
    loader.load(
      project.stlFile,
      (geometry) => {
        // Center geometry
        geometry.computeBoundingBox()
        const center = new THREE.Vector3()
        geometry.boundingBox.getCenter(center)
        geometry.translate(-center.x, -center.y, -center.z)

        // Scale to fit
        const size = new THREE.Vector3()
        geometry.boundingBox.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2 / maxDim
        geometry.scale(scale, scale, scale)

        // Create material with color from project
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color(project.color),
          specular: 0x111111,
          shininess: 200,
          flatShading: false
        })

        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
        meshRef.current = mesh

        setIsLoading(false)
      },
      (progress) => {
        // Progress callback
        console.log('Loading:', (progress.loaded / progress.total * 100) + '%')
      },
      (error) => {
        console.error('Error loading STL:', error)
        setError('Failed to load 3D model')
        setIsLoading(false)
      }
    )

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)

      if (meshRef.current) {
        meshRef.current.rotation.x = controlsRef.current.rotationX
        meshRef.current.rotation.y = controlsRef.current.rotationY
        meshRef.current.position.x = controlsRef.current.panX
        meshRef.current.position.y = controlsRef.current.panY
      }

      camera.position.z = controlsRef.current.zoom
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
  }, [project])

  // Mouse controls
  const handleMouseDown = (e) => {
    e.preventDefault()
    if (e.button === 0) { // Left click - rotate
      controlsRef.current.isRotating = true
    } else if (e.button === 2) { // Right click - pan
      controlsRef.current.isPanning = true
    }
    controlsRef.current.lastX = e.clientX
    controlsRef.current.lastY = e.clientY
  }

  const handleMouseMove = (e) => {
    if (!controlsRef.current.isRotating && !controlsRef.current.isPanning) return

    const deltaX = e.clientX - controlsRef.current.lastX
    const deltaY = e.clientY - controlsRef.current.lastY

    if (controlsRef.current.isRotating) {
      controlsRef.current.rotationY += deltaX * 0.01
      controlsRef.current.rotationX += deltaY * 0.01
    }

    if (controlsRef.current.isPanning) {
      controlsRef.current.panX += deltaX * 0.005
      controlsRef.current.panY -= deltaY * 0.005
    }

    controlsRef.current.lastX = e.clientX
    controlsRef.current.lastY = e.clientY
  }

  const handleMouseUp = () => {
    controlsRef.current.isRotating = false
    controlsRef.current.isPanning = false
  }

  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY * 0.01
    controlsRef.current.zoom = Math.max(1, Math.min(20, controlsRef.current.zoom + delta))
  }

  // Touch controls
  const handleTouchStart = (e) => {
    e.preventDefault()
    controlsRef.current.touches = Array.from(e.touches)
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    const touches = Array.from(e.touches)

    if (touches.length === 1 && controlsRef.current.touches.length === 1) {
      // Single finger - rotate
      const deltaX = touches[0].clientX - controlsRef.current.touches[0].clientX
      const deltaY = touches[0].clientY - controlsRef.current.touches[0].clientY
      controlsRef.current.rotationY += deltaX * 0.01
      controlsRef.current.rotationX += deltaY * 0.01
    } else if (touches.length === 2 && controlsRef.current.touches.length === 2) {
      // Two fingers
      const currentDist = Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
      )
      const lastDist = Math.hypot(
        controlsRef.current.touches[0].clientX - controlsRef.current.touches[1].clientX,
        controlsRef.current.touches[0].clientY - controlsRef.current.touches[1].clientY
      )
      
      // Pinch zoom
      const distDelta = currentDist - lastDist
      controlsRef.current.zoom = Math.max(1, Math.min(20, controlsRef.current.zoom - distDelta * 0.01))

      // Two finger pan
      const centerX = (touches[0].clientX + touches[1].clientX) / 2
      const centerY = (touches[0].clientY + touches[1].clientY) / 2
      const lastCenterX = (controlsRef.current.touches[0].clientX + controlsRef.current.touches[1].clientX) / 2
      const lastCenterY = (controlsRef.current.touches[0].clientY + controlsRef.current.touches[1].clientY) / 2
      
      controlsRef.current.panX += (centerX - lastCenterX) * 0.005
      controlsRef.current.panY -= (centerY - lastCenterY) * 0.005
    }

    controlsRef.current.touches = touches
  }

  const handleTouchEnd = () => {
    controlsRef.current.touches = []
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
  }

  const resetView = () => {
    controlsRef.current.rotationX = 0
    controlsRef.current.rotationY = 0
    controlsRef.current.panX = 0
    controlsRef.current.panY = 0
    controlsRef.current.zoom = 5
  }

  if (!project) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(8px)'
        }}
      />

      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '90%',
          height: '90vh',
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
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '0.85rem',
              color: project.color,
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}>
              {project.category}
            </div>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#fff'
            }}>
              {project.title}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={resetView}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="hover:bg-[rgba(255,255,255,0.15)]"
            >
              Reset View
            </button>
            <button
              onClick={onClose}
              style={{
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
                transition: 'all 0.2s ease'
              }}
              className="hover:bg-[rgba(255,255,255,0.1)]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 3D Viewer */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onContextMenu={handleContextMenu}
          style={{
            flex: 1,
            position: 'relative',
            cursor: 'grab'
          }}
        >
          {isLoading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid rgba(255, 255, 255, 0.1)',
                borderTopColor: project.color,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                Loading 3D model...
              </div>
            </div>
          )}

          {error && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff6b6b',
              fontSize: '1rem'
            }}>
              {error}
            </div>
          )}

          {/* Controls Hint */}
          {!isLoading && !error && (
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(12px)',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              maxWidth: '220px'
            }}>
              <div><strong style={{ color: '#fff' }}>Desktop:</strong></div>
              <div>• Left Click + Drag: Rotate</div>
              <div>• Right Click + Drag: Pan</div>
              <div>• Scroll: Zoom</div>
              <div style={{ marginTop: '0.5rem' }}><strong style={{ color: '#fff' }}>Mobile:</strong></div>
              <div>• 1 Finger: Rotate</div>
              <div>• 2 Finger Pinch: Zoom</div>
              <div>• 2 Finger Drag: Pan</div>
            </div>
          )}
        </div>

        {/* Project Info */}
        <div style={{
          padding: '1.5rem 2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <p style={{
              fontSize: '0.95rem',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              {project.description}
            </p>
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            alignItems: 'flex-start'
          }}>
            {project.tags.map((tag, i) => (
              <span
                key={i}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  background: `${project.color}15`,
                  border: `1px solid ${project.color}40`,
                  color: project.color
                }}
              >
                {tag}
              </span>
            ))}
          </div>
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

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}