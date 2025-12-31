'use client'
import { useEffect, useRef, useState } from 'react'

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
  const [loadingMessage, setLoadingMessage] = useState('Initializing...')
  const [error, setError] = useState(null)
  const [showPopup, setShowPopup] = useState(false)

  const ctrlRef = useRef({
    isRotating: false, isPanning: false, lastX: 0, lastY: 0,
    target: null, spherical: null, panOffset: null, zoom: 5,
    touches: [], viewState: { x: 0, y: 0, z: 0 }
  })

  // Load Three.js dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.THREE) {
      setThreeReady(true)
      setLoadingMessage('3D engine loaded')
      setLoadingProgress(20)
      return
    }

    setLoadingMessage('Loading 3D engine...')
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    script.onload = () => {
      setThreeReady(true)
      setLoadingMessage('3D engine ready')
      setLoadingProgress(20)
    }
    script.onerror = () => {
      setError('Could not load 3D rendering engine')
      setShowPopup(true)
    }
    document.head.appendChild(script)
    
    setTimeout(() => {
      if (!window.THREE) {
        setError('3D engine loading timed out')
        setShowPopup(true)
      }
    }, 15000)
  }, [])

  // Load OpenCascade for STEP/IGES files
  useEffect(() => {
    const file = project.stepFile
    if (!file) return
    
    const ext = file.split('?')[0].split('.').pop().toLowerCase()
    if (ext === 'step' || ext === 'stp' || ext === 'igs' || ext === 'iges') {
      loadOpenCascade()
    }
  }, [project])

  // In app/components/STEPViewerModal.jsx
  // Replace the loadOpenCascade function with this:

const loadOpenCascade = async () => {
  if (window.occt) {
    setOcctReady(true)
    setLoadingMessage('CAD parser ready')
    return
  }

  setLoadingProgress(25)
  setLoadingMessage('Loading CAD parser...')
  
  try {
    setLoadingProgress(40)
    setLoadingMessage('Initializing CAD parser...')
    
    // Load as ES module script
    const script = document.createElement('script')
    script.type = 'module'  // Critical: load as ES module
    script.textContent = `
      import opencascade from '/opencascade/opencascade.js';
      window.opencascadeInit = opencascade;
      window.dispatchEvent(new Event('opencascade-loaded'));
    `
    
    // Wait for the module to load
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('OpenCascade module load timeout'))
      }, 15000)
      
      window.addEventListener('opencascade-loaded', () => {
        clearTimeout(timeout)
        resolve()
      }, { once: true })
      
      document.head.appendChild(script)
    })
    
    if (!window.opencascadeInit || typeof window.opencascadeInit !== 'function') {
      throw new Error('OpenCascade module loaded but initialization function not found')
    }
    
    setLoadingProgress(50)
    setLoadingMessage('Loading WASM modules...')
    
    // Initialize with your local WASM files
    const OCC = await window.opencascadeInit({
      locateFile: (path) => {
        console.log('Requesting WASM file:', path)
        return `/opencascade/${path}`
      }
    })
    
    console.log('OpenCascade initialized:', OCC)
    window.occt = OCC
    setLoadingProgress(60)
    setLoadingMessage('CAD parser ready')
    setOcctReady(true)
    
    // Cleanup
    delete window.opencascadeInit
    
  } catch (err) {
    console.error('Full error details:', err)
    setError(`Failed to initialize CAD parser: ${err.message}`)
    setShowPopup(true)
    setIsLoading(false)
  }
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

    const file = project.stepFile
    const ext = file.split('?')[0].split('.').pop().toLowerCase()
    
    if (ext === 'step' || ext === 'stp') loadSTEP(file)
    else if (ext === 'igs' || ext === 'iges') loadIGES(file)
    else {
      setError('Unsupported format')
      setIsLoading(false)
      setShowPopup(true)
    }

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
      animationRef.current && cancelAnimationFrame(animationRef.current)
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      rendererRef.current?.dispose()
    }
  }, [project, threeReady, occtReady])

  async function loadSTEP(url) {
    try {
      setLoadingProgress(65)
      setLoadingMessage('Downloading STEP file...')
      const response = await fetch(url)
      const buffer = await response.arrayBuffer()
      setLoadingProgress(75)
      setLoadingMessage('Parsing STEP geometry...')
      
      const occt = window.occt
      const fileBuffer = new Uint8Array(buffer)
      
      occt.FS.createDataFile('/', 'model.step', fileBuffer, true, true, true)
      
      const reader = new occt.STEPControl_Reader_1()
      reader.ReadFile('model.step')
      reader.TransferRoots()
      const shape = reader.OneShape()
      
      setLoadingProgress(85)
      setLoadingMessage('Creating 3D mesh...')
      
      const mesh = tessellateShape(shape)
      finishMesh(mesh)
      
      occt.FS.unlink('/model.step')
    } catch (err) {
      console.error('STEP load error:', err)
      setError('STEP file could not be loaded')
      setIsLoading(false)
      setShowPopup(true)
    }
  }

  async function loadIGES(url) {
    try {
      setLoadingProgress(65)
      setLoadingMessage('Downloading IGES file...')
      const response = await fetch(url)
      const buffer = await response.arrayBuffer()
      setLoadingProgress(75)
      setLoadingMessage('Parsing IGES geometry...')
      
      const occt = window.occt
      const fileBuffer = new Uint8Array(buffer)
      
      occt.FS.createDataFile('/', 'model.igs', fileBuffer, true, true, true)
      
      const reader = new occt.IGESControl_Reader_1()
      reader.ReadFile('model.igs')
      reader.TransferRoots()
      const shape = reader.OneShape()
      
      setLoadingProgress(85)
      setLoadingMessage('Creating 3D mesh...')
      
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

    const mat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(project.color || '#ff6b35'),
      specular: 0x111111,
      shininess: 200,
      side: THREE.DoubleSide,
      flatShading: false
    })
    
    const mesh = new THREE.Mesh(geo, mat)
    sceneRef.current.add(mesh)
    meshRef.current = mesh
    setIsLoading(false)
    setLoadingProgress(100)
    setLoadingMessage('Model loaded!')
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

  const resetView = () => {
    ctrlRef.current.spherical.set(5, Math.PI / 3, Math.PI / 4)
    ctrlRef.current.target.set(0, 0, 0)
    ctrlRef.current.panOffset.set(0, 0, 0)
    ctrlRef.current.viewState = { x: 0, y: 0, z: 0 }
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
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,100,100,.9)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#fff' }}>
              {error || 'Model Unavailable'}
            </h2>
            <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'rgba(255,255,255,.8)', marginBottom: '1.5rem' }}>
              {error || 'Unable to load the 3D model in your browser.'}
              <br/><br/>
              <strong>You can download the file to view it in CAD software like:</strong>
              <br/>
              • FreeCAD (free, open-source)
              <br/>
              • Autodesk Fusion 360 (free for hobbyists)
              <br/>
              • SolidWorks, CATIA, or other professional CAD tools
            </p>
            
            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              <button
                onClick={() => {
                  const a = document.createElement('a')
                  a.href = project.stepFile
                  a.download = `${project.title}.${project.stepFile.split('.').pop()}`
                  a.click()
                }}
                style={{
                  padding: '.875rem 2rem',
                  background: 'linear-gradient(135deg, hsl(30, 100%, 60%), hsl(30, 100%, 70%))',
                  color: '#0a0e1a', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: '600',
                  cursor: 'pointer', transition: 'all .2s ease', width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Download CAD File
              </button>
              
              <button
                onClick={() => { setShowPopup(false); onClose() }}
                style={{
                  padding: '.875rem 2rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', 
                  fontSize: '1rem', fontWeight: '600',
                  cursor: 'pointer', transition: 'all .2s ease', width: '100%'
                }}
              >
                Close
              </button>
            </div>
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

            <button onClick={resetView} title="Reset View" style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 12a9 9 0 109 9 9 9 0 00-9-9z" stroke="white" strokeWidth="2" />
                <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,.2)', margin: '0 .25rem' }} />

            <button onClick={handleDownload} title="Download" style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <button
            onClick={onClose}
            title="Close (Esc)"
            style={{
              position: 'absolute', top: '2rem', right: '2rem',
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'rgba(0,0,0,.8)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 10,
              animation: 'slideDown .4s ease', cursor: 'pointer'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div
            ref={containerRef}
            onClick={e => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
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
                fontSize: '1.2rem', color: '#fff', gap: '1.5rem',
                background: 'rgba(10, 14, 26, 0.95)'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  border: '4px solid rgba(255, 255, 255, 0.1)',
                  borderTop: '4px solid hsl(30, 100%, 60%)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                
                <div style={{ textAlign: 'center', maxWidth: '300px' }}>
                  {loadingMessage}
                </div>
                
                {loadingProgress > 0 && (
                  <div style={{
                    width: '300px', height: '6px', background: 'rgba(255,255,255,.1)',
                    borderRadius: '3px', overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${loadingProgress}%`, height: '100%',
                      background: 'linear-gradient(90deg, hsl(30, 100%, 60%), hsl(30, 100%, 70%))',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                )}
                
                <div style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textAlign: 'center',
                  maxWidth: '400px'
                }}>
                  {loadingProgress < 30 ? 'Initializing 3D viewer...' :
                   loadingProgress < 60 ? 'Loading CAD parser (may take 10-20 seconds)...' :
                   'Processing model geometry...'}
                </div>
              </div>
            )}
          </div>

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
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideDown { from { opacity: 0; transform: translateX(-50%) translateY(-20px) } to { opacity: 1; transform: translateX(-50%) translateY(0) } }
        @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(20px) } to { opacity: 1; transform: translateX(-50%) translateY(0) } }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        button:hover { opacity: 0.8; transform: scale(1.05); transition: all 0.2s ease; }
        button:active { transform: scale(0.95); }
      `}</style>
    </>
  )
}