import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// STEPViewerModal.jsx
// Enhanced to load opencascade via jsDelivr, be resilient to exported constructor suffixes,
// and provide a transparency/outline toggle.

export default function STEPViewerModal({ isOpen, onClose, file }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);
  const edgesRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Transparent outline toggle
  const [transparentMode, setTransparentMode] = useState(false);

  // Load opencascade like STLViewerModal: inject jsDelivr script and use window.opencascade
  useEffect(() => {
    if (!window.opencascade) {
      const existing = document.querySelector('script[data-opencascade-loader]');
      if (!existing) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/opencascade.js/opencascade.wasm.js";
        script.async = true;
        script.setAttribute("data-opencascade-loader", "true");
        script.onload = () => {
          console.log("opencascade script loaded, window.opencascade:", !!window.opencascade);
          console.log("opencascade available keys:", Object.keys(window.opencascade || {}));
        };
        script.onerror = (e) => {
          console.error("Failed to load opencascade script", e);
          setError("Failed to load opencascade library (network error)");
        };
        document.body.appendChild(script);
      } else {
        // If script tag already present but opencascade still not available, we still log later
        console.log("opencascade loader script already present");
      }
    } else {
      console.log("opencascade already present on window");
      console.log("opencascade available keys:", Object.keys(window.opencascade || {}));
    }
  }, []);

  // Helper to robustly get constructors/exports from window.opencascade
  function getOcctCtor(baseName) {
    if (!window.opencascade) return null;
    const tries = ["", "_1", "_2", "_3"];
    for (const s of tries) {
      const name = baseName + s;
      const v = window.opencascade[name];
      if (typeof v === "function" || typeof v === "object") {
        // return whatever's available (constructor function or namespace object)
        return v;
      }
    }
    return null;
  }

  // Utility to clear existing scene objects
  function clearScene() {
    try {
      if (sceneRef.current) {
        while (sceneRef.current.children.length) {
          const child = sceneRef.current.children[0];
          sceneRef.current.remove(child);
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
            else child.material.dispose();
          }
        }
      }
      meshRef.current = null;
      if (edgesRef.current) {
        edgesRef.current.geometry && edgesRef.current.geometry.dispose();
        edgesRef.current = null;
      }
    } catch (e) {
      console.warn("Error while clearing scene:", e);
    }
  }

  // Initialize Three scene
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(3, 3, 3);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 7.5);
    scene.add(dir);

    mount.appendChild(renderer.domElement);

    let raf = null;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      renderer.domElement && mount.removeChild(renderer.domElement);
      clearScene();
      renderer.dispose();
    };
  }, []);

  // Re-tessellate or adjust materials when transparentMode changes
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    if (!mesh.material) return;

    if (transparentMode) {
      mesh.material.transparent = true;
      mesh.material.opacity = 0.15;
      // create or show edges
      if (!edgesRef.current) {
        try {
          const edgesGeom = new THREE.EdgesGeometry(mesh.geometry, 1e-3);
          const mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 });
          const edges = new THREE.LineSegments(edgesGeom, mat);
          edges.renderOrder = 999;
          edgesRef.current = edges;
          sceneRef.current && sceneRef.current.add(edges);
        } catch (e) {
          console.warn("Failed to create edges geometry:", e);
        }
      } else {
        edgesRef.current.visible = true;
      }
    } else {
      mesh.material.transparent = false;
      mesh.material.opacity = 1.0;
      if (edgesRef.current) edgesRef.current.visible = false;
    }
  }, [transparentMode]);

  // Helper: create a Three mesh from geometry and add to scene
  function addThreeMesh(geometry, materialOptions = { color: 0x888888 }) {
    clearScene();
    const mat = new THREE.MeshStandardMaterial({ ...materialOptions });
    const mesh = new THREE.Mesh(geometry, mat);
    meshRef.current = mesh;
    sceneRef.current && sceneRef.current.add(mesh);
    // compute bounding and adjust camera
    geometry.computeBoundingSphere && geometry.computeBoundingSphere();
    const bs = geometry.boundingSphere;
    if (bs && cameraRef.current) {
      const r = bs.radius;
      cameraRef.current.position.set(r * 3, r * 3, r * 3);
      cameraRef.current.lookAt(bs.center);
    }
    // edges initially hidden unless transparentMode
    if (transparentMode) {
      try {
        const edgesGeom = new THREE.EdgesGeometry(geometry, 1e-3);
        const mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 });
        const edges = new THREE.LineSegments(edgesGeom, mat);
        edges.renderOrder = 999;
        edgesRef.current = edges;
        sceneRef.current && sceneRef.current.add(edges);
      } catch (e) {
        console.warn("Failed to create initial edges:", e);
      }
    }
  }

  // Tessellate OCCT shape into Three geometry
  function tessellateShape(shape) {
    try {
      if (!window.opencascade) {
        setError("opencascade is not loaded yet");
        return;
      }

      // Get BRep_Tool namespace/object and TopoDS.Face constructor
      const BRep_Tool = getOcctCtor("BRep_Tool");
      const TopoDS_Face = getOcctCtor("TopoDS_Face");
      const TopExp_Explorer = getOcctCtor("TopExp_Explorer");
      const TopLoc_Location = getOcctCtor("TopLoc_Location");

      if (!BRep_Tool) {
        setError("Missing occt export: BRep_Tool (tried variants). Can't triangulate.");
        return;
      }

      if (!TopoDS_Face && typeof TopoDS_Face !== "function") {
        // Some builds export TopoDS.Face_1 as TopoDS_Face_1 or TopoDS.Face
        // We'll be defensive but continue; TopoDS.Face is used for type-checking, skip if absent.
        console.warn("TopoDS.Face constructor not found; proceeding with best-effort triangulation");
      }

      // Explore faces
      const explorerCtor = getOcctCtor("TopExp_Explorer");
      const FaceClass = getOcctCtor("TopoDS_Face") || getOcctCtor("TopoDS.Face_1") || getOcctCtor("TopoDS_Face_1");
      const explorer = explorerCtor ? new explorerCtor(shape, /* kind=*/ 4 /* TopAbs_FACE */) : null;

      const vertices = [];
      const normals = [];
      const indices = [];

      // If TopExp_Explorer not available, try alternative approach: traverse with TopoDS compound handling
      if (!explorer) {
        console.warn("TopExp_Explorer not available - attempting to treat whole shape as single face for triangulation");
      }

      // Iterate faces (if explorer available)
      if (explorer) {
        const TopAbs_FACE = 4;
        for (; !explorer.More().isNull && explorer.More(); explorer.Next()) {
          const face = explorer.Current();
          // For each face, get triangulation
          const loc = new TopLoc_Location(0);
          let tri = null;
          try {
            tri = BRep_Tool.Triangulation(face, loc);
          } catch (e) {
            console.warn("BRep_Tool.Triangulation call failed for a face:", e);
            tri = null;
          }
          if (!tri) continue;

          const nnodes = tri.NbNodes();
          const ntris = tri.NbTriangles();
          const nodeBuffer = [];

          for (let i = 1; i <= nnodes; i++) {
            const p = tri.Node(i);
            // x, y, z
            nodeBuffer.push(p.x());
            nodeBuffer.push(p.y());
            nodeBuffer.push(p.z());
          }

          for (let t = 1; t <= ntris; t++) {
            const triIdx = tri.Triangle(t);
            const a = triIdx.Value(1);
            const b = triIdx.Value(2);
            const c = triIdx.Value(3);
            const base = vertices.length / 3;
            // push vertices for this simple approach
            const ax = nodeBuffer[(a - 1) * 3];
            const ay = nodeBuffer[(a - 1) * 3 + 1];
            const az = nodeBuffer[(a - 1) * 3 + 2];
            const bx = nodeBuffer[(b - 1) * 3];
            const by = nodeBuffer[(b - 1) * 3 + 1];
            const bz = nodeBuffer[(b - 1) * 3 + 2];
            const cx = nodeBuffer[(c - 1) * 3];
            const cy = nodeBuffer[(c - 1) * 3 + 1];
            const cz = nodeBuffer[(c - 1) * 3 + 2];

            vertices.push(ax, ay, az, bx, by, bz, cx, cy, cz);

            // naive normals (not smoothed)
            const v1x = bx - ax;
            const v1y = by - ay;
            const v1z = bz - az;
            const v2x = cx - ax;
            const v2y = cy - ay;
            const v2z = cz - az;
            const nx = v1y * v2z - v1z * v2y;
            const ny = v1z * v2x - v1x * v2z;
            const nz = v1x * v2y - v1y * v2x;
            const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
            normals.push(nx / len, ny / len, nz / len, nx / len, ny / len, nz / len, nx / len, ny / len, nz / len);

            const baseIndex = (base);
            indices.push(baseIndex, baseIndex + 1, baseIndex + 2);
          }
        }
      } else {
        // No explorer - attempt triangulation of top-level shape
        try {
          const loc = getOcctCtor("TopLoc_Location") ? new getOcctCtor("TopLoc_Location")() : null;
          const tri = BRep_Tool.Triangulation(shape, loc);
          if (tri) {
            const nnodes = tri.NbNodes();
            const ntris = tri.NbTriangles();
            const nodeBuffer = [];
            for (let i = 1; i <= nnodes; i++) {
              const p = tri.Node(i);
              nodeBuffer.push(p.x(), p.y(), p.z());
            }
            for (let t = 1; t <= ntris; t++) {
              const triIdx = tri.Triangle(t);
              const a = triIdx.Value(1);
              const b = triIdx.Value(2);
              const c = triIdx.Value(3);
              const ax = nodeBuffer[(a - 1) * 3];
              const ay = nodeBuffer[(a - 1) * 3 + 1];
              const az = nodeBuffer[(a - 1) * 3 + 2];
              const bx = nodeBuffer[(b - 1) * 3];
              const by = nodeBuffer[(b - 1) * 3 + 1];
              const bz = nodeBuffer[(b - 1) * 3 + 2];
              const cx = nodeBuffer[(c - 1) * 3];
              const cy = nodeBuffer[(c - 1) * 3 + 1];
              const cz = nodeBuffer[(c - 1) * 3 + 2];
              vertices.push(ax, ay, az, bx, by, bz, cx, cy, cz);
              const v1x = bx - ax;
              const v1y = by - ay;
              const v1z = bz - az;
              const v2x = cx - ax;
              const v2y = cy - ay;
              const v2z = cz - az;
              const nx = v1y * v2z - v1z * v2y;
              const ny = v1z * v2x - v1x * v2z;
              const nz = v1x * v2y - v1y * v2x;
              const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
              normals.push(nx / len, ny / len, nz / len, nx / len, ny / len, nz / len, nx / len, ny / len, nz / len);
              const baseIndex = (vertices.length / 3) - 3;
              indices.push(baseIndex, baseIndex + 1, baseIndex + 2);
            }
          }
        } catch (e) {
          console.warn("Triangulation fallback failed:", e);
        }
      }

      if (vertices.length === 0) {
        setError("No triangulation available for this STEP/IGES file (missing triangulation in opencascade build).");
        return;
      }

      // Build BufferGeometry
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
      geometry.setIndex(indices);

      addThreeMesh(geometry);
    } catch (e) {
      console.error("Error during tessellation:", e);
      setError("Error during tessellation: " + (e && e.message ? e.message : String(e)));
    }
  }

  // Load STEP file using opencascade
  async function loadSTEP(arrayBuffer) {
    setError(null);
    setLoading(true);
    try {
      if (!window.opencascade) {
        setError("opencascade is not loaded yet. Please wait and try again.");
        setLoading(false);
        return;
      }

      // Get STEPControl_Reader constructor robustly
      const STEPControl_Reader = getOcctCtor("STEPControl_Reader");
      if (!STEPControl_Reader) {
        setError("Missing occt constructor: STEPControl_Reader (tried common suffixes). Can't read STEP.");
        setLoading(false);
        return;
      }

      const oc = window.opencascade;
      const reader = new STEPControl_Reader();
      // Create a stream from arrayBuffer
      const uint8 = new Uint8Array(arrayBuffer);
      if (oc.MakeStream) {
        const str = oc.MakeStream(uint8);
        const status = reader.ReadStream(str);
        if (status !== 0 && status !== oc.IFSelect_RetDone) {
          setError("STEP reading failed with status: " + status);
          setLoading(false);
          return;
        }
      } else if (reader.ReadFile) {
        // Some builds expose ReadFile and we need to provide a filename, so fallback is limited
        setError("opencascade build does not support stream-based STEP reading in this environment.");
        setLoading(false);
        return;
      } else {
        setError("No supported STEP reading API found on opencascade build.");
        setLoading(false);
        return;
      }

      // Transfer root
      const nbr = reader.TransferRoots();
      if (nbr <= 0) {
        setError("No roots transferred from STEP file.");
        setLoading(false);
        return;
      }
      const shape = reader.OneShape();
      tessellateShape(shape);

    } catch (e) {
      console.error(e);
      setError("Failed to load STEP: " + (e && e.message ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  }

  // Load IGES
  async function loadIGES(arrayBuffer) {
    setError(null);
    setLoading(true);
    try {
      if (!window.opencascade) {
        setError("opencascade is not loaded yet. Please wait and try again.");
        setLoading(false);
        return;
      }

      const IGESControl_Reader = getOcctCtor("IGESControl_Reader");
      if (!IGESControl_Reader) {
        setError("Missing occt constructor: IGESControl_Reader (tried common suffixes). Can't read IGES.");
        setLoading(false);
        return;
      }

      const oc = window.opencascade;
      const reader = new IGESControl_Reader();
      const uint8 = new Uint8Array(arrayBuffer);
      if (oc.MakeStream) {
        const str = oc.MakeStream(uint8);
        const status = reader.ReadStream(str);
        if (status !== 0 && status !== oc.IFSelect_RetDone) {
          setError("IGES reading failed with status: " + status);
          setLoading(false);
          return;
        }
      } else {
        setError("opencascade build does not support stream-based IGES reading in this environment.");
        setLoading(false);
        return;
      }

      const nbr = reader.TransferRoots();
      if (nbr <= 0) {
        setError("No roots transferred from IGES file.");
        setLoading(false);
        return;
      }
      const shape = reader.OneShape();
      tessellateShape(shape);
    } catch (e) {
      console.error(e);
      setError("Failed to load IGES: " + (e && e.message ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  }

  // Handler when file prop changes
  useEffect(() => {
    if (!file || !file.name) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ab = ev.target.result;
      if (file.name.toLowerCase().endsWith(".step") || file.name.toLowerCase().endsWith(".stp")) {
        loadSTEP(ab);
      } else if (file.name.toLowerCase().endsWith(".iges") || file.name.toLowerCase().endsWith(".igs")) {
        loadIGES(ab);
      } else {
        setError("Unsupported file type: " + file.name);
      }
    };
    reader.onerror = (e) => {
      setError("Failed to read input file: " + e);
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  return (
    <div style={{ display: isOpen ? "block" : "none", position: "relative", width: "100%", height: "100%" }}>
      <div style={{ position: "absolute", right: 12, top: 12, zIndex: 1000 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setTransparentMode((s) => !s)} title="Toggle transparent outline view">
            {transparentMode ? "Solid view" : "Transparent outline"}
          </button>
          <button onClick={() => { clearScene(); setError(null); }} title="Clear view">Clear</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>

      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      {loading && <div style={{ position: "absolute", left: 12, top: 12 }}>Loading...</div>}
      {error && (
        <div style={{ position: "absolute", left: 12, bottom: 12, background: "rgba(255,0,0,0.8)", color: "white", padding: 8 }}>
          {error}
        </div>
      )}
    </div>
  );
}
