"use client"
import { useState, useEffect, useRef } from 'react'
import CADGLTFList from '../consts/CADGLTFList'

// GLTFViewerModal Component with STL Support and Model Rotation
function GLTFViewerModal({ project, onClose }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const meshRef = useRef(null)
  const animationRef = useRef(null)
  const [threeReady, setThreeReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [error, setError] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [isTransparent, setIsTransparent] = useState(project.transparency > 0)
  const [showInfo, setShowInfo] = useState(true)
  const [modelRotation, setModelRotation] = useState(project.modelRotation || { x: 0, y: 0, z: 0 })

  const ctrlRef = useRef({
    isRotating: false,
    isPanning: false,
    lastX: 0,
    lastY: 0,
    target: null,
    spherical: null,
    panOffset: null,
    viewState: { x: 0, y: 0, z: 0, perp: 0 }
  })

  const fileExtension = project.gltfFile.toLowerCase().split('.').pop()
  const isSTL = fileExtension === 'stl'
  const isGLTF = fileExtension === 'gltf' || fileExtension === 'glb'

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const loadThreeJS = async () => {
      if (!window.THREE) {
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
        script.onload = () => loadModelLoader()
        script.onerror = () => {
          setError('Could not load 3D engine')
          setShowPopup(true)
        }
        document.head.appendChild(script)
      } else {
        loadModelLoader()
      }
    }

    const loadModelLoader = () => {
      if (isSTL) {
        loadSTLLoader()
      } else if (isGLTF) {
        loadGLTFLoader()
      } else {
        setError('Unsupported file format')
        setShowPopup(true)
      }
    }

    const loadSTLLoader = () => {
      if (!window.THREE.STLLoader) {
        const loaderScript = document.createElement('script')
        loaderScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/STLLoader.js'
        loaderScript.onload = () => {
          setThreeReady(true)
          setLoadingProgress(20)
        }
        loaderScript.onerror = () => {
          setError('Could not load STL loader')
          setShowPopup(true)
        }
        document.head.appendChild(loaderScript)
      } else {
        setThreeReady(true)
        setLoadingProgress(20)
      }
    }

    const loadGLTFLoader = () => {
      if (!window.THREE.GLTFLoader) {
        const loaderScript = document.createElement('script')
        loaderScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js'
        loaderScript.onload = () => {
          setThreeReady(true)
          setLoadingProgress(20)
        }
        loaderScript.onerror = () => {
          setError('Could not load GLTF loader')
          setShowPopup(true)
        }
        document.head.appendChild(loaderScript)
      } else {
        setThreeReady(true)
        setLoadingProgress(20)
      }
    }

    loadThreeJS()
  }, [isSTL, isGLTF])

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

    ctrlRef.current.target = new THREE.Vector3()
    ctrlRef.current.spherical = new THREE.Spherical(5, Math.PI / 3, Math.PI / 4)
    ctrlRef.current.panOffset = new THREE.Vector3()

    loadModel(project.gltfFile)

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

  function loadModel(url) {
    const THREE = window.THREE
    setLoadingProgress(40)
    setIsLoading(true)

    if (isSTL) {
      loadSTLModel(url, THREE)
    } else if (isGLTF) {
      loadGLTFModel(url, THREE)
    }
  }

  function loadSTLModel(url, THREE) {
    if (!THREE.STLLoader) {
      setError('STL Loader not available')
      setShowPopup(true)
      setIsLoading(false)
      return
    }

    const loader = new THREE.STLLoader()
    
    loader.load(
      url,
      (geometry) => {
        setLoadingProgress(80)
        
        geometry.computeBoundingBox()
        const center = new THREE.Vector3()
        geometry.boundingBox.getCenter(center)
        geometry.translate(-center.x, -center.y, -center.z)
        geometry.computeVertexNormals()
        
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color(project.modelColor || project.color),
          transparent: isTransparent,
          opacity: isTransparent ? project.transparency / 100 : 1.0,
          side: THREE.DoubleSide,
          shininess: 30
        })
        
        const mesh = new THREE.Mesh(geometry, material)
        mesh.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z)
        
        const bbox = new THREE.Box3().setFromObject(mesh)
        const size = bbox.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2 / maxDim
        mesh.scale.setScalar(scale)
        
        sceneRef.current.add(mesh)
        meshRef.current = mesh
        setIsLoading(false)
        setLoadingProgress(100)
      },
      (xhr) => {
        const progress = (xhr.loaded / xhr.total) * 100
        setLoadingProgress(Math.min(progress, 95))
      },
      (error) => {
        console.error('Error loading STL:', error)
        setError('model_unavailable')
        setShowPopup(true)
        setIsLoading(false)
      }
    )
  }

  function loadGLTFModel(url, THREE) {
    if (!THREE.GLTFLoader) {
      setError('GLTF Loader not available')
      setShowPopup(true)
      setIsLoading(false)
      return
    }

    const loader = new THREE.GLTFLoader()
    
    loader.load(
      url,
      (gltf) => {
        setLoadingProgress(80)
        const model = gltf.scene
        model.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z)
        
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        
        model.position.sub(center)
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2 / maxDim
        model.scale.setScalar(scale)
        
        model.traverse((child) => {
          if (child.isMesh) {
            if (project.modelColor) {
              child.material.color = new THREE.Color(project.modelColor)
            }
            if (isTransparent) {
              child.material.transparent = true
              child.material.opacity = project.transparency / 100
            }
            child.material.needsUpdate = true
          }
        })
        
        sceneRef.current.add(model)
        meshRef.current = model
        setIsLoading(false)
        setLoadingProgress(100)
      },
      (xhr) => {
        const progress = (xhr.loaded / xhr.total) * 100
        setLoadingProgress(Math.min(progress, 95))
      },
      (error) => {
        console.error('Error loading GLTF:', error)
        setError('model_unavailable')
        setShowPopup(true)
        setIsLoading(false)
      }
    )
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
    ctrlRef.current.viewState = { x: 0, y: 0, z: 0, perp: 0 }
    
    const originalRotation = project.modelRotation || { x: 0, y: 0, z: 0 }
    setModelRotation(originalRotation)
    if (meshRef.current) {
      meshRef.current.rotation.set(originalRotation.x, originalRotation.y, originalRotation.z)
    }
  }

  const toggleTransparency = () => {
    if (!meshRef.current) return
    const newTransparent = !isTransparent
    setIsTransparent(newTransparent)
    
    if (isSTL) {
      meshRef.current.material.transparent = newTransparent
      meshRef.current.material.opacity = newTransparent ? project.transparency / 100 : 1.0
      meshRef.current.material.needsUpdate = true
    } else {
      meshRef.current.traverse((child) => {
        if (child.isMesh) {
          child.material.transparent = newTransparent
          child.material.opacity = newTransparent ? project.transparency / 100 : 1.0
          if (project.modelColor) {
            child.material.color = new window.THREE.Color(project.modelColor)
          }
          child.material.needsUpdate = true
        }
      })
    }
  }

  const setViewX = () => {
    const s = ctrlRef.current.viewState.x
    ctrlRef.current.spherical.theta = s ? -Math.PI / 2 : Math.PI / 2
    ctrlRef.current.spherical.phi = Math.PI / 2
    ctrlRef.current.viewState = { x: 1 - s, y: 0, z: 0, perp: 0 }
  }

  const setViewY = () => {
    const s = ctrlRef.current.viewState.y
    ctrlRef.current.spherical.theta = 0
    ctrlRef.current.spherical.phi = s ? 0.1 : Math.PI - 0.1
    ctrlRef.current.viewState = { x: 0, y: 1 - s, z: 0, perp: 0 }
  }

  const setViewZ = () => {
    const s = ctrlRef.current.viewState.z
    ctrlRef.current.spherical.theta = s ? Math.PI : 0
    ctrlRef.current.spherical.phi = Math.PI / 2
    ctrlRef.current.viewState = { x: 0, y: 0, z: 1 - s, perp: 0 }
  }

  const setViewPerpendicular = () => {
    ctrlRef.current.spherical.theta += Math.PI / 2
    ctrlRef.current.viewState.perp = (ctrlRef.current.viewState.perp + 1) % 4
  }

  const rotateModelX = () => {
    if (!meshRef.current) return
    const newRotation = { ...modelRotation, x: modelRotation.x + Math.PI / 2 }
    setModelRotation(newRotation)
    meshRef.current.rotation.x += Math.PI / 2
  }

  const rotateModelY = () => {
    if (!meshRef.current) return
    const newRotation = { ...modelRotation, y: modelRotation.y + Math.PI / 2 }
    setModelRotation(newRotation)
    meshRef.current.rotation.y += Math.PI / 2
  }

  const rotateModelZ = () => {
    if (!meshRef.current) return
    const newRotation = { ...modelRotation, z: modelRotation.z + Math.PI / 2 }
    setModelRotation(newRotation)
    meshRef.current.rotation.z += Math.PI / 2
  }

  return (
    <>
      {showPopup && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(8px)', animation: 'fadeIn .3s ease' }} onClick={() => { setShowPopup(false); onClose() }}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '540px', width: '90%', background: 'linear-gradient(135deg,rgba(15,20,32,.98),rgba(10,14,26,.98))', borderRadius: '20px', border: '2px solid rgba(255,180,100,.4)', boxShadow: '0 20px 60px rgba(0,0,0,.8)', padding: '2.5rem', animation: 'slideUp .4s cubic-bezier(.4,0,.2,1)', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', borderRadius: '50%', background: 'linear-gradient(135deg,rgba(255,180,100,.2),rgba(255,180,100,.05))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,180,100,.9)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#fff' }}>Model Currently Unavailable</h2>
            <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'rgba(255,255,255,.85)', marginBottom: '1.5rem' }}>As I've recently transitioned between colleges, I no longer have access to the same CAD software and tools. Unfortunately, this means I'm currently unable to showcase this 3D model. I'm working on regaining access to properly display my portfolio work.</p>
            <button onClick={() => { setShowPopup(false); onClose() }} style={{ padding: '.875rem 2rem', background: 'linear-gradient(135deg,rgba(255,180,100,.85),rgba(255,180,100,.65))', color: '#0a0e1a', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'all .2s ease', width: '100%' }}>Understood</button>
          </div>
        </div>
      )}

      {!showPopup && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', background: 'rgba(0,0,0,.95)', backdropFilter: 'blur(8px)' }} onClick={onClose} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '.5rem', background: 'rgba(0,0,0,.8)', backdropFilter: 'blur(12px)', padding: '.75rem 1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,.1)', zIndex: 10 }}>
            <div style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', fontSize: '.9rem', fontWeight: '600', color: '#fff', borderRight: '1px solid rgba(255,255,255,.2)' }}>{project.title}</div>
            <button onClick={setViewX} title="View X axis" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,100,100,.2)', border: '1px solid rgba(255,100,100,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', fontWeight: '700', color: '#ff6464', cursor: 'pointer' }}>X</button>
            <button onClick={setViewY} title="View Y axis" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(100,255,100,.2)', border: '1px solid rgba(100,255,100,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', fontWeight: '700', color: '#64ff64', cursor: 'pointer' }}>Y</button>
            <button onClick={setViewZ} title="View Z axis" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(100,100,255,.2)', border: '1px solid rgba(100,100,255,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', fontWeight: '700', color: '#6464ff', cursor: 'pointer' }}>Z</button>
            <button onClick={setViewPerpendicular} title="Perpendicular View" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,100,.2)', border: '1px solid rgba(255,255,100,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', fontWeight: '700', color: '#ffff64', cursor: 'pointer' }}>⊥</button>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,.2)', margin: '0 .25rem' }} />
            <button onClick={rotateModelX} title="Rotate Model X+90°" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,100,100,.15)', border: '1px solid rgba(255,100,100,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: '700', color: '#ff6464', cursor: 'pointer', flexDirection: 'column', lineHeight: '1' }}><span>X</span><span style={{ fontSize: '.6rem' }}>↻</span></button>
            <button onClick={rotateModelY} title="Rotate Model Y+90°" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(100,255,100,.15)', border: '1px solid rgba(100,255,100,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: '700', color: '#64ff64', cursor: 'pointer', flexDirection: 'column', lineHeight: '1' }}><span>Y</span><span style={{ fontSize: '.6rem' }}>↻</span></button>
            <button onClick={rotateModelZ} title="Rotate Model Z+90°" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(100,100,255,.15)', border: '1px solid rgba(100,100,255,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: '700', color: '#6464ff', cursor: 'pointer', flexDirection: 'column', lineHeight: '1' }}><span>Z</span><span style={{ fontSize: '.6rem' }}>↻</span></button>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,.2)', margin: '0 .25rem' }} />
            <button onClick={resetView} title="Reset View" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 109 9 9 9 0 00-9-9z" stroke="currentColor" strokeWidth="2" /><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
            {project.transparency > 0 && (<button onClick={toggleTransparency} title="Toggle Transparency" style={{ width: '40px', height: '40px', borderRadius: '10px', background: isTransparent ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.5" /><circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" /></svg></button>)}
          </div>
          <button onClick={onClose} style={{ position: 'absolute', top: '2rem', right: '2rem', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,0,0,.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, cursor: 'pointer', color: '#fff' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          <div ref={containerRef} onClick={(e) => e.stopPropagation()} onWheel={handleWheel} onMouseDown={handleMouseDown} onContextMenu={(e) => e.preventDefault()} style={{ flex: 1, position: 'relative', display: 'flex', cursor: ctrlRef.current.isRotating || ctrlRef.current.isPanning ? 'grabbing' : 'grab', userSelect: 'none' }}>
            {isLoading && (<div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#fff', gap: '1.5rem', background: 'rgba(10, 14, 26, 0.95)' }}><div style={{ width: '60px', height: '60px', border: '4px solid rgba(255, 255, 255, 0.1)', borderTop: '4px solid hsl(30, 100%, 60%)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div><div style={{ textAlign: 'center', maxWidth: '300px' }}>Loading 3D model...</div>{loadingProgress > 0 && (<div style={{ width: '300px', height: '6px', background: 'rgba(255,255,255,.1)', borderRadius: '3px', overflow: 'hidden' }}><div style={{ width: `${loadingProgress}%`, height: '100%', background: 'linear-gradient(90deg, hsl(30, 100%, 60%), hsl(30, 100%, 70%))', transition: 'width 0.3s ease' }} /></div>)}</div>)}
          </div>
          {showInfo && (<div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', width: '320px', maxHeight: '80vh', overflowY: 'auto', background: 'rgba(0,0,0,.9)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,.1)', padding: '1.5rem', zIndex: 10 }}><button onClick={() => setShowInfo(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>✕</button><div style={{ fontSize: '12px', color: project.color, fontWeight: '600', marginBottom: '8px' }}>{project.category}</div><h3 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>{project.title}</h3><p style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,.7)', marginBottom: '20px' }}>{project.description}</p><div style={{ marginBottom: '16px' }}><div style={{ fontSize: '12px', color: 'rgba(255,255,255,.5)', marginBottom: '8px' }}>YEAR</div><div style={{ fontSize: '16px', color: '#fff', fontWeight: '600' }}>{project.year}</div></div><div style={{ marginBottom: '16px' }}><div style={{ fontSize: '12px', color: 'rgba(255,255,255,.5)', marginBottom: '8px' }}>FILE FORMAT</div><div style={{ fontSize: '14px', color: '#fff', fontWeight: '600', padding: '6px 12px', background: 'rgba(255,255,255,.1)', borderRadius: '6px', display: 'inline-block', fontFamily: 'monospace' }}>{fileExtension.toUpperCase()}</div></div><div><div style={{ fontSize: '12px', color: 'rgba(255,255,255,.5)', marginBottom: '8px' }}>MODEL ROTATION (deg)</div><div style={{ fontSize: '12px', fontFamily: 'monospace', color: 'rgba(255,255,255,.7)', display: 'flex', gap: '12px' }}><span>X: {Math.round(modelRotation.x * 180 / Math.PI)}°</span><span>Y: {Math.round(modelRotation.y * 180 / Math.PI)}°</span><span>Z: {Math.round(modelRotation.z * 180 / Math.PI)}°</span></div></div></div>)}
          {!showInfo && (<button onClick={() => setShowInfo(true)} style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,0,0,.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 10 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>)}
          <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,.8)', backdropFilter: 'blur(12px)', padding: '.75rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,.1)', fontSize: '.85rem', color: 'rgba(255,255,255,.7)', display: 'flex', gap: '2rem', zIndex: 10 }}><span><kbd style={{ background: 'rgba(255,255,255,.1)', padding: '.25rem .5rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '.8rem' }}>Drag</kbd> to rotate</span><span><kbd style={{ background: 'rgba(255,255,255,.1)', padding: '.25rem .5rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '.8rem' }}>Scroll</kbd> to zoom</span><span><kbd style={{ background: 'rgba(255,255,255,.1)', padding: '.25rem .5rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '.8rem' }}>Right-click</kbd> to pan</span></div>
          <style jsx>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } } @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } } @keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }`}</style>
        </div>
      )}
    </>
  )
}

export default function CADGalleryNormalized() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [scale, setScale] = useState(1)
  const [currentPage, setCurrentPage] = useState(0)
  const scrollContainerRef = useRef(null)
  const BASE_WIDTH = 1920
  const BASE_HEIGHT = 1080
  const PROJECTS_PER_PAGE = 4

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

  const projects = CADGLTFList
  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE)

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
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', width: BASE_WIDTH, height: BASE_HEIGHT, position: 'relative', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '1400px', height: '900px', display: 'flex', flexDirection: 'column', gap: '0' }}>
          <div style={{ flexShrink: 0, marginBottom: '32px' }}>
            <div style={{ fontSize: '14px', color: 'hsl(140, 70%, 60%)', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>3D Design Portfolio</div>
            <h2 style={{ fontSize: '56px', fontWeight: '700', marginBottom: '16px', background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: '1.1' }}>CAD Projects</h2>
            <p style={{ fontSize: '18px', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.68)', maxWidth: '900px' }}>Explore my mechanical design work — from precision engineering to creative product design.</p>
          </div>
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '24px', flexShrink: 0 }}>
              <button onClick={() => scrollToPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0} style={{ width: '44px', height: '44px', borderRadius: '50%', background: currentPage === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.15)', cursor: currentPage === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: currentPage === 0 ? 0.3 : 1, transition: 'all 0.3s ease' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>{Array.from({ length: totalPages }).map((_, idx) => (<button key={idx} onClick={() => scrollToPage(idx)} style={{ width: idx === currentPage ? '52px' : '36px', height: '7px', borderRadius: '4px', background: idx === currentPage ? 'hsl(140, 70%, 60%)' : 'rgba(255, 255, 255, 0.15)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: idx === currentPage ? '0 0 12px hsl(140, 70%, 60% / 0.5)' : 'none' }} />))}</div>
              <button onClick={() => scrollToPage(Math.min(totalPages - 1, currentPage + 1))} disabled={currentPage === totalPages - 1} style={{ width: '44px', height: '44px', borderRadius: '50%', background: currentPage === totalPages - 1 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.15)', cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: currentPage === totalPages - 1 ? 0.3 : 1, transition: 'all 0.3s ease' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            </div>
          )}
          <div ref={scrollContainerRef} style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory', display: 'flex', WebkitOverflowScrolling: 'touch', minHeight: 0 }}>
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div key={pageIndex} style={{ minWidth: '100%', width: '100%', height: '100%', flexShrink: 0, scrollSnapAlign: 'start', scrollSnapStop: 'always', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '24px', width: '100%', height: '100%', maxHeight: '720px' }}>
                  {projects.slice(pageIndex * PROJECTS_PER_PAGE, (pageIndex + 1) * PROJECTS_PER_PAGE).map((project) => (
                    <div key={project.id} style={{ borderRadius: '16px', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))', border: '1px solid rgba(255, 255, 255, 0.08)', transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease', display: 'flex', flexDirection: 'column', position: 'relative', height: '100%' }} className="cad-card">
                      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                        <img src={project.coverPhoto} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', top: '12px', left: '12px', padding: '6px 12px', background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '6px', fontSize: '14px', fontWeight: '700', color: project.color }}>{project.year}</div>
                        <h3 style={{ position: 'absolute', bottom: '16px', left: '16px', fontSize: '22px', fontWeight: '700', color: '#fff', margin: 0, maxWidth: '60%', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{project.title}</h3>
                        <button onClick={() => setSelectedProject(project)} style={{ position: 'absolute', bottom: '16px', right: '16px', padding: '12px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(12px)', color: project.color, border: `1px solid ${project.color}60`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease', boxShadow: `0 4px 16px ${project.color}30` }} className="view-3d-button"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L2 7L12 12L22 7L12 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L12 22L22 17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12L12 17L22 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>View 3D</button>
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
      <style jsx>{`div::-webkit-scrollbar { display: none; } .cad-card:hover { transform: translateY(-6px); border-color: rgba(255, 255, 255, 0.2); box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5); } .view-3d-button:hover { transform: scale(1.08); background: rgba(0, 0, 0, 0.95) !important; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7) !important; } .view-3d-button:active { transform: scale(1); }`}</style>
    </>
  )
}