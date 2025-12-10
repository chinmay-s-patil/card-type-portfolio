'use client'

import { useState, useEffect } from 'react'

export default function LandingNormalized() {
  const [scale, setScale] = useState(1)

  const BASE_WIDTH = 1920
  const BASE_HEIGHT = 1080

  useEffect(() => {
    const calculateScale = () => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const widthScale = viewportWidth / BASE_WIDTH
      const heightScale = viewportHeight / BASE_HEIGHT
      setScale(Math.min(widthScale, heightScale))
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

  return (
    <>
      {/* Main scaled container */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          position: 'relative',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Content container - INCREASED VERTICAL HEIGHT */}
        <div
          style={{
            position: 'relative',
            width: '1700px',
            height: '1000px', // INCREASED from 900px
            display: 'flex',
            alignItems: 'center',
            gap: '80px'
          }}
        >
          {/* Left: Text content - 50% width */}
          <div style={{ 
            flex: '0 0 50%',
            paddingRight: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center' // Center content vertically
          }}>
            {/* Kicker */}
            <div style={{
              fontSize: '14px',
              color: 'hsl(140, 70%, 60%)',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '16px' // INCREASED spacing
            }}>
              Hello — I'm
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: '68px', // INCREASED from 64px
              fontWeight: '700',
              marginBottom: '20px', // INCREASED spacing
              lineHeight: '1.1',
              background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Chinmay Patil
              <br />
              <span style={{
                background: 'linear-gradient(135deg, hsl(var(--accent)) 0%, #14ffc8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Fluid Simulations
              </span>
              {' '}& Visual Interfaces
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '20px', // INCREASED from 18px
              lineHeight: '1.7', // INCREASED line height
              marginBottom: '40px', // INCREASED spacing
              color: 'rgba(255, 255, 255, 0.68)',
              maxWidth: '100%'
            }}>
              CFD engineer specializing in OpenFOAM and advanced visualization. I
              create reproducible simulation pipelines and build intuitive web
              interfaces that transform complex data into actionable insights for
              engineers and stakeholders.
            </p>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              gap: '20px', // INCREASED spacing
              marginBottom: '40px' // INCREASED spacing
            }}>
              <a 
                href="#projects"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 32px', // INCREASED padding
                  background: '#fff',
                  color: '#0a0e1a',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px', // INCREASED font size
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
                className="cta-button-primary"
              >
                <span>Explore Projects</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3L8 13M8 13L13 8M8 13L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>

              <a 
                href="#experience"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 32px', // INCREASED padding
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px', // INCREASED font size
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
                className="cta-button-secondary"
              >
                <span>View Experience</span>
              </a>
            </div>

            {/* Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px' // INCREASED spacing
            }}>
              <div style={{
                padding: '24px', // INCREASED padding
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{
                  fontSize: '20px', // INCREASED font size
                  fontWeight: '700',
                  marginBottom: '12px', // INCREASED spacing
                  color: '#fff'
                }}>
                  Core Focus
                </div>
                <p style={{
                  fontSize: '16px', // INCREASED font size
                  lineHeight: '1.6',
                  color: 'rgba(255, 255, 255, 0.68)'
                }}>
                  CFD · OpenFOAM · Python · Next.js · Data Visualization
                </p>
              </div>

              <div style={{
                padding: '24px', // INCREASED padding
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{
                  fontSize: '20px', // INCREASED font size
                  fontWeight: '700',
                  marginBottom: '12px', // INCREASED spacing
                  color: '#fff'
                }}>
                  Current Status
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '16px', // INCREASED font size
                  lineHeight: '1.6',
                  color: 'rgba(255, 255, 255, 0.68)'
                }}>
                  <div style={{
                    width: '12px', // INCREASED size
                    height: '12px', // INCREASED size
                    borderRadius: '50%',
                    background: 'hsl(var(--accent))',
                    boxShadow: '0 0 0 0 rgba(140, 255, 200, 0.7)',
                    animation: 'pulse 2s infinite'
                  }} />
                  <span>Available for freelance & collaboration</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Portrait - 50% width and INCREASED HEIGHT */}
          <div 
            className="portrait"
            style={{
              flex: '0 0 50%',
              position: 'relative',
              height: '700px', // INCREASED from 600px
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <img
              src="/portrait.jpg"
              alt="Chinmay Patil"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(140, 255, 200, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(140, 255, 200, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(140, 255, 200, 0);
          }
        }

        .cta-button-primary:hover,
        .cta-button-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .cta-button-primary:hover {
          background: #f0f0f0;
        }

        .cta-button-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .portrait:hover {
          transform: translateY(-8px) scale(1.01); // Added subtle scale
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.6);
        }

        @media (max-width: 1800px) {
          div[style*="width: 1700px"] {
            width: 1500px !important;
          }
        }

        @media (max-width: 1600px) {
          div[style*="width: 1700px"] {
            width: 1300px !important;
          }
        }
      `}</style>
    </>
  )
}