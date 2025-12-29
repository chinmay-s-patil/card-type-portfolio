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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  /* ---------- camera-control state ---------- */
  const controlsRef = useRef({
    isRotating: false,
    isPanning: false,
    lastX: 0,
    lastY: 0,
    target: null,           // THREE.Vector3
    spherical: null,        // THREE.Spherical
    panOffset: null,        // THREE.Vector3
    zoom: 5,
    touches: [],
    viewState: { x: 0, y: 0, z: 0 } // 0 = +axis, 1 = -axis
  })

  /* ---------- load Three & STL loader ---------- */
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.THREE) { setThreeLoaded(true); return }

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    script.onload = () => {
      injectSTLLoader()
      setThreeLoaded(true)
    }
    script.onerror = () => {
      setError('Failed to load 3D viewer')
    }
    document.head.appendChild(script)
  }, [])

  /* ---------- scene setup ---------- */
  useEffect(() => {
    if (!threeLoaded || !containerRef.current || !window.THREE) return

    const THREE = window.THREE
    document.body.style.overflow = 'hidden'

    /* scene */
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0e1a)
    sceneRef.current = scene

    /* camera */
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    cameraRef.current = camera

    /* renderer */
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    /* lights */
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const d1 = new THREE.DirectionalLight(0xffffff, 0.8)
    d1.position.set(5, 5, 5); scene.add(d1)
    const d2 = new THREE.DirectionalLight(0xffffff, 0.4)
    d2.position.set(-5, -5, -5); scene.add(d2)
    scene.add(new THREE.GridHelper(10, 10, 0x444444, 0x222222))

    /* init control vectors */
    controlsRef.current.target = new THREE.Vector3(0, 0, 0)
    controlsRef.current.spherical = new THREE.Spherical(5, Math.PI / 3, Math.PI / 4)
    controlsRef.current.panOffset = new THREE.Vector3()

    /* load STL */
    const loader = new THREE.STLLoader()
    loader.load(
      project.stlFile,
      geo => {
        geo.computeBoundingBox()
        const center = new THREE.Vector3()
        geo.boundingBox.getCenter(center)
        geo.translate(-center.x, -center.y, -center.z)

        const size = new THREE.Vector3()
        geo.boundingBox.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2 / maxDim
        geo.scale(scale, scale, scale)

        const mat = new THREE.MeshPhongMaterial({
          color: new THREE.Color(project.color),
          specular: 0x111111,
          shininess: 200,
          flatShading: false
        })
        const mesh = new THREE.Mesh(geo, mat)
        scene.add(mesh)
        meshRef.current = mesh
        setIsLoading(false)
      },
      () => {},
      err => {
        console.error(err)
        setError(`Failed to load: ${project.stlFile}`)
        setIsLoading(false)
        setShowUnavailablePopup(true)
      }
    )

    /* resize */
    const handleResize = () => {
      if (!containerRef.current) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    /* animation loop */
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)
      updateCamera()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('resize', handleResize)
      animationFrameRef.current && cancelAnimationFrame(animationFrameRef.current)
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      rendererRef.current?.dispose()
    }
  }, [project, threeLoaded])

  /* ---------- camera update helper ---------- */
  const updateCamera = () => {
    const { spherical, target, panOffset } = controlsRef.current
    const camPos = new window.THREE.Vector3().setFromSpherical(spherical)
    cameraRef.current.position.copy(target).add(camPos).add(panOffset)
    cameraRef.current.lookAt(target.clone().add(panOffset))
  }

  /* ---------- mouse / touch ---------- */
  const handleMouseDown = e => {
    e.preventDefault()
    controlsRef.current.isRotating = e.button === 0
    controlsRef.current.isPanning = e.button === 2
    controlsRef.current.lastX = e.clientX
    controlsRef.current.lastY = e.clientY
  }
  const handleMouseMove = e => {
    const { isRotating, isPanning, lastX, lastY, spherical, panOffset, target } = controlsRef.current
    if (!isRotating && !isPanning) return

    const dx = e.clientX - lastX
    const dy = e.clientY - lastY

    if (isRotating) {
      spherical.theta += dx * 0.01
      spherical.phi  -= dy * 0.01;   // was +=  (phi must still be clamped)
      spherical.phi = window.THREE.MathUtils.clamp(spherical.phi, 0.1, Math.PI - 0.1);
    }
    if (isPanning) {
      const pan = new window.THREE.Vector3()
      pan.copy(cameraRef.current.position).sub(target).normalize()
      pan.cross(cameraRef.current.up).setLength(-dx * 0.005)
      pan.addScaledVector(cameraRef.current.up, -dy * 0.005)
      panOffset.add(pan)
    }
    controlsRef.current.lastX = e.clientX
    controlsRef.current.lastY = e.clientY
  }
  const handleMouseUp = () => {
    controlsRef.current.isRotating = false
    controlsRef.current.isPanning = false
  }
  const handleWheel = e => {
    e.preventDefault()
    controlsRef.current.spherical.radius = Math.max(
      1,
      Math.min(20, controlsRef.current.spherical.radius + e.deltaY * 0.01)
    )
  }
  const handleContextMenu = e => e.preventDefault()

  /* ---------- touch ---------- */
  const handleTouchStart = e => {
    controlsRef.current.touches = Array.from(e.touches)
  }
  const handleTouchMove = e => {
    e.preventDefault()
    const touches = Array.from(e.touches)
    const { touches: prevTouches, spherical, panOffset, target } = controlsRef.current
    if (touches.length === 1 && prevTouches.length === 1) {
      const dx = touches[0].clientX - prevTouches[0].clientX
      const dy = touches[0].clientY - prevTouches[0].clientY
      spherical.theta -= dx * 0.01
      spherical.phi = window.THREE.MathUtils.clamp(spherical.phi + dy * 0.01, 0.1, Math.PI - 0.1)
    } else if (touches.length === 2 && prevTouches.length === 2) {
      const cur = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY)
      const prev = Math.hypot(prevTouches[0].clientX - prevTouches[1].clientX, prevTouches[0].clientY - prevTouches[1].clientY)
      spherical.radius = Math.max(1, Math.min(20, spherical.radius - (cur - prev) * 0.01))

      const cx = (touches[0].clientX + touches[1].clientX) / 2
      const cy = (touches[0].clientY + touches[1].clientY) / 2
      const pcx = (prevTouches[0].clientX + prevTouches[1].clientX) / 2
      const pcy = (prevTouches[0].clientY + prevTouches[1].clientY) / 2
      const pan = new window.THREE.Vector3()
      pan.copy(cameraRef.current.position).sub(target).normalize()
      pan.cross(cameraRef.current.up).setLength(-(cx - pcx) * 0.005)
      pan.addScaledVector(cameraRef.current.up, (cy - pcy) * 0.005)
      panOffset.add(pan)
    }
    controlsRef.current.touches = touches
  }
  const handleTouchEnd = () => {
    controlsRef.current.touches = []
  }

  /* ---------- view buttons ---------- */
  const resetView = () => {
    controlsRef.current.spherical.set(5, Math.PI / 3, Math.PI / 4)
    controlsRef.current.target.set(0, 0, 0)
    controlsRef.current.panOffset.set(0, 0, 0)
    controlsRef.current.viewState = { x: 0, y: 0, z: 0 }
  }
  const fitToScreen = () => {
    if (!meshRef.current) return
    const box = new window.THREE.Box3().setFromObject(meshRef.current)
    const center = box.getCenter(new window.THREE.Vector3())
    const size = box.getSize(new window.THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = cameraRef.current.fov * Math.PI / 180
    const dist = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.3 // 1.3 = margin
    controlsRef.current.target.copy(center)
    controlsRef.current.spherical.radius = dist
    controlsRef.current.panOffset.set(0, 0, 0)
  }
  const setViewX = () => {
    const s = controlsRef.current.viewState.x
    controlsRef.current.spherical.theta = s ? -Math.PI / 2 : Math.PI / 2
    controlsRef.current.spherical.phi = Math.PI / 2
    controlsRef.current.viewState.x = 1 - s
  }
  const setViewY = () => {
    const s = controlsRef.current.viewState.y
    controlsRef.current.spherical.theta = 0
    controlsRef.current.spherical.phi = s ? Math.PI / 2 : -Math.PI / 2
    controlsRef.current.viewState.y = 1 - s
  }
  const setViewZ = () => {
    const s = controlsRef.current.viewState.z
    controlsRef.current.spherical.theta = s ? Math.PI : 0
    controlsRef.current.spherical.phi = Math.PI / 2
    controlsRef.current.viewState.z = 1 - s
  }
  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = project.stlFile
    a.download = project.title || 'model.stl'
    a.click()
  }

  /* ---------- util ---------- */
  function injectSTLLoader() {
    const THREE = window.THREE
    if (THREE.STLLoader) return
    THREE.STLLoader = function () { this.manager = THREE.DefaultLoadingManager }
    THREE.STLLoader.prototype = {
      load(url, onLoad, onProgress, onError) {
        const scope = this
        const loader = new THREE.FileLoader(this.manager)
        loader.setResponseType('arraybuffer')
        loader.load(url, buf => onLoad(scope.parse(buf)), onProgress, onError)
      },
      parse(data) {
        const isBinary = () => {
          const view = new DataView(data)
          const faces = view.getUint32(80, true)
          return 80 + 4 + faces * 50 === view.byteLength
        }
        return isBinary() ? parseBinary(data) : parseASCII(new TextDecoder().decode(data))
        function parseBinary(buffer) {
          const view = new DataView(buffer)
          const faces = view.getUint32(80, true)
          const geo = new THREE.BufferGeometry()
          const v = new Float32Array(faces * 3 * 3)
          const n = new Float32Array(faces * 3 * 3)
          for (let i = 0; i < faces; i++) {
            const start = 84 + i * 50
            const norm = new THREE.Vector3(view.getFloat32(start, true), view.getFloat32(start + 4, true), view.getFloat32(start + 8, true))
            for (let j = 1; j <= 3; j++) {
              const vs = start + j * 12
              const k = (i * 3 + j - 1) * 3
              v[k] = view.getFloat32(vs, true)
              v[k + 1] = view.getFloat32(vs + 4, true)
              v[k + 2] = view.getFloat32(vs + 8, true)
              n[k] = norm.x; n[k + 1] = norm.y; n[k + 2] = norm.z
            }
          }
          geo.setAttribute('position', new THREE.BufferAttribute(v, 3))
          geo.setAttribute('normal', new THREE.BufferAttribute(n, 3))
          return geo
        }
        function parseASCII(str) {
          const geo = new THREE.BufferGeometry()
          const vertices = []
          const normals = []
          const faceRe = /facet([\s\S]*?)endfacet/g
          let m
          while ((m = faceRe.exec(str)) !== null) {
            const txt = m[0]
            const normMatch = /normal\s+([-\d.eE]+)\s+([-\d.eE]+)\s+([-\d.eE]+)/.exec(txt)
            const norm = new THREE.Vector3(parseFloat(normMatch[1]), parseFloat(normMatch[2]), parseFloat(normMatch[3]))
            const vertRe = /vertex\s+([-\d.eE]+)\s+([-\d.eE]+)\s+([-\d.eE]+)/g
            let v
            while ((v = vertRe.exec(txt)) !== null) {
              vertices.push(parseFloat(v[1]), parseFloat(v[2]), parseFloat(v[3]))
              normals.push(norm.x, norm.y, norm.z)
            }
          }
          geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
          geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3))
          return geo
        }
      }
    }
  }

  if (!project) return null

  /* ---------- render ---------- */
  return (
    <>
      {showUnavailablePopup && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(8px)',
            animation: 'fadeIn .3s ease'
          }}
          onClick={() => { setShowUnavailablePopup(false); onClose() }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '500px', width: '90%',
              background: 'linear-gradient(135deg,rgba(15,20,32,.98),rgba(10,14,26,.98))',
              borderRadius: '20px', border: '2px solid rgba(255,100,100,.5)',
              boxShadow: '0 20px 60px rgba(0,0,0,.8)', padding: '2rem',
              animation: 'slideUp .4s cubic-bezier(.4,0,.2,1)', textAlign: 'center'
            }}
          >
            <div style={{
              width: '80px', height: '80px', margin: '0 auto 1.5rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg,rgba(255,100,100,.2),rgba(255,100,100,.05))',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,100,100,.9)" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#fff' }}>Model Unavailable</h2>
            <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'rgba(255,255,255,.8)', marginBottom: '1.5rem' }}>
              This 3D model is currently unavailable. As a student who transitioned between institutions,
              I temporarily lack access to the software licenses required to export and showcase these models.
              I&apos;m working to restore access to provide you with the full interactive experience.
            </p>
            <button
              onClick={() => { setShowUnavailablePopup(false); onClose() }}
              style={{
                padding: '.875rem 2rem',
                background: 'linear-gradient(135deg,rgba(255,100,100,.8),rgba(255,100,100,.6))',
                color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: '600',
                cursor: 'pointer', transition: 'all .2s ease', width: '100%'
              }}
              onMouseOver={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 16px rgba(255,100,100,.4)' }}
              onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none' }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {!showUnavailablePopup && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100, display: 'flex',
            alignItems: 'center', justifyContent: 'center', animation: 'fadeIn .3s ease'
          }}
          onClick={onClose}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.95)', backdropFilter: 'blur(8px)' }} />

          {/* top control bar */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute', top: '2rem', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '.5rem', background: 'rgba(0,0,0,.8)', backdropFilter: 'blur(12px)',
              padding: '.75rem 1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,.1)',
              zIndex: 10, animation: 'slideDown .4s ease'
            }}
          >
            <div style={{
              padding: '0 1rem', display: 'flex', alignItems: 'center', fontSize: '.9rem',
              fontWeight: '600', color: '#fff', borderRight: '1px solid rgba(255,255,255,.2)',
              maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>
              {project.title || 'CAD Model'}
            </div>

            <button onClick={setViewX} className="control-button" title="View X axis (toggle +X/-X)" style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255,100,100,.2)', border: '1px solid rgba(255,100,100,.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.85rem', fontWeight: '700', color: '#ff6464'
            }}>X</button>

            <button onClick={setViewY} className="control-button" title="View Y axis (toggle +Y/-Y)" style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(100,255,100,.2)', border: '1px solid rgba(100,255,100,.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.85rem', fontWeight: '700', color: '#64ff64'
            }}>Y</button>

            <button onClick={setViewZ} className="control-button" title="View Z axis (toggle +Z/-Z)" style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(100,100,255,.2)', border: '1px solid rgba(100,100,255,.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.85rem', fontWeight: '700', color: '#6464ff'
            }}>Z</button>

            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,.2)', margin: '0 .25rem' }} />

            <button onClick={resetView} className="control-button" title="Reset View" style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 12a9 9 0 109 9 9 9 0 00-9-9z" stroke="white" strokeWidth="2"/>
                <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            {/* NEW FIT-TO-SCREEN BUTTON */}
            <button onClick={fitToScreen} className="control-button" title="Fit to Screen" style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 9l6 6m0-6l-6 6"/>
              </svg>
            </button>

            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,.2)', margin: '0 .25rem' }} />

            <button onClick={handleDownload} className="control-button" title="Download" style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* close */}
          <button
            onClick={onClose}
            className="control-button"
            title="Close (Esc)"
            style={{
              position: 'absolute', top: '2rem', right: '2rem',
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'rgba(0,0,0,.8)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 10,
              animation: 'slideDown .4s ease'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* canvas container */}
          <div
            ref={containerRef}
            onClick={e => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onContextMenu={handleContextMenu}
            style={{
              position: 'relative', width: '90%', height: '90%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', cursor: controlsRef.current.isRotating || controlsRef.current.isPanning ? 'grabbing' : 'grab',
              userSelect: 'none'
            }}
          >
            {isLoading && !error && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#fff' }}>
                Loading 3D model...
              </div>
            )}
          </div>

          {/* help text */}
          <div
            style={{
              position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,.8)', backdropFilter: 'blur(12px)', padding: '.75rem 1.5rem',
              borderRadius: '12px', border: '1px solid rgba(255,255,255,.1)', fontSize: '.85rem',
              color: 'rgba(255,255,255,.7)', display: 'flex', gap: '2rem',
              animation: 'slideUp .4s ease', zIndex: 10
            }}
          >
            <span><kbd style={{ background: 'rgba(255,255,255,.1)', padding: '.25rem .5rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '.8rem' }}>Drag</kbd> to rotate</span>
            <span><kbd style={{ background: 'rgba(255,255,255,.1)', padding: '.25rem .5rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '.8rem' }}>Scroll</kbd> to zoom</span>
            <span><kbd style={{ background: 'rgba(255,255,255,.1)', padding: '.25rem .5rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '.8rem' }}>Right-click</kbd> to pan</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideDown{from{opacity:0;transform:translateX(-50%) translateY(-20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        .control-button:not(:disabled):hover{background:rgba(255,255,255,.2)!important;transform:scale(1.05)}
        .control-button:not(:disabled):active{transform:scale(0.95)}
      `}</style>
    </>
  )
}