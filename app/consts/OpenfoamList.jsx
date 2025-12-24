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
        cells: '~1.5M',
        turbulence: 'LES',
        runtime: '20 hours',
        cores: '8'
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
        id: 10,
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
        { type: 'video', src: '/OpenFoam/BubbleSim/BubbleSim.mp4' },
        ],
        color: '#00c4b3',
        learnings: [
        'Implemented VOF method for interface tracking',
        'Optimized surface tension modeling',
        'Achieved stable bubble dynamics simulation'
        ]
    },
    {
        id: 2,
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
        { type: 'video', src: '/OpenFoam/F1/F1.mp4' },
        ],
        color: '#ff006e',
        learnings: [
        'Modeled ground effect aerodynamics',
        'Analyzed flow separation patterns',
        'Optimized diffuser efficiency'
        ]
    },
    {
        id: 3,
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
        { type: 'video', src: '/OpenFoam/FSAE Car Sim/DES-video-with-car-slower-fixed-Perspective-Q-Criterion.mp4' },
        { type: 'video', src: '/OpenFoam/FSAE Car Sim/LES-video-with-car-slower-fixed-perspective-Q-Criterion.mp4' },
        { type: 'video', src: '/OpenFoam/FSAE Car Sim/LES-With_VOR-Q-crit-4 Slowed.mp4' }
        ],
        color: '#00b4d8',
        learnings: [
        'Optimized aerodynamic balance',
        'Analyzed transient flow effects',
        'Improved drag-to-lift ratio'
        ]
    },
    {
        id: 4,
        title: 'Propeller Simulation',
        category: 'Aeroacoustics',
        solver: 'pimpleFoam',
        year: '2024',
        date: '06/2024',
        description: 'Unsteady simulation of rotating propeller blades capturing wake interaction and thrust generation under realistic RPM conditions.',
        specs: {
        turbulence: 'LES (WALE)',
        },
        tags: ['LES', 'Rotation', 'Propulsion'],
        media: [
        { type: 'video', src: '/OpenFoam/Propeller Simulation/VideoSpedUp2.mp4' },
        ],
        color: '#48cae4',
        learnings: [
        'Implemented sliding mesh for rotation',
        'Captured wake interaction dynamics',
        'Analyzed thrust generation'
        ]
    },
    {
        id: 5,
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
        { type: 'video', src: '/OpenFoam/Engine Combustion/Engine Combustion CO2.mp4' },
        { type: 'video', src: '/OpenFoam/Engine Combustion/Engine Combustion CH4.mp4' },
        ],
        color: '#ff7b00',
        learnings: [
        'Modeled detailed reaction mechanisms',
        'Predicted flame propagation',
        'Analyzed heat release patterns'
        ]
    },
    {
        id: 6,
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
        { type: 'video', src: '/OpenFoam/SolarPanel/SolarPanelBig (2).mp4' },
        ],
        color: '#90e0ef',
        learnings: [
        'Analyzed wind loading effects',
        'Optimized tilt angle',
        'Developed ABL profiles'
        ]
    },
    {
        id: 7,
        title: 'Stirred Tank Mixing',
        category: 'Multiphase Flow',
        solver: 'twoPhaseEulerFoam',
        year: '2024',
        date: '02/2024',
        description: 'Multiphase mixing simulation in a stirred tank using the MRF approach to model impeller rotation. Captured gas–liquid interaction and evaluated mixing efficiency and flow patterns.',
        specs: {
        cells: '~2M',
        turbulence: 'mixture k-ε',
        },
        tags: ['Mixing', 'MRF', 'Gas-Liquid'],
        media: [
        { type: 'video', src: '/OpenFoam/stirringTank/stirringTank.mp4' },
        ],
        color: '#00a896',
        learnings: [
        'Implemented MRF for impeller rotation',
        'Simulated gas–liquid flow behavior',
        'Analyzed mixing uniformity and turbulence characteristics'
        ]
    },
    {
        id: 8,
        title: 'Supersonic Airfoil',
        category: 'High-Speed Flow',
        solver: 'sonicFoam',
        year: '2025',
        date: '06/2025',
        description: 'Supersonic flow simulation over a wedge-type airfoil capturing shock formation, expansion fans, and pressure distribution at Mach 2.0.',
        specs: {
        cells: '~2.8M',
        turbulence: 'Spalart–Allmaras',
        runtime: '30 hours',
        cores: '8'
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
        id: 9,
        title: 'Supersonic Prism',
        category: 'High-Speed Flow',
        solver: 'sonicFoam',
        year: '2025',
        date: '06/2025',
        description: 'Compressible flow past a sharp-edged prism generating oblique shock structures and expansion fans, analyzed for Mach 3 freestream.',
        specs: {
        cells: '~3.5M',
        turbulence: 'Spalart–Allmaras',
        runtime: '40 hours',
        cores: '8'
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