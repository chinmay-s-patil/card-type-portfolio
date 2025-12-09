'use client'

import { useState, useEffect } from 'react';

export default function EducationSection() {
  // Set this value to control overall section height (60-70% of viewport)
  const SECTION_HEIGHT = '65vh'; // change to '60vh' or '70vh' as desired

  const [activeTab, setActiveTab] = useState('masters');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Slideshow data
  const mastersImages = [
    '/Education/TUM/TUM (1).jpeg',
    '/Education/TUM/TUM (1).jpg',
    '/Education/TUM/TUM (2).jpeg',
    '/Education/TUM/TUM (2).jpg',
    '/Education/TUM/TUM (3).jpeg',
    '/Education/TUM/TUM (4).jpeg',
    '/Education/TUM/TUM (5).jpeg',
  ];

  const bachelorsImages = [
    '/Education/VITC/VITC (1).jpeg',
    '/Education/VITC/VITC (10).jpg',
    '/Education/VITC/VITC (11).jpg',
    '/Education/VITC/VITC (2).JPG',
    '/Education/VITC/VITC (3).jpg',
    '/Education/VITC/VITC (4).jpg',
    '/Education/VITC/VITC (5).jpg',
    '/Education/VITC/VITC (6).jpg',
    '/Education/VITC/VITC (7).jpg',
    '/Education/VITC/VITC (8).jpg',
    '/Education/VITC/VITC (9).jpg',
    '/Education/VITC/VITC (1).jpg',
    '/Education/VITC/VITC (1).png',
  ];

  const currentImages = activeTab === 'masters' ? mastersImages : bachelorsImages;

  // Auto-advance slideshow every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % currentImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [currentImages.length])

  // Reset image index when switching tabs
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [activeTab])

  const mastersData = {
    kicker: 'Academic Background',
    title: 'Master of Science',
    institution: 'Technical University of Munich (TUM)',
    degree: 'Aerospace Engineering',
    period: 'October 2025 — Present',
    description: 'Pursuing advanced studies in aerospace engineering with specialization in computational fluid dynamics and aerodynamics. Engaging with cutting-edge research in turbulence modeling, high-performance computing, and numerical methods for complex flow simulations.',
    skills: [
      'Advanced CFD'
    ]
  };

  const bachelorsData = {
    kicker: 'Academic Background',
    title: 'Bachelor of Technology',
    institution: 'VIT Chennai',
    degree: 'Mechanical Engineering',
    period: 'June 2021 — May 2025',
    description: 'Completed comprehensive undergraduate program in mechanical engineering, developing strong fundamentals in thermodynamics, fluid mechanics, and computational methods. Gained hands-on experience through laboratory work, projects, and industry internships.',
    skills: [
      'Fluid Mechanics',
      'Computational Fluid Dynamics',
      'Heat Transfer',
      'Thermodynamics',
      'Engineering Analysis',
      'Mechanical Design'
    ]
  };

  const currentData = activeTab === 'masters' ? mastersData : bachelorsData;

  return (
    <div style={{ 
      maxWidth: '1400px', 
      margin: '0 auto',
      padding: '0 2rem'
    }}>
      {/* Tab Selector */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => setActiveTab('masters')}
          style={buttonStyle(activeTab === 'masters')}
        >
          Master's
        </button>
        <button
          onClick={() => setActiveTab('bachelors')}
          style={buttonStyle(activeTab === 'bachelors')}
        >
          Bachelor's
        </button>
      </div>

      {/* Content Area */}
      <div className="education-grid" style={{
        display: 'grid',
        gridTemplateColumns: '48% 52%',
        gap: '2rem',
        alignItems: 'stretch',
        height: SECTION_HEIGHT,
        transition: 'height 0.3s ease'
      }}>
        {/* Left Side - Text Content */}
        <div style={{ 
          animation: 'fadeIn 0.5s ease-in',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingRight: '1rem'
        }}>
          <div style={{
            fontSize: '0.85rem',
            color: 'hsl(var(--accent))',
            fontWeight: '600',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}>
            {currentData.kicker}
          </div>

          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {currentData.title}
          </h2>

          <div style={{
            fontSize: '1.25rem',
            color: 'hsl(var(--accent))',
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>
            {currentData.degree}
          </div>

          <div style={{
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            {currentData.institution}
          </div>

          <div style={{
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.5)',
            marginBottom: '1.5rem',
            fontStyle: 'italic'
          }}>
            {currentData.period}
          </div>

          <p style={{
            fontSize: '1rem',
            lineHeight: '1.8',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            {currentData.description}
          </p>

          {/* Skills Tags */}
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: 'rgba(255, 255, 255, 0.95)'
            }}>
              Key Skills & Focus Areas
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              {currentData.skills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    transition: 'all 0.2s ease'
                  }}
                  className="skill-tag"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Slideshow with Fade Effect */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 'clamp(400px, 60vh, 600px)'
        }}>
          {/* Gradient Fade Overlay - Left to Right */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '140px',
            background: 'linear-gradient(to right, rgba(10, 14, 26, 1) 0%, rgba(10, 14, 26, 0.8) 40%, rgba(10, 14, 26, 0) 100%)',
            zIndex: 2,
            pointerEvents: 'none'
          }} />

          {/* Slideshow Container */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'clamp(12px, 2vw, 16px)',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(20, 20, 30, 0.5)'
          }}>
            {currentImages.map((img, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: idx === currentImageIndex ? 1 : 0,
                  transition: 'opacity 1.2s ease-in-out',
                  zIndex: idx === currentImageIndex ? 1 : 0
                }}
              >
                <img
                  src={img}
                  alt={`${currentData.institution} - Image ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    console.error(`Failed to load image: ${img}`)
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .skill-tag:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
          transform: translateY(-2px);
        }

        @media (max-width: 968px) {
          .education-grid {
            grid-template-columns: 1fr !important;
            height: auto !important;
            gap: 1.5rem !important;
          }

          .education-grid > div {
            min-height: 50vh;
          }
        }
      `}</style>
    </div>
  );
}

function buttonStyle(active) {
  return {
    padding: '0.75rem 2rem',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    background: active
      ? 'linear-gradient(135deg, hsl(var(--accent) / 0.25), hsl(var(--accent) / 0.1))'
      : 'rgba(255, 255, 255, 0.03)',
    border: active ? '2px solid hsl(var(--accent))' : '2px solid rgba(255, 255, 255, 0.06)',
    color: active ? 'hsl(var(--accent))' : 'rgba(255, 255, 255, 0.65)',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    boxShadow: active ? '0 6px 22px hsl(var(--accent) / 0.28)' : 'none'
  };
}