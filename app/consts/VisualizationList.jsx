const visualizationsList = [
  {
    id: 1,
    title: 'Interactive Flow Visualization',
    category: 'CFD Visualization',
    description: 'Real-time particle tracing and streamline visualization for complex flow fields. Features interactive camera controls and dynamic data filtering.',
    screenshot: '/Visualizations/flow-viz-1.jpg',
    tech: ['Three.js', 'WebGL', 'ParaView'],
    year: '2025',
    isWIP: false,
    color: '#48cae4'
  },
  {
    id: 2,
    title: 'Turbulence Data Explorer',
    category: 'Data Visualization',
    description: 'Advanced visualization tool for analyzing turbulent flow statistics. Includes multi-dimensional data plots and statistical analysis.',
    screenshot: '/Visualizations/turbulence-explorer.jpg',
    tech: ['D3.js', 'React', 'Python'],
    year: '2025',
    isWIP: true,
    color: '#06ffa5'
  },
  {
    id: 3,
    title: 'Mesh Quality Inspector',
    category: 'CFD Tools',
    description: 'Interactive mesh quality visualization with real-time metrics display. Highlights problematic cells and provides quality statistics.',
    screenshot: '/Visualizations/mesh-inspector.jpg',
    tech: ['Three.js', 'OpenFOAM', 'React'],
    year: '2024',
    isWIP: false,
    color: '#ff006e'
  },
  {
    id: 4,
    title: 'Aeroacoustics Viewer',
    category: 'Scientific Visualization',
    description: 'Spatial audio visualization for aeroacoustic simulations. Displays sound pressure levels and directivity patterns in 3D space.',
    screenshot: '/Visualizations/acoustics-viewer.jpg',
    tech: ['WebGL', 'Three.js', 'FW-H'],
    year: '2025',
    isWIP: true,
    color: '#9d4edd'
  },
  {
    id: 5,
    title: 'Simulation Dashboard',
    category: 'Monitoring',
    description: 'Real-time monitoring dashboard for CFD simulations. Tracks residuals, force coefficients, and computational performance.',
    screenshot: '/Visualizations/sim-dashboard.jpg',
    tech: ['React', 'Chart.js', 'WebSocket'],
    year: '2024',
    isWIP: false,
    color: '#14ffc8'
  },
  {
    id: 6,
    title: 'Pressure Distribution Mapper',
    category: 'Post-Processing',
    description: 'Interactive pressure distribution visualization on 3D surfaces. Features customizable color maps and contour lines.',
    screenshot: '/Visualizations/pressure-mapper.jpg',
    tech: ['Three.js', 'ParaView', 'Python'],
    year: '2024',
    isWIP: true,
    color: '#00b4d8'
  }
]

export default visualizationsList