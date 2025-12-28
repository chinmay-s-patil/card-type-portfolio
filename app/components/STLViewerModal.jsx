'use client'
import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

export default function STLViewerModal({ project, onClose }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const meshRef = useRef(null)
  const animationFrameRef = useRef(null)
  const [threeLoaded, setThreeLoaded] = useState(false)
  
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
    if (!containerRef.current || !threeLoaded || !window.THREE) return

    const THREE = window.THREE

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
  }, [project, threeLoaded])

  // Rest of your component code (mouse/touch handlers, etc.) stays the same...
  const handleMouseDown = (e) => {
    e.preventDefault()
    if (e.button === 0) {
      controlsRef.current.isRotating = true
    } else if (e.button === 2) {
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

  const handleTouchStart = (e) => {
    e.preventDefault()
    controlsRef.current.touches = Array.from(e.touches)
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    const touches = Array.from(e.touches)

    if (touches.length === 1 && controlsRef.current.touches.length === 1) {
      const deltaX = touches[0].clientX - controlsRef.current.touches[0].clientX
      const deltaY = touches[0].clientY - controlsRef.current.touches[0].clientY
      controlsRef.current.rotationY += deltaX * 0.01
      controlsRef.current.rotationX += deltaY * 0.01
    } else if (touches.length === 2 && controlsRef.current.touches.length === 2) {
      const currentDist = Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
      )
      const lastDist = Math.hypot(
        controlsRef.current.touches[0].clientX - controlsRef.current.touches[1].clientX,
        controlsRef.current.touches[0].clientY - controlsRef.current.touches[1].clientY
      )
      
      const distDelta = currentDist - lastDist
      controlsRef.current.zoom = Math.max(1, Math.min(20, controlsRef.current.zoom - distDelta * 0.01))

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
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
        onLoad={() => setThreeLoaded(true)}
        strategy="lazyOnload"
      />
      
      {/* Your existing modal JSX stays the same */}
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
        {/* Rest of your modal content... */}
        {/* (Keep all your existing modal structure) */}
      </div>

      {/* Your existing styles */}
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
    </>
  )
}