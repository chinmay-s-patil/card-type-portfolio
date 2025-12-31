'use client'

import { useState, useEffect, useRef } from 'react'
import DocumentViewer from '../components/DocumentViewer'
import experienceList from '../consts/ExperienceList'

export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const scrollContainerRef = useRef(null)
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

  const experiences = experienceList
  const currentExperience = experiences[activeIndex]

  // Auto-advance slideshow
  useEffect(() => {
    if (!currentExperience?.images?.length) return
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % currentExperience.images.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [currentExperience?.images?.length])

  // Reset image index when switching experiences
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [activeIndex])

  // Scroll detection
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const itemWidth = container.clientWidth || 1
      const newIndex = Math.min(Math.round(scrollLeft / itemWidth), experiences.length - 1)
      setActiveIndex(newIndex)
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => container.removeEventListener('scroll', handleScroll)
  }, [experiences.length])

  const scrollToIndex = (index) => {
    const container = scrollContainerRef.current
    if (!container) return
    const itemWidth = container.clientWidth || 1
    container.scrollTo({ left: itemWidth * index, behavior: 'smooth' })
  }

  const openDocument = (url, name) => {
    setSelectedDocument({ url, name })
  }

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
        {/* Content positioned relatively within scaled container */}
        <div
          style={{
            position: 'relative',
            width: '1400px',
            height: '900px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0'
          }}
        >
          {/* Kicker */}
          <div style={{ 
            fontSize: '14px',
            color: 'hsl(140, 70%, 60%)',
            fontWeight: '600',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            Career Journey
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
            Professional Timeline
          </h2>

          {/* About Section */}
          <p style={{ 
            fontSize: '18px',
            lineHeight: '1.6',
            marginBottom: '32px',
            color: 'rgba(255, 255, 255, 0.68)',
            maxWidth: '900px'
          }}>
            Navigate through my career journey — from cutting-edge research to industry applications.
          </p>

          {/* Year Tabs */}
          <div style={{ 
            display: 'flex',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {experiences.map((exp, idx) => (
              <button 
                key={idx} 
                onClick={() => scrollToIndex(idx)} 
                style={{ 
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: idx === activeIndex ? '2px solid hsl(140, 70%, 60%)' : '2px solid rgba(255,255,255,0.1)',
                  background: idx === activeIndex ? 'linear-gradient(135deg, hsl(140, 70%, 60%, 0.25), hsl(140, 70%, 60%, 0.1))' : 'rgba(255,255,255,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: idx === activeIndex ? '0 8px 32px hsl(140, 70%, 60%, 0.3)' : 'none'
                }} 
              >
                <div style={{ 
                  fontSize: '24px',
                  fontWeight: '700',
                  color: idx === activeIndex ? 'hsl(140, 70%, 60%)' : 'rgba(255,255,255,0.6)',
                  transition: 'color 0.3s'
                }}>
                  {exp.year}
                </div>
                <div style={{ 
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {exp.type}
                </div>
              </button>
            ))}
          </div>

          {/* Content Area - Split into two columns */}
          <div style={{ 
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            minHeight: 0
          }}>
            {/* Left: Scrollable Text Content */}
            <div ref={scrollContainerRef} style={{ 
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollSnapType: 'x mandatory',
              display: 'flex',
              gap: 0,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {experiences.map((exp, idx) => (
                <article key={idx} style={{ 
                  minWidth: '100%',
                  scrollSnapAlign: 'start',
                  scrollSnapStop: 'always',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingRight: '24px'
                }}>
                  <div style={{ 
                    width: '100%',
                    animation: idx === activeIndex ? 'fadeIn 0.5s ease-in' : 'none'
                  }}>
                    {/* Role Header */}
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
                      marginBottom: '24px'
                    }}>
                      <div style={{ 
                        width: '6px',
                        height: '80px',
                        borderRadius: '999px',
                        flexShrink: 0,
                        background: `linear-gradient(180deg, ${exp.color}, transparent)`
                      }} />
                      <div>
                        <h3 style={{ 
                          fontSize: '28px',
                          fontWeight: '700',
                          marginBottom: '8px',
                          color: exp.color,
                          lineHeight: '1.2'
                        }}>
                          {exp.role}
                        </h3>
                        <div style={{ 
                          fontSize: '18px',
                          color: 'rgba(255,255,255,0.6)',
                          fontWeight: '500'
                        }}>
                          {exp.company}
                        </div>
                        <div style={{ 
                          fontSize: '15px',
                          color: 'rgba(255,255,255,0.4)',
                          marginTop: '6px',
                          fontStyle: 'italic'
                        }}>
                          {exp.period}
                        </div>
                      </div>
                    </div>

                    {/* Key Achievements */}
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ 
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '12px'
                      }}>
                        Key Achievements
                      </h4>
                      <ul style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        padding: 0,
                        margin: 0,
                        listStyle: 'none'
                      }}>
                        {exp.achievements.map((a, i) => (
                          <li key={i} style={{ 
                            display: 'flex',
                            gap: '16px',
                            alignItems: 'flex-start'
                          }}>
                            <span style={{ 
                              color: exp.color,
                              fontSize: '16px',
                              lineHeight: 1,
                              marginTop: '3px',
                              flexShrink: 0
                            }}>
                              ▹
                            </span>
                            <span style={{ 
                              color: 'rgba(255,255,255,0.7)',
                              fontSize: '15px',
                              lineHeight: '1.6'
                            }}>
                              {a}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies & Skills */}
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ 
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '12px'
                      }}>
                        Technologies & Skills
                      </h4>
                      <div style={{ 
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}>
                        {exp.skills.map((s, i) => (
                          <span key={i} style={{ 
                            padding: '8px 20px',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease',
                            background: `${exp.color}15`,
                            border: `1px solid ${exp.color}40`,
                            color: exp.color
                          }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Documents */}
                    <div>
                      <h4 style={{ 
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '12px'
                      }}>
                        Documents
                      </h4>
                      <div style={{ 
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px'
                      }}>
                        {exp.documents.offerLetter && (
                          <button 
                            onClick={() => openDocument(exp.documents.offerLetter, `${exp.company} - Offer Letter`)}
                            style={{ 
                              padding: '10px 24px',
                              borderRadius: '10px',
                              fontSize: '14px',
                              fontWeight: '500',
                              background: 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: 'rgba(255, 255, 255, 0.9)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '12px',
                              transition: 'all 0.2s ease',
                              cursor: 'pointer'
                            }}
                            className="doc-button"
                          >
                            📄 Offer Letter
                          </button>
                        )}
                        {exp.documents.certificate && (
                          <button 
                            onClick={() => openDocument(exp.documents.certificate, `${exp.company} - Certificate`)}
                            style={{ 
                              padding: '10px 24px',
                              borderRadius: '10px',
                              fontSize: '14px',
                              fontWeight: '500',
                              background: 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: 'rgba(255, 255, 255, 0.9)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '12px',
                              transition: 'all 0.2s ease',
                              cursor: 'pointer'
                            }}
                            className="doc-button"
                          >
                            🏆 Certificate
                          </button>
                        )}
                        {exp.documents.experienceLetter && (
                          <button 
                            onClick={() => openDocument(exp.documents.experienceLetter, `${exp.company} - Experience Letter`)}
                            style={{ 
                              padding: '10px 24px',
                              borderRadius: '10px',
                              fontSize: '14px',
                              fontWeight: '500',
                              background: 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: 'rgba(255, 255, 255, 0.9)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '12px',
                              transition: 'all 0.2s ease',
                              cursor: 'pointer'
                            }}
                            className="doc-button"
                          >
                            📋 Experience Letter
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Right: Slideshow */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              minHeight: '400px'
            }}>
              {/* Gradient Fade */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '120px',
                background: 'linear-gradient(to right, rgba(10, 14, 26, 1) 0%, rgba(10, 14, 26, 0.8) 40%, rgba(10, 14, 26, 0) 100%)',
                zIndex: 2,
                pointerEvents: 'none'
              }} />
              
              {/* Slideshow Container */}
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                backgroundColor: 'rgba(20, 20, 30, 0.5)'
              }}>
                {currentExperience?.images?.map((img, idx) => (
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
                      alt={`${currentExperience.company} - Image ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedDocument && (
        <DocumentViewer 
          document={selectedDocument} 
          onClose={() => setSelectedDocument(null)} 
        />
      )}

      <style jsx>{`
        @keyframes fadeIn { 
          from { opacity:0; transform:translateX(-20px); } 
          to { opacity:1; transform:translateX(0); } 
        }
        
        .doc-button:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </>
  )
}