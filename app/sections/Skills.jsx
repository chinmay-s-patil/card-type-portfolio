'use client'

import { useState, useEffect } from 'react'

export default function Skills() {
  const [scale, setScale] = useState(1)

  // Reference: 1920x1080 @ 100% scale
  const BASE_WIDTH = 1920
  const BASE_HEIGHT = 1080

  useEffect(() => {
    const calculateScale = () => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      const widthScale = viewportWidth / BASE_WIDTH
      const heightScale = viewportHeight / BASE_HEIGHT
      
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
    'Web Development': [
      'Next.js', 'React', 'Tailwind CSS', 
      'Git', 'GitHub'
    ]
  }

  return (
    <div style={{ 
      maxWidth: `${1400 * scale}px`, 
      margin: '0 auto', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      padding: `0 ${32 * scale}px`
    }}>
      {/* Header */}
      <div style={{ 
        flexShrink: 0, 
        marginBottom: `${48 * scale}px` 
      }}>
        <div className="kicker" style={{ 
          fontSize: `${14 * scale}px`, 
          marginBottom: `${12 * scale}px` 
        }}>
          Technical Expertise
        </div>
        <h2 style={{ 
          fontSize: `${56 * scale}px`,
          fontWeight: '700',
          marginBottom: `${16 * scale}px`,
          background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: '1.1'
        }}>
          Skills & Technologies
        </h2>
        <p className="muted" style={{ 
          maxWidth: '65ch',
          fontSize: `${18 * scale}px`,
          lineHeight: '1.6'
        }}>
          Core competencies in computational engineering and software development.
        </p>
      </div>

      {/* Skills Grid - 2 columns */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: `${32 * scale}px`,
        alignContent: 'start'
      }}>
        {Object.entries(skills).map(([category, skillList]) => (
          <div 
            key={category}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: `${16 * scale}px`,
              padding: `${32 * scale}px`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Category Title */}
            <h3 style={{
              fontSize: `${22 * scale}px`,
              fontWeight: '700',
              marginBottom: `${24 * scale}px`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: `${12 * scale}px`
            }}>
              <div style={{
                width: `${4 * scale}px`,
                height: `${24 * scale}px`,
                background: 'hsl(var(--accent))',
                borderRadius: `${2 * scale}px`
              }} />
              {category}
            </h3>

            {/* Skills List */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: `${12 * scale}px`
            }}>
              {skillList.map((skill, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: `${10 * scale}px ${18 * scale}px`,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: `${8 * scale}px`,
                    fontSize: `${14 * scale}px`,
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

      <style jsx>{`
        @media (max-width: 968px) {
          div[style*="grid-template-columns: repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}