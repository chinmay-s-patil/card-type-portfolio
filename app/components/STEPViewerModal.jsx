"use client"
import { useEffect, useRef, useState } from "react"

export default function STEPViewerModal({ project, onClose }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const meshRef = useRef(null)
  const animationRef = useRef(null)

  const [threeReady, setThreeReady] = useState(false)
  const [occtReady, setOcctReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [error, setError] = useState(null)
  const [showPopup, setShowPopup] = useState(false)

  const ctrlRef = useRef({
    isRotating: false, isPanning: false, lastX: 0, lastY: 0,
    target: null, spherical: null, panOffset: null, zoom: 5,
    touches: [], viewState: { x: 0, y: 0, z: 0 }
  })

  // Load Three.js
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.THREE) {
      setThreeReady(true)
      return
    }

    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    s.onload = () => setThreeReady(true)
    s.onerror = () => setError('Could not load Three.js')
    document.head.appendChild(s)
  }, [])

  // Load OpenCascade for STEP files
  useEffect(() => {
    if (!project.stepFile) return
    loadOpenCascade()
  }, [project])

  const loadOpenCascade = () => {
    if (window.occt) {
      setOcctReady(true)
      return
    }

    setLoadingProgress(10)
    
    // Load as ES module
    const script = document.createElement('script')
    script.type = 'module'
    script.textContent = `
      import opencascadeInit from '/opencascade/opencascade.js';
      
      opencascadeInit({
        locateFile: (file) => '/opencascade/' + file
      }).then((occt) => {
        window.occt = occt;
        window.dispatchEvent(new Event('opencascade-loaded'));
      }).catch((err) => {
        console.error('OpenCascade init error:', err);
        window.dispatchEvent(new CustomEvent('opencascade-error', { detail: err }));
      });
    `
    
    const handleLoaded = () => {
      setLoadingProgress(50)
      setOcctReady(true)
      cleanup()
    }
    
    const handleError = (e) => {
      console.error('OpenCascade error:', e.detail)
      setError('CAD parser initialization failed')
      setShowPopup(true)
      cleanup()
    }
    
    const cleanup = () => {
      window.removeEventListener('opencascade-loaded', handleLoaded)
      window.removeEventListener('opencascade-error', handleError)
    }
    
    window.addEventListener('opencascade-loaded', handleLoaded)
    window.addEventListener('opencascade-error', handleError)
    
    setLoadingProgress(30)
    document.head.appendChild(script)
  }

  // Scene setup
  useEffect(() => {
    if (!threeReady || !occtReady || !containerRef.current) return
    
    const THREE = window.THREE
    document.body.style.overflow = 'hidden'

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0e1a)
    sceneRef.current = scene

    const cam = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1, 1000
    )
    cameraRef.current = cam

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const d1 = new THREE.DirectionalLight(0xffffff, 0.8)
    d1.position.set(5, 5, 5)
    scene.add(d1)
    const d2 = new THREE.DirectionalLight(0xffffff, 0.4)
    d2.position.set(-5, -5, -5)
    scene.add(d2)
    scene.add(new THREE.GridHelper(10, 10, 0x444444, 0x222222))

    // Camera controls
    ctrlRef.current.target = new THREE.Vector3()
    ctrlRef.current.spherical = new THREE.Spherical(5, Math.PI / 3, Math.PI / 4)
    ctrlRef.current.panOffset = new THREE.Vector3()

    // Load STEP model
    const file = project.stepFile
    const ext = file.split('?')[0].split('.').pop().toLowerCase()
    
    if (ext === 'step' || ext === 'stp') {
      loadSTEP(file)
    } else if (ext === 'igs' || ext === 'iges') {
      loadIGES(file)
    } else {
      setError('Unsupported format. Only STEP/IGES files are supported.')
      setIsLoading(false)
      setShowPopup(true)
    }

    // Resize
    const onResize = () => {
      if (!containerRef.current) return
      cam.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      cam.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      updateCamera()
      renderer.render(scene, cam)
    }
    animate()

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('resize', onResize)
      animationRef.current && cancelAnimationFrame(animationRef.current)
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      rendererRef.current?.dispose()
    }
  }, [project, threeReady, occtReady])

  // STEP Loader
  async function loadSTEP(url) {
    try {
      setLoadingProgress(60)
      const response = await fetch(url)
      const buffer = await response.arrayBuffer()
      setLoadingProgress(75)
      
      const occt = window.occt
      const fileBuffer = new Uint8Array(buffer)
      
      // Ensure working directory exists
      try {
        occt.FS.mkdir('/working')
      } catch (e) {
        // Directory might already exist
      }
      
      const filename = '/working/model.step'
      
      // Remove file if it exists
      try {
        occt.FS.unlink(filename)
      } catch (e) {
        // File doesn't exist yet
      }
      
      // Write to virtual filesystem
      occt.FS.writeFile(filename, fileBuffer)
      
      // Read STEP file - correct constructor name
      const reader = new occt.STEPControl_Reader_1()
      const status = reader.ReadFile(filename)
      
      if (status !== occt.IFSelect_RetDone) {
        throw new Error('Failed to read STEP file - status: ' + status)
      }
      
      reader.TransferRoots()
      const shape = reader.OneShape()
      
      setLoadingProgress(85)
      
      // Tessellate
      const mesh = tessellateShape(shape)
      finishMesh(mesh)
      
      // Cleanup
      try {
        occt.FS.unlink(filename)
      } catch (e) {
        // Ignore cleanup errors
      }
    } catch (err) {
      console.error('STEP load error:', err)
      setError('STEP file could not be loaded: ' + err.message)
      setIsLoading(false)
      setShowPopup(true)
    }
  }

  // IGES Loader
  async function loadIGES(url) {
    try {
      setLoadingProgress(60)
      const response = await fetch(url)
      const buffer = await response.arrayBuffer()
      setLoadingProgress(75)
      
      const occt = window.occt
      const fileBuffer = new Uint8Array(buffer)
      
      occt.FS.createDataFile('/', 'model.igs', fileBuffer, true, true, true)
      
      const reader = new occt.IGESControl_Reader_1()
      reader.ReadFile('model.igs')
      reader.TransferRoots()
      const shape = reader.OneShape()
      
      setLoadingProgress(85)
      
      const mesh = tessellateShape(shape)
      finishMesh(mesh)
      
      occt.FS.unlink('/model.igs')
    } catch (err) {
      console.error('IGES load error:', err)
      setError('IGES file could not be loaded')
      setIsLoading(false)
      setShowPopup(true)
    }
  }

  // Tessellate CAD shape to mesh
  function tessellateShape(shape) {
    const THREE = window.THREE
    const occt = window.occt
    
    const mesher = new occt.BRepMesh_IncrementalMesh_2(shape, 0.1, false, 0.1, false)
    mesher.Perform()
    
    const vertices = []
    const normals = []
    
    const explorer = new occt.TopExp_Explorer_1()
    for (explorer.Init(shape, occt.TopAbs_FACE, occt.TopAbs_SHAPE); explorer.More(); explorer.Next()) {
      const face = occt.TopoDS.Face_1(explorer.Current())
      const location = new occt.TopLoc_Location_1()
      const triangulation = occt.BRep_Tool.Triangulation(face, location)
      
      if (triangulation.IsNull()) continue
      
      const nodeCount = triangulation.get().NbNodes()
      const triCount = triangulation.get().NbTriangles()
      
      const transform = location.Transformation()
      const oriented = face.Orientation_1() === occt.TopAbs_REVERSED
      
      for (let i = 1; i <= triCount; i++) {
        const tri = triangulation.get().Triangle(i)
        const indices = [tri.Value(1), tri.Value(2), tri.Value(3)]
        
        if (oriented) indices.reverse()
        
        const pts = indices.map(idx => {
          const node = triangulation.get().Node(idx)
          const transformed = node.Transformed(transform)
          return [transformed.X(), transformed.Y(), transformed.Z()]
        })
        
        // Calculate normal
        const v1 = [pts[1][0] - pts[0][0], pts[1][1] - pts[0][1], pts[1][2] - pts[0][2]]
        const v2 = [pts[2][0] - pts[0][0], pts[2][1] - pts[0][1], pts[2][2] - pts[0][2]]
        const normal = [
          v1[1] * v2[2] - v1[2] * v2[1],
          v1[2] * v2[0] - v1[0] * v2[2],
          v1[0] * v2[1] - v1[1] * v2[0]
        ]
        const len = Math.sqrt(normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2)
        normal[0] /= len
        normal[1] /= len
        normal[2] /= len
        
        pts.forEach(pt => {
          vertices.push(...pt)
          normals.push(...normal)
        })
      }
    }
    
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
    geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3))
    
    return geo
  }

  // Finish mesh setup
  function finishMesh(geo) {
    const THREE = window.THREE
    
    geo.computeBoundingBox()
    const center = new THREE.Vector3()
    geo.boundingBox.getCenter(center)
    geo.translate(-center.x, -center.y, -center.z)

    const size = new THREE.Vector3()
    geo.boundingBox.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 2 / maxDim
    geo.scale(scale, scale, scale)

    // Check if transparent
    const isTransparent = project.transparent || false
    const opacity = project.opacity || (isTransparent ? 0.7 : 1.0)

    const mat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(project.color),
      specular: 0x111111,
      shininess: 200,
      transparent: isTransparent,
      opacity: opacity,
      side: THREE.DoubleSide,
      flatShading: false
    })
    
    const mesh = new THREE.Mesh(geo, mat)
    sceneRef.current.add(mesh)
    meshRef.current = mesh
    setIsLoading(false)
    setLoadingProgress(100)
  }

  const updateCamera = () => {
    const { spherical, target, panOffset } = ctrlRef.current
    const pos = new window.THREE.Vector3().setFromSpherical(spherical)
    cameraRef.current.position.copy(target).add(pos).add(panOffset)
    cameraRef.current.lookAt(target.clone().add(panOffset))
  }

  const handleMouseDown = e => {
    e.preventDefault()
    ctrlRef.current.isRotating = e.button === 0
    ctrlRef.current.isPanning = e.button === 2
    ctrlRef.current.lastX = e.clientX
    ctrlRef.current.lastY = e.clientY
  }

  const handleMouseMove = e => {
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

  const handleWheel = e => {
    e.preventDefault()
    ctrlRef.current.spherical.radius = Math.max(1, Math.min(20,
      ctrlRef.current.spherical.radius + e.deltaY * 0.01))
  }

  const handleContextMenu = e => e.preventDefault()

  const handleTouchStart = e => {
    ctrlRef.current.touches = Array.from(e.touches)
  }

  const handleTouchMove = e => {
    e.preventDefault()
    const c = ctrlRef.current
    const touches = Array.from(e.touches)
    const prev = c.touches
    if (touches.length === 1 && prev.length === 1) {
      const dx = touches[0].clientX - prev[0].clientX
      const dy = touches[0].clientY - prev[0].clientY
      c.spherical.theta -= dx * 0.01
      c.spherical.phi = window.THREE.MathUtils.clamp(c.spherical.phi + dy * 0.01, 0.1, Math.PI - 0.1)
    } else if (touches.length === 2 && prev.length === 2) {
      const cur = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY)
      const p = Math.hypot(prev[0].clientX - prev[1].clientX, prev[0].clientY - prev[1].clientY)
      c.spherical.radius = Math.max(1, Math.min(20, c.spherical.radius - (cur - p) * 0.01))

      const cx = (touches[0].clientX + touches[1].clientX) / 2
      const cy = (touches[0].clientY + touches[1].clientY) / 2
      const pcx = (prev[0].clientX + prev[1].clientX) / 2
      const pcy = (prev[0].clientY + prev[1].clientY) / 2
      const pan = new window.THREE.Vector3()
      pan.copy(cameraRef.current.position).sub(c.target).normalize()
      pan.cross(cameraRef.current.up).setLength((cx - pcx) * 0.005)
      pan.addScaledVector(cameraRef.current.up, (cy - pcy) * 0.005)
      c.panOffset.add(pan)
    }
    c.touches = touches
  }

  const handleTouchEnd = () => {
    ctrlRef.current.touches = []
  }

  const resetView = () => {
    ctrlRef.current.spherical.set(5, Math.PI / 3, Math.PI / 4)
    ctrlRef.current.target.set(0, 0, 0)
    ctrlRef.current.panOffset.set(0, 0, 0)
    ctrlRef.current.viewState = { x: 0, y: 0, z: 0 }
  }

  const fitToScreen = () => {
    if (!meshRef.current) return
    const box = new window.THREE.Box3().setFromObject(meshRef.current)
    const center = box.getCenter(new window.THREE.Vector3())
    const size = box.getSize(new window.THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = cameraRef.current.fov * Math.PI / 180
    const dist = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.3
    ctrlRef.current.target.copy(center)
    ctrlRef.current.spherical.radius = dist
    ctrlRef.current.panOffset.set(0, 0, 0)
  }

  const setViewX = () => {
    const s = ctrlRef.current.viewState.x
    ctrlRef.current.spherical.theta = s ? -Math.PI / 2 : Math.PI / 2
    ctrlRef.current.spherical.phi = Math.PI / 2
    ctrlRef.current.viewState.x = 1 - s
  }

  const setViewY = () => {
    const s = ctrlRef.current.viewState.y
    ctrlRef.current.spherical.theta = 0
    ctrlRef.current.spherical.phi = s ? Math.PI / 2 : -Math.PI / 2
    ctrlRef.current.viewState.y = 1 - s
  }

  const setViewZ = () => {
    const s = ctrlRef.current.viewState.z
    ctrlRef.current.spherical.theta = s ? Math.PI : 0
    ctrlRef.current.spherical.phi = Math.PI / 2
    ctrlRef.current.viewState.z = 1 - s
  }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = project.stepFile
    a.download = project.title || 'model'
    a.click()
  }

  if (!project) return null

  return (
    <>
      {showPopup && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(8px)',
            animation: 'fadeIn .3s ease'
          }}
          onClick={() => { setShowPopup(false); onClose() }}
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
              <svg width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='rgba(255,100,100,.9)' strokeWidth='2'>
                <circle cx='12' cy='12' r='10' />
                <line x1='12' y1='8' x2='12' y2='12' />
                <line x1='12' y1='16' x2='12.01' y2='16' />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#fff' }}>
              {error || 'Model Unavailable'}
            </h2>
            <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'rgba(255,255,255,.8)', marginBottom: '1.5rem' }}>
              {error === 'CAD parser initialization failed' 
                ? 'The CAD file parser could not be initialized. This may be due to browser compatibility issues.'
                : 'Unable to load the STEP/IGES model. Please check the file format and try again.'}
            </p>
            <button
              onClick={() => { setShowPopup(false); onClose() }}
              style={{
                padding: '.875rem 2rem',
                background: 'linear-gradient(135deg,rgba(255,100,100,.8),rgba(255,100,100,.6))',
                color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: '600',
                cursor: 'pointer', transition: 'all .2s ease', width: '100%'
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {!showPopup && (
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

          {/* Control bar */}
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
              {project.title || 'STEP Model'}
            </div>

            <button onClick={setViewX} title='View X axis' style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255,100,100,.2)', border: '1px solid rgba(255,100,100,.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.85rem', fontWeight: '700', color: '#ff6464', cursor: 'pointer'
            }}>X</button>

            <button onClick={setViewY} title='View Y axis' style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(100,255,100,.2)', border: '1px solid rgba(100,255,100,.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.85rem', fontWeight: '700', color: '#64ff64', cursor: 'pointer'
            }}>Y</button>

            <button onClick={setViewZ} title='View Z axis' style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(100,100,255,.2)', border: '1px solid rgba(100,255,255,.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.85rem', fontWeight: '700', color: '#6464ff', cursor: 'pointer'
            }}>Z</button>

            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,.2)', margin: '0 .25rem' }} />

            <button onClick={resetView} title='Reset View' style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                <path d='M3 12a9 9 0 109 9 9 9 0 00-9-9z' stroke='white' strokeWidth='2' />
                <path d='M12 7v5l3 3' stroke='white' strokeWidth='2' strokeLinecap='round' />
              </svg>
            </button>

            <button onClick={fitToScreen} title='Fit to Screen' style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
                <rect x='3' y='3' width='18' height='18' rx='2' />
                <path d='M9 9l6 6m0-6l-6 6' />
              </svg>
            </button>

            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,.2)', margin: '0 .25rem' }} />

            <button onClick={handleDownload} title='Download' style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                <path d='M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            title='Close (Esc)'
            style={{
              position: 'absolute', top: '2rem', right: '2rem',
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'rgba(0,0,0,.8)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 10,
              animation: 'slideDown .4s ease', cursor: 'pointer'
            }}
          >
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
              <path d='M18 6L6 18M6 6l12 12' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </button>

          {/* Canvas container */}
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
              overflow: 'hidden',
              cursor: ctrlRef.current.isRotating || ctrlRef.current.isPanning ? 'grabbing' : 'grab',
              userSelect: 'none'
            }}
          >
            {isLoading && !error && (
              <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', color: '#fff', gap: '1rem'
              }}>
                <div>Loading STEP model...</div>
                {loadingProgress > 0 && (
                  <div style={{
                    width: '200px', height: '4px', background: 'rgba(255,255,255,.1)',
                    borderRadius: '2px', overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${loadingProgress}%`, height: '100%',
                      background: 'linear-gradient(90deg, hsl(30, 100%, 60%), hsl(30, 100%, 70%))',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Help text */}
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

      <style jsx>{`\n        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }\n        @keyframes slideDown { from { opacity: 0; transform: translateX(-50%) translateY(-20px) } to { opacity: 1; transform: translateX(-50%) translateY(0) } }\n        @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(20px) } to { opacity: 1; transform: translateX(-50%) translateY(0) } }\n        button:hover { opacity: 0.8; transform: scale(1.05); transition: all 0.2s ease; }\n        button:active { transform: scale(0.95); }\n      `}</style>
    </>
  )
}
