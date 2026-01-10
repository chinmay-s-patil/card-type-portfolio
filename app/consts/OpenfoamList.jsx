const simulationsList = [
    {
        id: 1,
        title: 'Water Droplet Impact',
        category: 'Multiphase Flow',
        solver: 'interIsoFoam',
        year: '2025',
        date: '05/2025',
        description: 'High-resolution simulation of a droplet impact event on a water surface capturing crown formation and secondary breakup dynamics.',
        specs: {
        turbulence: 'LES',
        },
        tags: ['Impact', 'VOF', 'Splash'],
        media: [
        { type: 'video', src: '/OpenFoam/WaterDrop/vel 0 water.mp4' },
        { type: 'video', src: '/OpenFoam/WaterDrop/vel 1 water.mp4' },
        { type: 'video', src: '/OpenFoam/WaterDrop/vel 5 water.mp4' },
        { type: 'video', src: '/OpenFoam/WaterDrop/vel 10 water.mp4' },
        ],
        color: '#00b4d8',
        learnings: [
        'Captured crown formation',
        'Analyzed secondary breakup',
        'High-resolution interface tracking'
        ]
    },
    {
        id: 2,
        title: 'Drone Propeller Inflow',
        category: 'Propulsion',
        solver: 'pimpleFoam',
        year: '2025',
        date: '12/2025',
        description: 'Unsteady simulation of drone propeller at 1200 RPM with downward ambient air velocity varying from 5 m/s to 30 m/s, simulating upward flight conditions and thrust response to inflow changes.',
        specs: {
            turbulence: 'LES (WALE)',
            rpm: '1200',
            inflow: '5-30 m/s'
        },
        media: [
        { type: 'link', src: 'https://youtu.be/e1-Xk9poLTc' },
        { type: 'link', src: 'https://youtu.be/ezZOBuvUGkg' },
        { type: 'link', src: 'https://youtu.be/KF-tlR1s5Hs' },
        { type: 'link', src: 'https://youtu.be/5oFPQE9LAmU' },
        { type: 'link', src: 'https://youtu.be/1PUsm8FgfFE' },
        ],
        tags: ['Propeller', 'Rotation', 'Drone', 'Inflow'],
        color: '#48cae4',
        learnings: [
            'Modeled propeller rotation with sliding mesh',
            'Analyzed thrust variation with ambient inflow',
            'Captured wake deformation under flight conditions'
        ]
    },
    {
        id: 3,
        title: 'Pillar Separate (WIP)',
        category: 'Multiphase Flow',
        solver: 'interFoam',
        year: '2025',
        date: '12/2025',
        description: 'Water flow under bridge with two obstructing support pillars to analyze surface ripple formation and flow separation around supports. Work in progress focusing on free-surface deflection.',
        specs: {
            turbulence: 'k-ω SST'
        },
        tags: ['Bridge', 'Pillars', 'Surface Waves', 'WIP'],
        media: [],
        color: '#0077b6',
        learnings: [
            'Captured flow around bridge supports',
            'Analyzed surface water separation',
            'Ongoing refinement of outlet conditions'
        ]
    },
    {
        id: 4,
        title: 'BubbleSim',
        category: 'Multiphase Flow',
        solver: 'interIsoFoam',
        year: '2024',
        date: '01/2024',
        description: 'Two-phase bubble dynamics simulation capturing interface evolution and surface tension effects using the Volume of Fluid (VOF) method.',
        specs: {
        turbulence: 'LAMINAR',
        },
        tags: ['VOF', 'Multiphase', 'Interface Tracking'],
        media: [
        { type: 'link', src: 'https://youtu.be/b21aS5imCRQ' },
        ],
        color: '#00c4b3',
        learnings: [
        'Implemented VOF method for interface tracking',
        'Optimized surface tension modeling',
        'Achieved stable bubble dynamics simulation'
        ]
    },
    {
        id: 5,
        title: 'F1 Aerodynamics',
        category: 'Vehicle Aerodynamics',
        solver: 'pimpleFoam',
        year: '2025',
        date: '04/2024',
        description: 'Aerodynamic analysis of a Formula 1 car under ground effect conditions. Simulated flow separation, diffuser efficiency, and pressure distribution.',
        specs: {
        turbulence: 'k-ω SST',
        },
        tags: ['CFD', 'Aerodynamics', 'Motorsport'],
        media: [
        { type: 'link', src: 'https://youtu.be/vVOOHMz5rOc' },
        ],
        color: '#ff006e',
        learnings: [
        'Modeled ground effect aerodynamics',
        'Analyzed flow separation patterns',
        'Optimized diffuser efficiency'
        ]
    },
    {
        id: 6,
        title: 'Container Filling AMR',
        category: 'Multiphase Flow',
        solver: 'interFoam',
        year: '2025',
        date: '11/2025',
        description: 'Simulation of container filling dynamics with upper left/right halves as inlet/outlet, walls elsewhere, using Adaptive Mesh Refinement (AMR) at the water-air interface for sharp capture.',
        specs: {
            turbulence: 'LAMINAR'
        },
        tags: ['Filling', 'AMR', 'VOF', 'interFoam'],
        media: [
            { type: 'link', src: 'https://youtu.be/Okgu05sbi6w' },
            { type: 'link', src: 'https://youtu.be/-3tyRwD62bA' },
            { type: 'link', src: 'https://youtu.be/aqfHIQPvozU' },
            { type: 'link', src: 'https://youtu.be/JgCLHwVjAKc' },
            { type: 'link', src: 'https://youtu.be/RsR7A1tjaMI' },
        ],
        color: '#00a896',
        learnings: [
            'Implemented dynamic AMR at free surface',
            'Stable inlet/outlet for continuous filling',
            'Improved interface resolution efficiency'
        ]
    },
    {
        id: 7,
        title: 'Propeller Simulation',
        category: 'Drone Simulation',
        solver: 'pimpleFoam',
        year: '2024',
        date: '06/2024',
        description: 'Unsteady simulation of rotating propeller blades capturing wake interaction and thrust generation under realistic RPM conditions.',
        specs: {
        turbulence: 'LES (WALE)',
        },
        tags: ['LES', 'Rotation', 'Propulsion'],
        media: [
        { type: 'link', src: 'https://youtu.be/kKAqOmWSgqs' },
        ],
        color: '#48cae4',
        learnings: [
        'Implemented sliding mesh for rotation',
        'Captured wake interaction dynamics',
        'Analyzed thrust generation'
        ]
    },
    {
        id: 8,
        title: 'Engine Combustion',
        category: 'Combustion',
        solver: 'reactingFoam',
        year: '2024',
        date: '01/2024',
        description: 'Simplified combustion chamber simulation using detailed reaction mechanisms to predict flame propagation and heat release.',
        specs: {
        turbulence: 'LES (WALE)',
        },
        tags: ['Combustion', 'CHT', 'Energy'],
        media: [
        { type: 'link', src: 'https://youtu.be/Qj1gQxWN9jg' },
        { type: 'link', src: 'https://youtu.be/BPjKMzl3rFM' },
        ],
        color: '#ff7b00',
        learnings: [
        'Modeled detailed reaction mechanisms',
        'Predicted flame propagation',
        'Analyzed heat release patterns'
        ]
    },
    {
        id: 9,
        title: 'Solar Panel Wind Load',
        category: 'Wind Engineering',
        solver: 'simpleFoam',
        year: '2024',
        date: '04/2025',
        description: 'Aerodynamic loading study on solar panels. RANS and transient PIMPLE simulations performed to determine optimal tilt-angle load characteristics.',
        specs: {
        turbulence: 'k-ε',
        },
        tags: ['Wind Load', 'ABL', 'Transient'],
        media: [
        { type: 'link', src: 'https://youtu.be/4Jfo9_4OumM' },
        { type: 'link', src: 'https://youtu.be/vk0DZnuVfNo' },
        ],
        color: '#90e0ef',
        learnings: [
        'Analyzed wind loading effects',
        'Optimized tilt angle',
        'Developed ABL profiles'
        ]
    },
    {
        id: 10,
        title: 'Stirred Tank Mixing',
        category: 'Multiphase Flow',
        solver: 'twoPhaseEulerFoam',
        year: '2024',
        date: '02/2024',
        description: 'Multiphase mixing simulation in a stirred tank using the MRF approach to model impeller rotation. Captured gas–liquid interaction and evaluated mixing efficiency and flow patterns.',
        specs: {
        turbulence: 'mixture k-ε',
        },
        tags: ['Mixing', 'MRF', 'Gas-Liquid'],
        media: [
        { type: 'link', src: 'https://youtu.be/KbNo_iCuDbo?si=EdVwEDOwPyTG4qcp' },
        ],
        color: '#00a896',
        learnings: [
        'Implemented MRF for impeller rotation',
        'Simulated gas–liquid flow behavior',
        'Analyzed mixing uniformity and turbulence characteristics'
        ]
    },
    {
        id: 11,
        title: 'FSAE Car Simulation',
        category: 'Vehicle Aerodynamics',
        solver: 'pimpleFoam',
        year: '2024',
        date: '12/2024',
        description: 'Flow simulation of a Formula SAE racecar to optimize aerodynamic balance and drag-to-lift ratio using transient PIMPLE coupling.',
        specs: {
        turbulence: 'k-ω SST',
        },
        tags: ['FSAE', 'Transient', 'Vehicle'],
        media: [
        { type: 'link', src: 'https://youtu.be/iIikI_LeR7M' },
        { type: 'link', src: 'https://youtu.be/rgmIqWjOfpo' },
        ],
        color: '#00b4d8',
        learnings: [
        'Optimized aerodynamic balance',
        'Analyzed transient flow effects',
        'Improved drag-to-lift ratio'
        ]
    },
    {
        id: 12,
        title: 'Supersonic Airfoil',
        category: 'High-Speed Flow',
        solver: 'sonicFoam',
        year: '2025',
        date: '06/2025',
        description: 'Supersonic flow simulation over a wedge-type airfoil capturing shock formation, expansion fans, and pressure distribution at Mach 2.0.',
        specs: {
        turbulence: 'Spalart–Allmaras',
        },
        tags: ['Compressible', 'Shock', 'Supersonic'],
        media: [
        { type: 'video', src: '/OpenFoam/SupersonicAirfoil/SupersonicAirfoil U.mp4' },
        { type: 'video', src: '/OpenFoam/SupersonicAirfoil/SupersonicAirfoil p.mp4' },
        ],
        color: '#0077b6',
        learnings: [
        'Captured shock wave formation',
        'Analyzed expansion fans',
        'Validated supersonic flow physics'
        ]
    },
    {
        id: 13,
        title: 'Supersonic Prism',
        category: 'High-Speed Flow',
        solver: 'sonicFoam',
        year: '2025',
        date: '06/2025',
        description: 'Compressible flow past a sharp-edged prism generating oblique shock structures and expansion fans, analyzed for Mach 3 freestream.',
        specs: {
        turbulence: 'Spalart–Allmaras',
        },
        tags: ['Mach Flow', 'Shock Wave', 'Compressible'],
        media: [
        { type: 'video', src: '/OpenFoam/SupersonicPrism/U.mp4' },
        ],
        color: '#023e8a',
        learnings: [
        'Modeled oblique shock structures',
        'Analyzed Mach 3 flow features',
        'Captured expansion fan dynamics'
        ]
    },
]

export default simulationsList;