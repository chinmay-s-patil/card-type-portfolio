// app/consts/CADGLTFList.jsx

const CADGLTFList = [
  {
    id: 1,
    title: 'Guitar Design',
    category: 'Product Design',
    year: '2022',
    description: 'Detailed CAD model of an acoustic guitar featuring advanced surface modeling techniques, assembly design, and precise component integration.',
    coverPhoto: '/Projects/Guitar Design Project/Guitar Design Project (1).jpg',
    gltfFile: '/CAD/Guitar/Guitar.gltf',
    color: '#ff6b35',
    modelColor: '#8B4513', // Brown wood color for guitar
    transparency: 0
  },
  {
    id: 2,
    title: 'Aerofoil',
    category: 'Aerodynamics',
    year: '2022',
    description: 'Precision aerodynamic profile designed for optimal lift-to-drag ratio in subsonic flow conditions.',
    coverPhoto: '/CAD/Airofoil/Airofoil.JPG',
    gltfFile: '/CAD/Aerofoil/Aerofoil.gltf',
    color: '#4ecdc4',
    modelColor: '#4ecdc4', // Teal
    transparency: 50
  },
  {
    id: 3,
    title: 'Wind Tunnel Test Section',
    category: 'Experimental Equipment',
    year: '2024',
    description: 'Precision 3D model of wind tunnel test section from field measurements with 0.01mm tolerance.',
    coverPhoto: '/Projects/CAD Modeling of Wind Tunnel Test Section/CAD Modeling of Wind Tunnel Test Section.jpg',
    gltfFile: '/CAD/WindTunnel/tunnel.gltf',
    color: '#8338ec',
    modelColor: '#C0C0C0', // Metallic silver
    transparency: 30
  },
  {
    id: 4,
    title: 'Solar Vortex Engine',
    category: 'Energy Systems',
    year: '2024',
    description: 'Research-grade CAD model designed for CFD baseline and parametric optimization studies.',
    coverPhoto: '/Projects/SVE/SVE (1).png',
    gltfFile: '/CAD/SVE/sve.gltf',
    color: '#ffbe0b',
    modelColor: '#FFD700', // Gold
    transparency: 0
  },
  {
    id: 5,
    title: 'Drone Frame',
    category: 'Reverse Engineering',
    year: '2024',
    description: 'Complete reverse-engineered model from 3D scans with 0.01mm tolerance.',
    coverPhoto: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (1).jpg',
    gltfFile: '/CAD/Drone/drone.gltf',
    color: '#06ffa5',
    modelColor: '#2C2C2C', // Dark carbon fiber
    transparency: 0
  }
]

export default CADGLTFList