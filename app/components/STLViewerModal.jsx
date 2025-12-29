'use client'
import { useEffect, useRef, useState } from 'react'

export default function STLViewerModal({ project, onClose }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const meshRef = useRef(null)
  const animationFrameRef = useRef(null)
  const [threeLoaded, setThreeLoaded] = useState(false)
  const [showUnavailablePopup, setShowUnavailablePopup] = useState(false)

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
    touches: [],
    viewState: { x: 0, y: 0, z: 0 }
  })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  /* ---------- 1.  Load THREE and the loaders ---------- */
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.THREE) {            // already loaded
      setThreeLoaded(true)
      return
    }

    const threeScript = document.createElement('script')
    threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    threeScript.onload = async () => {
      const THREE = window.THREE

      /* ---- STL ---- */
      await loadSTLLoader(THREE)

      /* ---- STEP ---- */
      await loadSTPLoader(THREE)

      setThreeLoaded(true)
    }
    threeScript.onerror = () => {
      console.error('Could not load Three.js')
      setError('Failed to load 3D viewer')
    }
    document.head.appendChild(threeScript)

    return () => threeScript.remove()
  }, [])

  /* ---------- 2.  Scene setup ---------- */
  useEffect(() => {
    if (!containerRef.current || !threeLoaded) return
    const THREE = window.THREE

    document.body.style.overflow = 'hidden'

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0e1a)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    /* lights */
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const d1 = new THREE.DirectionalLight(0xffffff, 0.8)
    d1.position.set(5, 5, 5)
    scene.add(d1)
    const d2 = new THREE.DirectionalLight(0xffffff, 0.4)
    d2.position.set(-5, -5, -5)
    scene.add(d2)
    scene.add(new THREE.GridHelper(10, 10, 0x444444, 0x222222))

    /* ---------- 3.  Load geometry ---------- */
    const url = project.stlFile
    const ext = url.split('.').pop().toLowerCase()

    const onSuccess = (geometry) => {
      geometry.computeBoundingBox()
      const center = new THREE.Vector3()
      geometry.boundingBox.getCenter(center)
      geometry.translate(-center.x, -center.y, -center.z)

      const size = new THREE.Vector3()
      geometry.boundingBox.getSize(size)
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 2 / maxDim
      geometry.scale(scale, scale, scale)

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
    }

    const onFail = (err) => {
      console.error(err)
      setError(`Failed to load: ${url}`)
      setIsLoading(false)
      setShowUnavailablePopup(true)
    }

    if (ext === 'stl') {
      const loader = new THREE.STLLoader()
      loader.load(url, onSuccess, undefined, onFail)
    } else if (ext === 'step' || ext === 'stp') {
      const loader = new THREE.STPLoader()
      loader.load(url, onSuccess, undefined, onFail)
    } else {
      onFail(new Error('Unsupported 3-D extension: ' + ext))
    }

    /* ---------- 4.  Render loop ---------- */
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)
      if (meshRef.current) {
        meshRef.current.rotation.x = controlsRef.current.rotationX
        meshRef.current.rotation.y = controlsRef.current.rotationY
      }
      camera.position.x = controlsRef.current.panX
      camera.position.y = controlsRef.current.panY
      camera.position.z = controlsRef.current.zoom
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!containerRef.current) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (rendererRef.current?.domElement) containerRef.current?.removeChild(rendererRef.current.domElement)
      rendererRef.current?.dispose()
    }
  }, [project, threeLoaded])

  /* ---------- 5.  Controls (unchanged) ---------- */
  const handleMouseDown = (e) => {
    e.preventDefault()
    if (e.button === 0) controlsRef.current.isRotating = true
    else if (e.button === 2) controlsRef.current.isPanning = true
    controlsRef.current.lastX = e.clientX
    controlsRef.current.lastY = e.clientY
  }
  const handleMouseMove = (e) => {
    if (!controlsRef.current.isRotating && !controlsRef.current.isPanning) return
    const dx = e.clientX - controlsRef.current.lastX
    const dy = e.clientY - controlsRef.current.lastY
    if (controlsRef.current.isRotating) {
      controlsRef.current.rotationY += dx * 0.01
      controlsRef.current.rotationX += dy * 0.01
    }
    if (controlsRef.current.isPanning) {
      controlsRef.current.panX += dx * 0.005
      controlsRef.current.panY -= dy * 0.005
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
    controlsRef.current.zoom = Math.max(1, Math.min(20, controlsRef.current.zoom + e.deltaY * 0.01))
  }
  const handleTouchStart = (e) => {
    e.preventDefault()
    controlsRef.current.touches = Array.from(e.touches)
  }
  const handleTouchMove = (e) => {
    e.preventDefault()
    const touches = Array.from(e.touches)
    if (touches.length === 1 && controlsRef.current.touches.length === 1) {
      const dx = touches[0].clientX - controlsRef.current.touches[0].clientX
      const dy = touches[0].clientY - controlsRef.current.touches[0].clientY
      controlsRef.current.rotationY += dx * 0.01
      controlsRef.current.rotationX += dy * 0.01
    } else if (touches.length === 2 && controlsRef.current.touches.length === 2) {
      const cur = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY)
      const prev = Math.hypot(controlsRef.current.touches[0].clientX - controlsRef.current.touches[1].clientX, controlsRef.current.touches[0].clientY - controlsRef.current.touches[1].clientY)
      controlsRef.current.zoom = Math.max(1, Math.min(20, controlsRef.current.zoom - (cur - prev) * 0.01))

      const centerX = (touches[0].clientX + touches[1].clientX) / 2
      const centerY = (touches[0].clientY + touches[1].clientY) / 2
      const lastCenterX = (controlsRef.current.touches[0].clientX + controlsRef.current.touches[1].clientX) / 2
      const lastCenterY = (controlsRef.current.touches[0].clientY + controlsRef.current.touches[1].clientY) / 2
      controlsRef.current.panX += (centerX - lastCenterX) * 0.005
      controlsRef.current.panY -= (centerY - lastCenterY) * 0.005
    }
    controlsRef.current.touches = touches
  }
  const handleTouchEnd = () => (controlsRef.current.touches = [])
  const handleContextMenu = (e) => e.preventDefault()

  /* ---------- 6.  View helpers ---------- */
  const resetView = () => {
    controlsRef.current.rotationX = 0
    controlsRef.current.rotationY = 0
    controlsRef.current.panX = 0
    controlsRef.current.panY = 0
    controlsRef.current.zoom = 5
    controlsRef.current.viewState = { x: 0, y: 0, z: 0 }
  }
  const setViewX = () => {
    const s = controlsRef.current.viewState.x
    controlsRef.current.rotationX = 0
    controlsRef.current.rotationY = s === 0 ? Math.PI / 2 : -Math.PI / 2
    controlsRef.current.viewState.x = 1 - s
    controlsRef.current.panX = 0
    controlsRef.current.panY = 0
  }
  const setViewY = () => {
    const s = controlsRef.current.viewState.y
    controlsRef.current.rotationX = s === 0 ? -Math.PI / 2 : Math.PI / 2
    controlsRef.current.rotationY = 0
    controlsRef.current.viewState.y = 1 - s
    controlsRef.current.panX = 0
    controlsRef.current.panY = 0
  }
  const setViewZ = () => {
    const s = controlsRef.current.viewState.z
    controlsRef.current.rotationX = 0
    controlsRef.current.rotationY = s === 0 ? 0 : Math.PI
    controlsRef.current.viewState.z = 1 - s
    controlsRef.current.panX = 0
    controlsRef.current.panY = 0
  }

  /* ---------- 7.  Download ---------- */
  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = project.stlFile
    a.download = project.title?.replace(/\s+/g, '_') + '.' + project.stlFile.split('.').pop() || 'model.stl'
    a.click()
  }

  /* ---------- 8.  UI (unchanged) ---------- */
  if (!project) return null

  return (
    <>
      {showUnavailablePopup && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => {
            setShowUnavailablePopup(false)
            onClose()
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '500px',
              width: '90%',
              background: 'linear-gradient(135deg, rgba(15, 20, 32, 0.98), rgba(10, 14, 26, 0.98))',
              borderRadius: '20px',
              border: '2px solid rgba(255, 100, 100, 0.5)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
              padding: '2rem',
              animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              textAlign: 'center'
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1.5rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255, 100, 100, 0.2), rgba(255, 100, 100, 0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 100, 100, 0.9)" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1rem',
              color: '#fff',
              lineHeight: '1.2'
            }}>
              Model Unavailable
            </h2>
            <p style={{
              fontSize: '1rem',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '1.5rem',
              textAlign: 'center',
              padding: '0 1rem'
            }}>
              This 3D model is currently unavailable. As a student who transitioned between institutions,
              I temporarily lack access to the software licenses required to export and showcase these models.
              I'm working to restore access to provide you with the full interactive experience.
            </p>
            <button
              onClick={() => {
                setShowUnavailablePopup(false)
                onClose()
              }}
              style={{
                padding: '0.875rem 2rem',
                background: 'linear-gradient(135deg, rgba(255, 100, 100, 0.8), rgba(255, 100, 100, 0.6))',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                width: '100%'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 6px 16px rgba(255, 100, 100, 0.4)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = 'none'
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {!showUnavailablePopup && (
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
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(8px)'
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '0.5rem',
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(12px)',
              padding: '0.75rem 1rem',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              zIndex: 10,
              animation: 'slideDown 0.4s ease'
            }}
          >
            <div style={{
              padding: '0 1rem',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#fff',
              borderRight: '1px solid rgba(255, 255, 255, 0.2)',
              maxWidth: '300px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {project.title || 'CAD Model'}
            </div>
            <button
              onClick={setViewX}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(255, 100, 100, 0.2)',
                border: '1px solid rgba(255, 100, 100, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                fontSize: '0.85rem',
                fontWeight: '700',
                color: '#ff6464'
              }}
              className="control-button"
              title="View X axis (click to toggle +X/-X)"
            >
              X
            </button>
            <button
              onClick={setViewY}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(100, 255, 100, 0.2)',
                border: '1px solid rgba(100, 255, 100, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                fontSize: '0.85rem',
                fontWeight: '700',
                color: '#64ff64'
              }}
              className="control-button"
              title="View Y axis (click to toggle +Y/-Y)"
            >
              Y
            </button>
            <button
              onClick={setViewZ}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(100, 100, 255, 0.2)',
                border: '1px solid rgba(100, 100, 255, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                fontSize: '0.85rem',
                fontWeight: '700',
                color: '#6464ff'
              }}
              className="control-button"
              title="View Z axis (click to toggle +Z/-Z)"
            >
              Z
            </button>
            <div style={{
              width: '1px',
              height: '40px',
              background: 'rgba(255, 255, 255, 0.2)',
              margin: '0 0.25rem'
            }} />
            <button
              onClick={resetView}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              className="control-button"
              title="Reset View"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="white" strokeWidth="2"/>
                <path d="M12 7V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div style={{
              width: '1px',
              height: '40px',
              background: 'rgba(255, 255, 255, 0.2)',
              margin: '0 0.25rem'
            }} />
            <button
              onClick={handleDownload}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              className="control-button"
              title="Download"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              zIndex: 10,
              animation: 'slideDown 0.4s ease'
            }}
            className="control-button"
            title="Close (Esc)"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div
            ref={containerRef}
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onContextMenu={handleContextMenu}
            style={{
              position: 'relative',
              width: '90%',
              height: '90%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              cursor: controlsRef.current.isRotating || controlsRef.current.isPanning ? 'grabbing' : 'grab',
              userSelect: 'none'
            }}
          >
            {isLoading && !error && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                color: '#fff'
              }}>
                Loading 3-D model...
              </div>
            )}
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(12px)',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              gap: '2rem',
              animation: 'slideUp 0.4s ease',
              zIndex: 10
            }}
          >
            <span>
              <kbd style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.8rem'
              }}>Drag</kbd> to rotate
            </span>
            <span>
              <kbd style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.8rem'
              }}>Scroll</kbd> to zoom
            </span>
            <span>
              <kbd style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.8rem'
              }}>Right-click</kbd> to pan
            </span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        .control-button:not(:disabled):hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.05);
        }
        .control-button:not(:disabled):active {
          transform: scale(0.95);
        }
      `}</style>
    </>
  )
}

/* -------------------------------------------------- */
/* Helper: load STL loader (inline, same as before)   */
/* -------------------------------------------------- */
async function loadSTLLoader(THREE) {
  if (THREE.STLLoader) return
  THREE.STLLoader = function () {
    this.manager = THREE.DefaultLoadingManager
  }
  THREE.STLLoader.prototype.load = function (url, onLoad, onProgress, onError) {
    const scope = this
    const loader = new THREE.FileLoader(this.manager)
    loader.setResponseType('arraybuffer')
    loader.load(
      url,
      function (data) {
        try {
          onLoad(scope.parse(data))
        } catch (e) {
          onError?.(e)
          scope.manager.itemError(url)
        }
      },
      onProgress,
      onError
    )
  }
  THREE.STLLoader.prototype.parse = function (data) {
    function isBinary(buffer) {
      const reader = new DataView(buffer)
      const numFaces = reader.getUint32(80, true)
      const faceSize = (32 / 8) * 3 + ((32 / 8) * 3) * 3 + 16 / 8
      const expect = 80 + 4 + numFaces * faceSize
      return expect === reader.byteLength
    }
    function parseBinary(buffer) {
      const reader = new DataView(buffer)
      const faces = reader.getUint32(80, true)
      const geometry = new THREE.BufferGeometry()
      const vertices = new Float32Array(faces * 3 * 3)
      const normals = new Float32Array(faces * 3 * 3)
      for (let f = 0; f < faces; f++) {
        const start = 84 + f * 50
        const nx = reader.getFloat32(start, true)
        const ny = reader.getFloat32(start + 4, true)
        const nz = reader.getFloat32(start + 8, true)
        for (let i = 1; i <= 3; i++) {
          const vs = start + i * 12
          const idx = (f * 3 * 3) + (i - 1) * 3
          vertices[idx] = reader.getFloat32(vs, true)
          vertices[idx + 1] = reader.getFloat32(vs + 4, true)
          vertices[idx + 2] = reader.getFloat32(vs + 8, true)
          normals[idx] = nx
          normals[idx + 1] = ny
          normals[idx + 2] = nz
        }
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
      geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
      return geometry
    }
    function parseASCII(data) {
      const patternFace = /facet([\s\S]*?)endfacet/g
      let faceCount = 0
      let res
      while ((res = patternFace.exec(data)) !== null) faceCount++
      const vertices = new Float32Array(faceCount * 3 * 3)
      const normals = new Float32Array(faceCount * 3 * 3)
      const patternNormal = /normal\s+([\-+]?[0-9]+\.?[0-9]*([eE][\-+]?[0-9]+)?)\s+([\-+]?[0-9]+\.?[0-9]*([eE][\-+]?[0-9]+)?)\s+([\-+]?[0-9]+\.?[0-9]*([eE][\-+]?[0-9]+)?)/g
      const patternVertex = /vertex\s+([\-+]?[0-9]+\.?[0-9]*([eE][\-+]?[0-9]+)?)\s+([\-+]?[0-9]+\.?[0-9]*([eE][\-+]?[0-9]+)?)\s+([\-+]?[0-9]+\.?[0-9]*([eE][\-+]?[0-9]+)?)/g
      patternFace.lastIndex = 0
      let vCounter = 0
      let face
      while ((face = patternFace.exec(data)) !== null) {
        const block = face[0]
        patternNormal.lastIndex = 0
        const n = patternNormal.exec(block)
        const normal = new THREE.Vector3(parseFloat(n[1]), parseFloat(n[3]), parseFloat(n[5]))
        patternVertex.lastIndex = 0
        let vert
        while ((vert = patternVertex.exec(block)) !== null) {
          vertices[vCounter] = parseFloat(vert[1])
          vertices[vCounter + 1] = parseFloat(vert[3])
          vertices[vCounter + 2] = parseFloat(vert[5])
          normals[vCounter] = normal.x
          normals[vCounter + 1] = normal.y
          normals[vCounter + 2] = normal.z
          vCounter += 3
        }
      }
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
      geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
      return geometry
    }
    let buf = data instanceof ArrayBuffer ? data : new TextEncoder().encode(data).buffer
    const isBin = isBinary(buf)
    const geom = isBin ? parseBinary(buf) : parseASCII(new TextDecoder().decode(buf))
    return geom
  }
}

/* -------------------------------------------------- */
/* Helper: load STEP loader (three-stdlib)            */
/* -------------------------------------------------- */
async function loadSTPLoader(THREE) {
  if (THREE.STPLoader) return          // already attached

  const { CADLoader } = await import('three-stdlib')
  THREE.STPLoader = CADLoader          // alias → keeps the rest of the code intact
}