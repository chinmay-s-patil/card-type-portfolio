const visualizationsList = [
  {
    id: 1,
    title: 'BlockMeshAuto',
    category: 'Desktop Application',
    description: 'An intuitive executable tool for creating blockMeshDict files directly. Designed to streamline the meshing workflow for OpenFOAM users with a visual interface.',
    longDescription: 'BlockMeshAuto simplifies the complex process of creating blockMeshDict files for OpenFOAM. Originally developed for personal use, this desktop application provides an intuitive interface for defining mesh blocks, boundaries, and grading. Perfect for engineers who want to quickly prototype mesh configurations without manually editing text files.',
    type: 'exe',
    tech: ['C++', 'Qt', 'OpenFOAM'],
    year: '2025',
    isWIP: true,
    color: '#48cae4',
    icon: '🔷',
    screenshots: [
      '/Visualizations/blockmeshauto-1.jpg',
      '/Visualizations/blockmeshauto-2.jpg',
      '/Visualizations/blockmeshauto-3.jpg'
    ],
    accessType: 'Request Access',
    ctaText: 'Contact me for beta access',
    features: [
      'Visual block definition',
      'Automatic boundary detection',
      'Grading preview',
      'Export to blockMeshDict'
    ]
  },
  {
    id: 2,
    title: 'BlockMeshOnline',
    category: 'Web Application',
    description: 'A web-based tool to write or paste blockMeshDict files and generate meshes via API. Perfect for when you can\'t access your OpenFOAM workstation but have an idea to test.',
    longDescription: 'BlockMeshOnline brings OpenFOAM meshing to your browser. Write or paste your blockMeshDict configuration, and the web app sends it to an API that processes it with OpenFOAM and returns an interactive 3D mesh visualization. Ideal for remote work, quick testing, or collaborative mesh design without needing a local OpenFOAM installation.',
    type: 'website',
    tech: ['React', 'Next.js', 'OpenFOAM API', 'Three.js'],
    year: '2025',
    isWIP: true,
    color: '#06ffa5',
    icon: '🌐',
    screenshots: [
      '/Visualizations/blockmeshonline-1.jpg',
      '/Visualizations/blockmeshonline-2.jpg',
      '/Visualizations/blockmeshonline-3.jpg'
    ],
    accessType: 'Live Demo',
    ctaText: 'Check it out here',
    link: 'https://blockmesh.example.com',
    features: [
      'Web-based editor',
      'API mesh generation',
      '3D visualization',
      'Instant feedback'
    ]
  },
  {
    id: 3,
    title: 'PolymerPostmortem',
    category: 'Data Analysis Tool',
    description: 'A Python program for visualizing, cleaning, and processing stress-strain data. Handles displacement and force data, with automatic strain calculation when extensometer data is unavailable.',
    longDescription: 'PolymerPostmortem is a comprehensive Python toolkit for experimental mechanics data analysis. Process raw test data from universal testing machines, clean noisy signals, visualize stress-strain curves, and export publication-ready figures. The tool automatically calculates strain from displacement data when extensometers are removed or fail during testing.',
    type: 'python',
    tech: ['Python', 'NumPy', 'Matplotlib', 'Pandas'],
    year: '2025',
    isWIP: true,
    color: '#9d4edd',
    icon: '📊',
    screenshots: [
      '/Visualizations/polymerpostmortem-1.jpg',
      '/Visualizations/polymerpostmortem-2.jpg',
      '/Visualizations/polymerpostmortem-3.jpg'
    ],
    accessType: 'Request Access',
    ctaText: 'Contact me for access',
    features: [
      'Data cleaning & filtering',
      'Stress-strain visualization',
      'Strain calculation',
      'Export to CSV/Excel'
    ]
  },
  {
    id: 4,
    title: 'OpenFOAM Dashboard',
    category: 'Monitoring Tool',
    description: 'Real-time log parser and dashboard for OpenFOAM simulations. Extracts and displays key metrics, residuals, and simulation progress from log files in an intuitive interface.',
    longDescription: 'OpenFOAM Dashboard monitors your simulations in real-time by parsing log files and extracting critical information. Track residuals, convergence, time steps, and solver performance without digging through verbose logs. Get instant alerts when simulations diverge or complete, with clean visualizations of your solver\'s progress.',
    type: 'python',
    tech: ['Python', 'Flask', 'Plotly', 'Websockets'],
    year: '2025',
    isWIP: true,
    color: '#ff006e',
    icon: '📈',
    screenshots: [
      '/Visualizations/openfoam-dashboard-1.jpg',
      '/Visualizations/openfoam-dashboard-2.jpg',
      '/Visualizations/openfoam-dashboard-3.jpg'
    ],
    accessType: 'Request Access',
    ctaText: 'Contact me for beta access',
    features: [
      'Real-time log parsing',
      'Residual tracking',
      'Performance metrics',
      'Convergence alerts'
    ]
  }
]

export default visualizationsList