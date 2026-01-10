const visualizationsList = [
    {
      id: 1,
      title: 'BlockMeshAuto',
      category: 'Desktop Application',
      description: 'An intuitive executable tool for creating blockMeshDict files directly. Designed to streamline the meshing workflow for OpenFOAM users with a visual interface.',
      type: 'exe',
      tech: ['C++', 'OpenFOAM', 'Mesh Generation'],
      year: '2025',
      isWIP: true,
      color: '#48cae4',
      icon: '🔷',
      screenshots: [
        '/Visualizations/blockmeshauto-1.jpg',
        '/Visualizations/blockmeshauto-2.jpg'
      ],
      accessType: 'Request Access',
      ctaText: 'Contact me for beta access'
    },
    {
      id: 2,
      title: 'BlockMeshOnline',
      category: 'Web Application',
      description: 'A web-based tool to write or paste blockMeshDict files and generate meshes via API. Perfect for when you can\'t access your OpenFOAM workstation but have an idea to test.',
      type: 'website',
      tech: ['React', 'API', 'OpenFOAM', 'Web3D'],
      year: '2025',
      isWIP: true,
      color: '#06ffa5',
      icon: '🌐',
      screenshots: [
        '/Visualizations/blockmeshonline-1.jpg',
        '/Visualizations/blockmeshonline-2.jpg'
      ],
      accessType: 'Live Demo',
      ctaText: 'Try it now',
      link: 'https://blockmesh.example.com'
    },
    {
      id: 3,
      title: 'PolymerPostmortem',
      category: 'Data Analysis Tool',
      description: 'A Python program for visualizing, cleaning, and processing stress-strain data. Handles displacement and force data, with automatic strain calculation when extensometer data is unavailable.',
      type: 'python',
      tech: ['Python', 'NumPy', 'Matplotlib', 'Data Processing'],
      year: '2025',
      isWIP: true,
      color: '#9d4edd',
      icon: '📊',
      screenshots: [
        '/Visualizations/polymerpostmortem-1.jpg',
        '/Visualizations/polymerpostmortem-2.jpg'
      ],
      accessType: 'Request Access',
      ctaText: 'Contact me for access'
    },
    {
      id: 4,
      title: 'OpenFOAM Dashboard',
      category: 'Monitoring Tool',
      description: 'Real-time log parser and dashboard for OpenFOAM simulations. Extracts and displays key metrics, residuals, and simulation progress from log files in an intuitive interface.',
      type: 'python',
      tech: ['Python', 'Log Parsing', 'Real-time Monitoring', 'Visualization'],
      year: '2025',
      isWIP: true,
      color: '#ff006e',
      icon: '📈',
      screenshots: [
        '/Visualizations/openfoam-dashboard-1.jpg',
        '/Visualizations/openfoam-dashboard-2.jpg'
      ],
      accessType: 'Request Access',
      ctaText: 'Contact me for beta access'
    }
  ]


export default visualizationsList