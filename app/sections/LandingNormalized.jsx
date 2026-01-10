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
    {/* Google-font for the handwritten line */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playwrite+NO:wght@700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Bruno+Ace+SC&display=swap');

        // @font-face {
        //   font-family: 'Bitcount Grid Single';
        //   src: url('/fonts/bitcount.woff2') format('woff2');
        //   font-weight: 400;
        //   font-style: normal;
        //   font-display: swap;
        // }

        // @font-face {
        //   font-family: 'Bitcount Grid Single';
        //   src: url('/fonts/bitcount.woff2') format('woff2-variations');
        //   font-weight: 100 900;   /* full weight range */
        //   font-style: normal;
        //   font-display: swap;
        // }

        @font-face {
          font-family: 'Bitcount Grid Single';
          src: url('/fonts/BitcountGridSingle/BitcountGridSingle-VariableFont_CRSV,ELSH,ELXP,slnt,wght.ttf') format('woff2-variations');
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
        }

      `}</style>

      {/* Main scaled container */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${scale})`,
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
              Chinmay S Patil
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
            
            {/* subtitle */}
            <div
              style={{
                fontSize: '20px',
                lineHeight: 1.7,
                marginBottom: '40px',
                color: 'rgba(255,255,255,.68)',
                maxWidth: '100%',
              }}
            >
              <span
                style={{
                  fontFamily: '"Bruno Ace SC", sans-serif',
                  fontSize: '26px',
                  color: '#fff',
                  letterSpacing: '0.4px',
                }}
              >
                Aerospace-engineering student who turns aerodynamic questions
                into reliable numbers.
              </span>
              <br />
              <br />
              I focus on CFD and OpenFOAM, building reproducible simulation
              setups and efficient data-processing tools. I&rsquo;m strong in
              Python, AIML, and steadily growing my C++ skills—and I&rsquo;m an
              avid learner, expanding my simulation capabilities every day.

              
              {/* <span style={{ fontFamily: '"Audiowide", sans-serif' }}>
                I focus on CFD and OpenFOAM, building reproducible simulation
                setups and efficient data-processing tools. I&rsquo;m strong in
                Python, AIML, and steadily growing my C++ skills—and
                I&rsquo;m an avid learner, expanding my simulation capabilities every day.
              </span> */}
            </div>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              gap: '20px', // INCREASED spacing
              marginBottom: '24px' // REDUCED to make room for social buttons
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

            {/* Social Buttons */}
            <div style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              marginBottom: '40px'
            }}>
              <span style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.5)',
                fontWeight: '500'
              }}>
                Connect:
              </span>
              
              <a
                href="https://www.youtube.com/@chinmay-s-patil"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(255, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                className="social-button youtube"
                aria-label="YouTube"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000"/>
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/chinmay-s-patil"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(0, 119, 181, 0.1)',
                  border: '1px solid rgba(0, 119, 181, 0.2)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                className="social-button linkedin"
                aria-label="LinkedIn"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0077B5"/>
                </svg>
              </a>

              <a
                href="mailto:chinmaypatil2412@gmail.com"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(140, 255, 200, 0.1)',
                  border: '1px solid rgba(140, 255, 200, 0.2)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                className="social-button email"
                aria-label="Email"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="hsl(140, 70%, 60%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 6l-10 7L2 6" stroke="hsl(140, 70%, 60%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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
                  CFD · OpenFOAM · Thermal · SuperSonic ·  · Python
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