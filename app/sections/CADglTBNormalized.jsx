"use client"
import { useState, useEffect, useRef } from 'react'

// CAD Projects List with glTF files
const CADList = [
  {
    id: 1,
    title: 'Guitar Design',
    category: 'Product Design',
    year: '2022',
    description: 'Detailed CAD model of an acoustic guitar featuring advanced surface modeling techniques, assembly design, and precise component integration.',
    coverPhoto: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=600&fit=crop',
    gltfFile: '/CAD/Guitar/Guitar.gltf', // Replace with your actual path
    tags: ['SolidWorks', 'Surface Modeling', 'Product Design', 'Assembly'],
    color: '#ff6b35',
    transparency: 0
  },
  {
    id: 2,
    title: 'Aerofoil',
    category: 'Aerodynamics',
    year: '2022',
    description: 'Precision aerodynamic profile designed for optimal lift-to-drag ratio in subsonic flow conditions.',
    coverPhoto: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop',
    gltfFile: '/CAD/Aerofoil/Aerofoil.gltf',
    tags: ['CFD', 'Aerodynamics', 'Analysis'],
    color: '#4ecdc4',
    transparency: 50
  },
  {
    id: 3,
    title: 'Wind Tunnel Test Section',
    category: 'Experimental Equipment',
    year: '2024',
    description: 'Precision 3D model of wind tunnel test section from field measurements with 0.01mm tolerance.',
    coverPhoto: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
    gltfFile: '/CAD/WindTunnel/tunnel.gltf',
    tags: ['Precision Modeling', 'Experimental', 'Aerodynamics'],
    color: '#8338ec',
    transparency: 30
  },
  {
    id: 4,
    title: 'Solar Vortex Engine',
    category: 'Energy Systems',
    year: '2024',
    description: 'Research-grade CAD model designed for CFD baseline and parametric optimization studies.',
    coverPhoto: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    gltfFile: '/CAD/SVE/sve.gltf',
    tags: ['Energy', 'Parametric', 'CFD-Ready'],
    color: '#ffbe0b',
    transparency: 0
  }
]


// Main CAD Gallery Component
export default function CADGallery() {
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1e2e 100%)',
        padding: '4rem 2rem',
        color: '#fff'
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div
            style={{
              fontSize: '14px',
              color: 'hsl(30, 100%, 60%)',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}
          >
            3D Design Portfolio
          </div>
          <h2
            style={{
              fontSize: '56px',
              fontWeight: '700',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            CAD Projects
          </h2>
          <p
            style={{
              fontSize: '18px',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.68)',
              maxWidth: '700px',
              margin: '0 auto'
            }}
          >
            Explore my mechanical design work — from precision engineering to creative product design.
          </p>
        </div>

        {/* Project Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem'
          }}
        >
          {CADList.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, border-color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
                <img
                  src={project.coverPhoto}
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '6px 12px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: project.color
                  }}
                >
                  {project.year}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '1.5rem' }}>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#fff',
                    marginBottom: '8px'
                  }}
                >
                  {project.title}
                </h3>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontWeight: '500'
                  }}
                >
                  {project.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProject && <GLTFViewerModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  )
}