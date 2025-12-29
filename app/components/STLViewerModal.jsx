'use client'
/*  STLViewerModal → CADViewerModal  (supports STL & STEP)
    Same props:  project = { stlFile | stepFile, title, color, … }
    Everything else (camera, UI, events) untouched.
*/
import { useEffect, useRef, useState } from 'react'

export default function CADViewerModal({ project, onClose }) {
  const containerRef = useRef(null)
  const sceneRef      = useRef(null)
  const cameraRef     = useRef(null)
  const rendererRef   = useRef(null)
  const meshRef       = useRef(null)
  const animationRef  = useRef(null)

  const [threeReady, setThreeReady]   = useState(false)
  const [isLoading, setIsLoading]     = useState(true)
  const [error, setError]             = useState(null)
  const [showPopup, setShowPopup]     = useState(false)

  /* ---------- camera state ---------- */
  const ctrlRef = useRef({
    isRotating:false, isPanning:false, lastX:0, lastY:0,
    target:null, spherical:null, panOffset:null, zoom:5,
    touches:[], viewState:{x:0,y:0,z:0}
  })

  /* ---------- 1.  load THREE + optional loaders ---------- */
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.THREE) { injectExtraLoaders(); setThreeReady(true); return }

    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    s.onload = () => { injectExtraLoaders(); setThreeReady(true) }
    s.onerror = () => setError('Could not load Three.js')
    document.head.appendChild(s)
  }, [])

  /* ---------- 2.  scene setup ---------- */
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
      0.1, 1000
    )
    cameraRef.current = cam

    const renderer = new THREE.WebGLRenderer({ antialias:true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    /* lights */
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const d1 = new THREE.DirectionalLight(0xffffff, 0.8)
    d1.position.set(5,5,5); scene.add(d1)
    const d2 = new THREE.DirectionalLight(0xffffff, 0.4)
    d2.position.set(-5,-5,-5); scene.add(d2)
    scene.add(new THREE.GridHelper(10,10,0x444444,0x222222))

    /* ctrl vectors */
    ctrlRef.current.target      = new THREE.Vector3()
    ctrlRef.current.spherical   = new THREE.Spherical(5, Math.PI/3, Math.PI/4)
    ctrlRef.current.panOffset   = new THREE.Vector3()

    /* decide which loader to call */
    const file = project.stlFile || project.stepFile
    const ext  = file.split('?')[0].split('.').pop().toLowerCase()
    if (ext === 'stl') loadSTL(file)
    else if (ext === 'step' || ext === 'stp') loadSTEP(file)
    else { setError('Unsupported format'); setIsLoading(false); setShowPopup(true) }

    /* resize */
    const onResize = () => {
      if (!containerRef.current) return
      cam.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      cam.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', onResize)

    /* loop */
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
  }, [project, threeReady])

  /* ---------- 3.  STL loader (kept as before) ---------- */
  function loadSTL(url) {
    const THREE = window.THREE
    const loader = new THREE.STLLoader()
    loader.load(
      url,
      geo => { finishMesh(geo) },
      () => {},
      err => { console.error(err); setError('STL load failed'); setIsLoading(false); setShowPopup(true) }
    )
  }

  /* ---------- 4.  STEP loader ---------- */
  function loadSTEP(url) {
    const THREE = window.THREE
    /* if the helper is not present, pull it once */
    if (!window.StepLoader) {
      const s = document.createElement('script')
      s.src = 'https://cdn.jsdelivr.net/npm/three-step-loader@1/dist/step-loader.min.js'
      s.onload = () => doLoadSTEP(url)
      s.onerror = () => { setError('STEP loader unavailable'); setIsLoading(false); setShowPopup(true) }
      document.head.appendChild(s)
    } else { doLoadSTEP(url) }

    function doLoadSTEP(u) {
      const loader = new window.StepLoader()
      loader.load(
        u,
        geo => { finishMesh(geo) },
        () => {},
        err => { console.error(err); setError('STEP load failed'); setIsLoading(false); setShowPopup(true) }
      )
    }
  }

  /* ---------- 5.  common mesh finaliser ---------- */
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
      color:new THREE.Color(project.color),
      specular:0x111111,
      shininess:200,
      flatShading:false
    })
    const mesh = new THREE.Mesh(geo, mat)
    sceneRef.current.add(mesh)
    meshRef.current = mesh
    setIsLoading(false)
  }

  /* ---------- 6.  camera update ---------- */
  const updateCamera = () => {
    const {spherical, target, panOffset} = ctrlRef.current
    const pos = new window.THREE.Vector3().setFromSpherical(spherical)
    cameraRef.current.position.copy(target).add(pos).add(panOffset)
    cameraRef.current.lookAt(target.clone().add(panOffset))
  }

  /* ---------- 7.  mouse / touch handlers ---------- */
  const handleMouseDown = e => {
    e.preventDefault()
    ctrlRef.current.isRotating = e.button === 0
    ctrlRef.current.isPanning  = e.button === 2
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
      c.spherical.phi   += dy * 0.01
      c.spherical.phi    = window.THREE.MathUtils.clamp(c.spherical.phi, 0.1, Math.PI-0.1)
    }
    if (c.isPanning) {
      const pan = new window.THREE.Vector3()
      pan.copy(cameraRef.current.position).sub(c.target).normalize()
      pan.cross(cameraRef.current.up).setLength(dx * 0.005)
      pan.addScaledVector(cameraRef.current.up, dy * 0.005)
      c.panOffset.add(pan)
    }
    c.lastX = e.clientX; c.lastY = e.clientY
  }
  const handleMouseUp = () => { ctrlRef.current.isRotating = ctrlRef.current.isPanning = false }
  const handleWheel = e => {
    e.preventDefault()
    ctrlRef.current.spherical.radius = Math.max(1, Math.min(20,
      ctrlRef.current.spherical.radius + e.deltaY * 0.01))
  }
  const handleContextMenu = e => e.preventDefault()

  /* touch */
  const handleTouchStart = e => { ctrlRef.current.touches = Array.from(e.touches) }
  const handleTouchMove = e => {
    e.preventDefault()
    const c = ctrlRef.current
    const touches = Array.from(e.touches)
    const prev = c.touches
    if (touches.length === 1 && prev.length === 1) {
      const dx = touches[0].clientX - prev[0].clientX
      const dy = touches[0].clientY - prev[0].clientY
      c.spherical.theta -= dx * 0.01
      c.spherical.phi    = window.THREE.MathUtils.clamp(c.spherical.phi + dy * 0.01, 0.1, Math.PI-0.1)
    } else if (touches.length === 2 && prev.length === 2) {
      const cur = Math.hypot(touches[0].clientX-touches[1].clientX, touches[0].clientY-touches[1].clientY)
      const p   = Math.hypot(prev[0].clientX-prev[1].clientX, prev[0].clientY-prev[1].clientY)
      c.spherical.radius = Math.max(1, Math.min(20, c.spherical.radius - (cur-p)*0.01))

      const cx=(touches[0].clientX+touches[1].clientX)/2, cy=(touches[0].clientY+touches[1].clientY)/2
      const pcx=(prev[0].clientX+prev[1].clientX)/2, pcy=(prev[0].clientY+prev[1].clientY)/2
      const pan=new window.THREE.Vector3()
      pan.copy(cameraRef.current.position).sub(c.target).normalize()
      pan.cross(cameraRef.current.up).setLength((cx-pcx)*0.005)
      pan.addScaledVector(cameraRef.current.up, (cy-pcy)*0.005)
      c.panOffset.add(pan)
    }
    c.touches = touches
  }
  const handleTouchEnd = () => { ctrlRef.current.touches = [] }

  /* ---------- 8.  view buttons ---------- */
  const resetView = () => {
    ctrlRef.current.spherical.set(5, Math.PI/3, Math.PI/4)
    ctrlRef.current.target.set(0,0,0)
    ctrlRef.current.panOffset.set(0,0,0)
    ctrlRef.current.viewState = {x:0,y:0,z:0}
  }
  const fitToScreen = () => {
    if (!meshRef.current) return
    const box = new window.THREE.Box3().setFromObject(meshRef.current)
    const center = box.getCenter(new window.THREE.Vector3())
    const size   = box.getSize(new window.THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = cameraRef.current.fov * Math.PI/180
    const dist = Math.abs(maxDim/2/Math.tan(fov/2))*1.3
    ctrlRef.current.target.copy(center)
    ctrlRef.current.spherical.radius = dist
    ctrlRef.current.panOffset.set(0,0,0)
  }
  const setViewX = () => {
    const s = ctrlRef.current.viewState.x
    ctrlRef.current.spherical.theta = s ? -Math.PI/2 : Math.PI/2
    ctrlRef.current.spherical.phi   = Math.PI/2
    ctrlRef.current.viewState.x = 1-s
  }
  const setViewY = () => {
    const s = ctrlRef.current.viewState.y
    ctrlRef.current.spherical.theta = 0
    ctrlRef.current.spherical.phi   = s ? Math.PI/2 : -Math.PI/2
    ctrlRef.current.viewState.y = 1-s
  }
  const setViewZ = () => {
    const s = ctrlRef.current.viewState.z
    ctrlRef.current.spherical.theta = s ? Math.PI : 0
    ctrlRef.current.spherical.phi   = Math.PI/2
    ctrlRef.current.viewState.z = 1-s
  }
  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = project.stlFile || project.stepFile
    a.download = project.title || 'model.' + (project.stlFile ? 'stl' : 'step')
    a.click()
  }

  /* ---------- 9.  inject loaders if not present ---------- */
  function injectExtraLoaders() {
    const THREE = window.THREE
    if (!THREE.STLLoader) injectSTLLoader()
    // StepLoader is loaded dynamically when needed
  }
  function injectSTLLoader() {
    // (same inline implementation you already had)
    const THREE = window.THREE
    THREE.STLLoader = function () { this.manager = THREE.DefaultLoadingManager }
    THREE.STLLoader.prototype = {
      load(url, onLoad, onProgress, onError) {
        const scope = this
        const l = new THREE.FileLoader(this.manager)
        l.setResponseType('arraybuffer')
        l.load(url, buf => onLoad(scope.parse(buf)), onProgress, onError)
      },
      parse(data) {
        const isBin = () => {
          const v = new DataView(data)
          const faces = v.getUint32(80, true)
          return 80 + 4 + faces * 50 === v.byteLength
        }
        return isBin() ? parseBinary(data) : parseASCII(new TextDecoder().decode(data))
        function parseBinary(buffer) {
          const v = new DataView(buffer), faces = v.getUint32(80, true)
          const geo = new THREE.BufferGeometry()
          const positions = new Float32Array(faces * 3 * 3)
          const normals   = new Float32Array(faces * 3 * 3)
          for (let i = 0; i < faces; i++) {
            const start = 84 + i * 50
            const norm = new THREE.Vector3(v.getFloat32(start, true), v.getFloat32(start + 4, true), v.getFloat32(start + 8, true))
            for (let j = 1; j <= 3; j++) {
              const vs = start + j * 12, k = (i * 3 + j - 1) * 3
              positions[k] = v.getFloat32(vs, true); positions[k + 1] = v.getFloat32(vs + 4, true); positions[k + 2] = v.getFloat32(vs + 8, true)
              normals[k] = norm.x; normals[k + 1] = norm.y; normals[k + 2] = norm.z
            }
          }
          geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
          geo.setAttribute('normal',   new THREE.BufferAttribute(normals, 3))
          return geo
        }
        function parseASCII(str) {
          const geo = new THREE.BufferGeometry()
          const vertices = [], normals = []
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
          geo.setAttribute('normal',   new THREE.BufferAttribute(new Float32Array(normals), 3))
          return geo
        }
      }
    }
  }

  /* ---------- 10.  render ---------- */
  if (!project) return null

  return (
    <>
      {showPopup && (
        <div
          style={{
            position:'fixed', inset:0, zIndex:200, display:'flex',
            alignItems:'center', justifyContent:'center',
            background:'rgba(0,0,0,.85)', backdropFilter:'blur(8px)',
            animation:'fadeIn .3s ease'
          }}
          onClick={() => { setShowPopup(false); onClose() }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth:'500px', width:'90%',
              background:'linear-gradient(135deg,rgba(15,20,32,.98),rgba(10,14,26,.98))',
              borderRadius:'20px', border:'2px solid rgba(255,100,100,.5)',
              boxShadow:'0 20px 60px rgba(0,0,0,.8)', padding:'2rem',
              animation:'slideUp .4s cubic-bezier(.4,0,.2,1)', textAlign:'center'
            }}
          >
            <div style={{
              width:'80px', height:'80px', margin:'0 auto 1.5rem',
              borderRadius:'50%',
              background:'linear-gradient(135deg,rgba(255,100,100,.2),rgba(255,100,100,.05))',
              display:'flex', alignItems:'center', justifyContent:'center'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,100,100,.9)" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2 style={{ fontSize:'1.5rem', fontWeight:'700', marginBottom:'1rem', color:'#fff' }}>Model Unavailable</h2>
            <p style={{ fontSize:'1rem', lineHeight:'1.6', color:'rgba(255,255,255,.8)', marginBottom:'1.5rem' }}>
              This 3D model is currently unavailable. As a student who transitioned between institutions,
              I temporarily lack access to the software licenses required to export and showcase these models.
              I&apos;m working to restore access to provide you with the full interactive experience.
            </p>
            <button
              onClick={() => { setShowPopup(false); onClose() }}
              style={{
                padding:'.875rem 2rem',
                background:'linear-gradient(135deg,rgba(255,100,100,.8),rgba(255,100,100,.6))',
                color:'#fff', border:'none', borderRadius:'12px', fontSize:'1rem', fontWeight:'600',
                cursor:'pointer', transition:'all .2s ease', width:'100%'
              }}
              onMouseOver={e => { e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow='0 6px 16px rgba(255,100,100,.4)' }}
              onMouseOut={e => { e.target.style.transform='translateY(0)'; e.target.style.boxShadow='none' }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {!showPopup && (
        <div
          style={{
            position:'fixed', inset:0, zIndex:100, display:'flex',
            alignItems:'center', justifyContent:'center', animation:'fadeIn .3s ease'
          }}
          onClick={onClose}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.95)', backdropFilter:'blur(8px)' }} />

          {/* top control bar */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position:'absolute', top:'2rem', left:'50%', transform:'translateX(-50%)',
              display:'flex', gap:'.5rem', background:'rgba(0,0,0,.8)', backdropFilter:'blur(12px)',
              padding:'.75rem 1rem', borderRadius:'16px', border:'1px solid rgba(255,255,255,.1)',
              zIndex:10, animation:'slideDown .4s ease'
            }}
          >
            <div style={{
              padding:'0 1rem', display:'flex', alignItems:'center', fontSize:'.9rem',
              fontWeight:'600', color:'#fff', borderRight:'1px solid rgba(255,255,255,.2)',
              maxWidth:'300px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'
            }}>
              {project.title || 'CAD Model'}
            </div>

            <button onClick={setViewX} className="control-button" title="View X axis (toggle +X/-X)" style={{
              width:'40px', height:'40px', borderRadius:'10px',
              background:'rgba(255,100,100,.2)', border:'1px solid rgba(255,100,100,.4)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'.85rem', fontWeight:'700', color:'#ff6464'
            }}>X</button>

            <button onClick={setViewY} className="control-button" title="View Y axis (toggle +Y/-Y)" style={{
              width:'40px', height:'40px', borderRadius:'10px',
              background:'rgba(100,255,100,.2)', border:'1px solid rgba(100,255,100,.4)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'.85rem', fontWeight:'700', color:'#64ff64'
            }}>Y</button>

            <button onClick={setViewZ} className="control-button" title="View Z axis (toggle +Z/-Z)" style={{
              width:'40px', height:'40px', borderRadius:'10px',
              background:'rgba(100,100,255,.2)', border:'1px solid rgba(100,100,255,.4)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'.85rem', fontWeight:'700', color:'#6464ff'
            }}>Z</button>

            <div style={{ width:'1px', height:'40px', background:'rgba(255,255,255,.2)', margin:'0 .25rem' }} />

            <button onClick={resetView} className="control-button" title="Reset View" style={{
              width:'40px', height:'40px', borderRadius:'10px',
              background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.15)',
              display:'flex', alignItems:'center', justifyContent:'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 12a9 9 0 109 9 9 9 0 00-9-9z" stroke="white" strokeWidth="2"/>
                <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <button onClick={fitToScreen} className="control-button" title="Fit to Screen" style={{
              width:'40px', height:'40px', borderRadius:'10px',
              background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.15)',
              display:'flex', alignItems:'center', justifyContent:'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 9l6 6m0-6l-6 6"/>
              </svg>
            </button>

            <div style={{ width:'1px', height:'40px', background:'rgba(255,255,255,.2)', margin:'0 .25rem' }} />

            <button onClick={handleDownload} className="control-button" title="Download" style={{
              width:'40px', height:'40px', borderRadius:'10px',
              background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.15)',
              display:'flex', alignItems:'center', justifyContent:'center'
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
              position:'absolute', top:'2rem', right:'2rem',
              width:'48px', height:'48px', borderRadius:'50%',
              background:'rgba(0,0,0,.8)', backdropFilter:'blur(12px)',
              border:'1px solid rgba(255,255,255,.1)', display:'flex',
              alignItems:'center', justifyContent:'center', zIndex:10,
              animation:'slideDown .4s ease'
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
              position:'relative', width:'90%', height:'90%',
              display:'flex', alignItems:'center', justifyContent:'center',
              overflow:'hidden', cursor:ctrlRef.current.isRotating || ctrlRef.current.isPanning ? 'grabbing' : 'grab',
              userSelect:'none'
            }}
          >
            {isLoading && !error && (
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', color:'#fff' }}>
                Loading 3D model...
              </div>
            )}
          </div>

          {/* help text */}
          <div
            style={{
              position:'absolute', bottom:'2rem', left:'50%', transform:'translateX(-50%)',
              background:'rgba(0,0,0,.8)', backdropFilter:'blur(12px)', padding:'.75rem 1.5rem',
              borderRadius:'12px', border:'1px solid rgba(255,255,255,.1)', fontSize:'.85rem',
              color:'rgba(255,255,255,.7)', display:'flex', gap:'2rem',
              animation:'slideUp .4s ease', zIndex:10
            }}
          >
            <span><kbd style={{ background:'rgba(255,255,255,.1)', padding:'.25rem .5rem', borderRadius:'4px', fontFamily:'monospace', fontSize:'.8rem' }}>Drag</kbd> to rotate</span>
            <span><kbd style={{ background:'rgba(255,255,255,.1)', padding:'.25rem .5rem', borderRadius:'4px', fontFamily:'monospace', fontSize:'.8rem' }}>Scroll</kbd> to zoom</span>
            <span><kbd style={{ background:'rgba(255,255,255,.1)', padding:'.25rem .5rem', borderRadius:'4px', fontFamily:'monospace', fontSize:'.8rem' }}>Right-click</kbd> to pan</span>
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