'use client'

import { useState, useEffect } from 'react'

export default function SkillsNormalized() {
  const [scale, setScale] = useState(1)

  // Base reference dimensions - matched to design viewport
  const BASE_WIDTH = 1920
  const BASE_HEIGHT = 1080

  useEffect(() => {
    const calculateScale = () => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      const widthScale = viewportWidth / BASE_WIDTH
      const heightScale = viewportHeight / BASE_HEIGHT
      
      // Use smaller scale to prevent overflow
      const newScale = Math.min(widthScale, heightScale)
      setScale(newScale)
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

  const skills = {
    'CFD & Simulation': [
      'OpenFOAM', 'Ansys Fluent', 'STAR-CCM+', 'DualSPHysics', 
      'ParaView', 'Mesh Generation', 'Turbulence Modeling'
    ],
    'Design & CAD': [
      'SolidWorks', 'FreeCAD', 'Geomagic DesignX', 
      'Parametric Design', 'Assembly Modeling'
    ],
    'FEA & Structural': [
      'Abaqus', 'LS-Dyna', 'Comsol', 'Ansys Mechanical',
      'Thermal Analysis', 'Fracture Mechanics'
    ],
    'Programming': [
      'Python', 'Java', 'NumPy', 'Pandas', 
      'Matplotlib', 'Data Processing'
    ],
    'Machine Learning': [
      'PyTorch', 'Deep Learning', 'Computer Vision',
      'Neural Networks', 'Model Training'
    ],
    // 'Web Development': [
    //   'Next.js', 'React', 'Tailwind CSS', 
    //   'Git', 'GitHub'
    // ]
  }

  return (
    <>
      {/* Main scaled container */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          position: 'relative',
          margin: '0 auto'
        }}
      >
        {/* Content positioned absolutely within scaled container */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '1400px',
            height: '900px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0'
          }}
        >
          {/* Header */}
          <div style={{ 
            flexShrink: 0, 
            marginBottom: '48px' 
          }}>
            {/* Kicker */}
            <div style={{ 
              fontSize: '14px',
              color: 'hsl(140, 70%, 60%)',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              Technical Expertise
            </div>

            {/* Title */}
            <h2 style={{ 
              fontSize: '56px',
              fontWeight: '700',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.1'
            }}>
              Skills & Technologies
            </h2>

            {/* About Section */}
            <p style={{ 
              fontSize: '18px',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.68)',
              maxWidth: '900px'
            }}>
              Core competencies in computational engineering and software development.
            </p>
          </div>

          {/* Content Area - Skills Grid (fills remaining space) */}
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '32px',
            alignContent: 'start',
            minHeight: 0,
            overflow: 'hidden'
          }}>
            {Object.entries(skills).map(([category, skillList]) => (
              <div 
                key={category}
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '32px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Category Title */}
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  marginBottom: '24px',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '4px',
                    height: '24px',
                    background: 'hsl(var(--accent))',
                    borderRadius: '2px'
                  }} />
                  {category}
                </h3>

                {/* Skills List */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  {skillList.map((skill, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 18px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'rgba(255, 255, 255, 0.9)'
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 968px) {
          div[style*="grid-template-columns: repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}