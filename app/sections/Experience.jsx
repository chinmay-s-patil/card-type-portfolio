'use client'

import { useState, useEffect, useRef } from 'react'

// Mock DocumentViewer for demo
const DocumentViewer = ({ document, onClose }) => (
  <div style={{
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    background: 'rgba(0,0,0,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }} onClick={onClose}>
    <div style={{ color: 'white', padding: '2rem' }}>
      <h2>{document.name}</h2>
      <p>Document viewer placeholder</p>
    </div>
  </div>
)

export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const scrollContainerRef = useRef(null)

    const experiences = [
    {
      year: 'Jun 2025',
      role: 'Mechanical Research Engineer',
      company: 'Raphe mPhibr',
      type: 'Full-time',
      period: 'Jun 2025 — Sep 2025',
      description: 'Designed and developed multiple drone platforms and critical components. Led DFAM design with focus on self-supporting structures and minimum layer height. Optimized data post-processing using Python.',
      achievements: ['Led end-to-end drone design and manufacturing', 'Implemented Python optimizations for lab automation', 'Coordinated with multidisciplinary teams on project goals'],
      skills: ['DFAM', 'Mechanical Design', 'Python', 'Team Coordination'],
      color: 'hsl(140, 70%, 60%)',
      images: [
        '/Experience/Raphe/slideshow/Raphe1.jpg',
        '/Experience/Raphe/slideshow/Raphe2.jpg',
        '/Experience/Raphe/slideshow/Raphe3.jpg',
      ],
      documents: { 
        offerLetter: "/Experience/Raphe/Offer Letter Without CTC.png", 
        certificate: null, 
        experienceLetter: "/Experience/Raphe/Experience Letter.pdf" 
      }
    },
    {
      year: 'Apr 2025',
      role: 'Research Intern',
      company: 'IISc Bangalore',
      type: 'Internship',
      period: 'Apr 2025 — Jun 2025',
      description: 'Simulated high-fidelity rotor-wake interactions in OpenFOAM. Conducted LES-based aeroacoustic analysis in ANSYS Fluent, integrating Ffowcs Williams–Hawkings analogy for propeller noise prediction.',
      achievements: ['Contributed to advanced rotor-wake CFD models', 'Applied hybrid CFD/CAA techniques for noise studies', 'Collaborated with leading faculty on aerospace projects'],
      skills: ['OpenFOAM', 'LES', 'Aeroacoustics', 'ANSYS Fluent'],
      color: 'hsl(160, 65%, 55%)',
      images: [
        '/Experience/IISc/Slideshow/IISc1.jpg',
        '/Experience/IISc/Slideshow/IISc2.jpg',
        '/Experience/IISc/Slideshow/IISc3.jpeg',
      ],
      documents: { 
        offerLetter: "/Experience/IISc/IISc Offer Letter.jpg", 
        certificate: null, 
        experienceLetter: null 
      }
    },
    {
      year: 'Jun 2024',
      role: 'Research Intern',
      company: 'CSIR SERC',
      type: 'Internship',
      period: 'Jun 2024 — Jul 2024',
      description: 'Worked in Wind Engineering Lab executing CFD with OpenFOAM to assess drone propeller efficiency. Gained exposure to advanced materials labs and experimental setups.',
      achievements: ['Independently learned and applied OpenFOAM', 'Ran drone propeller simulations for efficiency analysis', 'Assisted in validation of CFD with lab measurements'],
      skills: ['Wind Engineering', 'OpenFOAM', 'Lab Experiments', 'Python'],
      color: 'hsl(180, 60%, 50%)',
      images: [
        '/Experience/CSIR SERC/CSIR SERC (1).jpg',
        '/Experience/CSIR SERC/CSIR SERC (2).jpg',
        '/Experience/CSIR SERC/CSIR SERC (3).jpg',
        '/Experience/CSIR SERC/CSIR SERC (4).jpg',
        '/Experience/CSIR SERC/CSIR SERC (5).jpg',
        '/Experience/CSIR SERC/CSIR SERC (6).jpg',
        '/Experience/CSIR SERC/CSIR SERC (7).jpg',
        '/Experience/CSIR SERC/CSIR SERC (8).jpg',
        '/Experience/CSIR SERC/CSIR SERC (9).jpg',
        '/Experience/CSIR SERC/CSIR SERC (10).jpg',
        '/Experience/CSIR SERC/CSIR SERC (11).jpg',
        '/Experience/CSIR SERC/CSIR SERC (12).jpg',
        '/Experience/CSIR SERC/CSIR SERC (13).jpg',
        '/Experience/CSIR SERC/CSIR SERC (14).jpg',
        '/Experience/CSIR SERC/CSIR SERC (15).jpg',
        '/Experience/CSIR SERC/CSIR SERC (16).jpg',
        '/Experience/CSIR SERC/CSIR SERC (17).jpg',
        '/Experience/CSIR SERC/CSIR SERC (18).jpg',
        '/Experience/CSIR SERC/CSIR SERC (19).jpg',
        '/Experience/CSIR SERC/CSIR SERC (20).jpg',
        '/Experience/CSIR SERC/CSIR SERC (21).jpg',
      ],
      documents: { 
        offerLetter: null, 
        certificate: '/Experience/CSIR SERC/CSIR SERC Certificate.jpg', 
        experienceLetter: null
      }
    },
    {
      year: 'Nov 2023',
      role: 'Project Intern',
      company: 'VIT Chennai',
      type: 'Internship',
      period: 'Nov 2023 — Dec 2023',
      description: 'Simulated angled crack propagation for fracture mechanics using COMSOL. Compiled 172k+ data points for advanced machine learning and created neural networks for simulation outcome prediction.',
      achievements: ['Compiled and analyzed large simulation datasets', 'Developed high-accuracy ML models for fracture mechanics', 'Automated simulation data workflows in Python'],
      skills: ['COMSOL', 'Machine Learning', 'Python', 'Data Science'],
      color: 'hsl(220, 50%, 40%)',
      images: [
        '/Experience/VIT/VIT (1).jpg',
        '/Experience/VIT/VIT (2).jpg',
        '/Experience/VIT/VIT (3).jpg',
        '/Experience/VIT/VIT (4).jpg',
        '/Experience/VIT/VIT (5).jpg',
        '/Experience/VIT/VIT (6).jpg',
      ],
      documents: { 
        offerLetter: null, 
        certificate: '/Experience/VIT/VITC.jpg', 
        experienceLetter: null 
      }
    },
    {
      year: 'Sep 2023',
      role: 'Full Stack Development Intern',
      company: 'Appbell Technologies',
      type: 'Internship',
      period: 'Sep 2023 — Nov 2023',
      description: 'Enhanced facial recognition algorithms using Python for attendance and integrated facial recognition API into legacy systems. Explored Android app development and improved UI accessibility.',
      achievements: ['Improved real-world facial recognition accuracy', 'Developed robust API for facial recognition integration', 'Contributed to Android frontend enhancements'],
      skills: ['Python', 'API Development', 'Android', 'Facial Recognition'],
      color: 'hsl(200, 55%, 45%)',
      images: [
        '/Experience/AppBell/AppBell (1).png',
        '/Experience/AppBell/AppBell (2).png',
        '/Experience/AppBell/AppBell (3).png',
        '/Experience/AppBell/AppBell (1).jpg',
      ],
      documents: { 
        offerLetter: null, 
        certificate: "/Experience/AppBell/AppBell Internship Certificate.jpg", 
        experienceLetter: null 
      }
    },
  ]

  const currentExperience = experiences[activeIndex]

  useEffect(() => {
    if (!currentExperience?.images?.length) return
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % currentExperience.images.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [currentExperience?.images?.length])

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [activeIndex])

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
      <section style={{ 
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 clamp(1rem, 5vw, 5rem)',
        maxWidth: '1800px',
        margin: '0 auto'
      }}>
        <div style={{ 
          flexShrink: 0, 
          marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)'
        }}>
          <div style={{ 
            fontSize: 'clamp(0.75rem, 1vw, 1rem)',
            marginBottom: '0.75rem',
            color: 'hsl(140, 70%, 60%)',
            fontWeight: '600',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>Career Journey</div>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: '700',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.1'
          }}>Professional Timeline</h2>
          <p style={{ 
            maxWidth: '65ch',
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            lineHeight: '1.6',
            marginBottom: 'clamp(1rem, 2vh, 1.5rem)',
            color: 'rgba(255, 255, 255, 0.68)'
          }}>Navigate through my career journey — from cutting-edge research to industry applications and creative web development.</p>
        </div>

        <div style={{ 
          position: 'relative',
          marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)',
          flexShrink: 0
        }}>
          <div style={{ 
            display: 'flex',
            gap: 'clamp(1rem, 2vw, 2rem)',
            justifyContent: 'space-between',
            alignItems: 'center',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {experiences.map((exp, idx) => (
              <button 
                key={idx} 
                onClick={() => scrollToIndex(idx)} 
                style={{ 
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: 'clamp(0.75rem, 1.5vw, 1.25rem) clamp(1.5rem, 3vw, 2.5rem)',
                  borderRadius: 'clamp(0.75rem, 1.5vw, 1.25rem)',
                  border: idx === activeIndex ? '2px solid hsl(140, 70%, 60%)' : '2px solid rgba(255,255,255,0.1)',
                  background: idx === activeIndex ? 'linear-gradient(135deg, hsl(140, 70%, 60%, 0.25), hsl(140, 70%, 60%, 0.1))' : 'rgba(255,255,255,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: idx === activeIndex ? '0 0.5rem 2rem hsl(140, 70%, 60%, 0.3)' : 'none'
                }} 
              >
                <div style={{ 
                  fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
                  fontWeight: '700',
                  color: idx === activeIndex ? 'hsl(140, 70%, 60%)' : 'rgba(255,255,255,0.6)',
                  transition: 'color 0.3s'
                }}>{exp.year}</div>
                <div style={{ 
                  fontSize: 'clamp(0.7rem, 1vw, 0.875rem)',
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  textAlign: 'center'
                }}>{exp.type}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(1.5rem, 3vw, 2rem)',
          alignItems: 'stretch',
          flex: 1,
          minHeight: 0
        }}>
          <div ref={scrollContainerRef} style={{ 
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollSnapType: 'x mandatory',
            display: 'flex',
            gap: 0,
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}>
            {experiences.map((exp, idx) => (
              <article key={idx} style={{ 
                minWidth: '100%',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingRight: 'clamp(1rem, 2vw, 2rem)'
              }}>
                <div style={{ 
                  width: '100%',
                  animation: idx === activeIndex ? 'fadeIn 0.5s ease-in' : 'none'
                }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(1rem, 2vw, 2rem)',
                    marginBottom: 'clamp(1rem, 2vh, 1.5rem)'
                  }}>
                    <div style={{ 
                      width: 'clamp(4px, 0.5vw, 8px)',
                      height: 'clamp(4rem, 8vh, 6rem)',
                      borderRadius: '999px',
                      flexShrink: 0,
                      background: `linear-gradient(180deg, ${exp.color}, transparent)`
                    }} />
                    <div>
                      <h3 style={{ 
                        fontSize: 'clamp(1.25rem, 2vw, 1.875rem)',
                        fontWeight: '700',
                        marginBottom: '0.375rem',
                        color: exp.color,
                        lineHeight: '1.2'
                      }}>{exp.role}</h3>
                      <div style={{ 
                        fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                        color: 'rgba(255,255,255,0.6)',
                        fontWeight: '500'
                      }}>{exp.company}</div>
                      <div style={{ 
                        fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                        color: 'rgba(255,255,255,0.4)',
                        marginTop: '0.375rem',
                        fontStyle: 'italic'
                      }}>{exp.period}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 'clamp(1rem, 2vh, 1.5rem)' }}>
                    <h4 style={{ 
                      fontSize: 'clamp(0.875rem, 1.25vw, 1.125rem)',
                      fontWeight: '600',
                      color: 'rgba(255,255,255,0.9)',
                      marginBottom: '0.75rem'
                    }}>Key Achievements</h4>
                    <ul style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      padding: 0,
                      margin: 0,
                      listStyle: 'none'
                    }}>
                      {exp.achievements.map((a, i) => (
                        <li key={i} style={{ 
                          display: 'flex',
                          gap: 'clamp(0.75rem, 1.5vw, 1.25rem)',
                          alignItems: 'flex-start'
                        }}>
                          <span style={{ 
                            color: exp.color,
                            fontSize: 'clamp(1rem, 1.25vw, 1.125rem)',
                            lineHeight: 1,
                            marginTop: '0.2rem',
                            flexShrink: 0
                          }}>▹</span>
                          <span style={{ 
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: 'clamp(0.875rem, 1.125vw, 1.0625rem)',
                            lineHeight: '1.6'
                          }}>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ marginBottom: 'clamp(1rem, 2vh, 1.5rem)' }}>
                    <h4 style={{ 
                      fontSize: 'clamp(0.875rem, 1.25vw, 1.125rem)',
                      fontWeight: '600',
                      color: 'rgba(255,255,255,0.9)',
                      marginBottom: '0.75rem'
                    }}>Technologies & Skills</h4>
                    <div style={{ 
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 'clamp(0.5rem, 1vw, 1rem)'
                    }}>
                      {exp.skills.map((s, i) => (
                        <span key={i} style={{ 
                          padding: 'clamp(0.375rem, 0.75vw, 0.5625rem) clamp(0.75rem, 1.5vw, 1.5rem)',
                          borderRadius: 'clamp(0.5rem, 1vw, 0.75rem)',
                          fontSize: 'clamp(0.8125rem, 1vw, 0.9375rem)',
                          fontWeight: '500',
                          transition: 'all 0.2s ease',
                          background: `${exp.color}15`,
                          border: `1px solid ${exp.color}40`,
                          color: exp.color
                        }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: 'clamp(1rem, 2vh, 1.5rem)' }}>
                    <h4 style={{ 
                      fontSize: 'clamp(0.875rem, 1.25vw, 1.125rem)',
                      fontWeight: '600',
                      color: 'rgba(255,255,255,0.9)',
                      marginBottom: '0.75rem'
                    }}>Documents</h4>
                    <div style={{ 
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 'clamp(0.75rem, 1.5vw, 1.25rem)'
                    }}>
                      {exp.documents.offerLetter && (
                        <button 
                          onClick={() => openDocument(exp.documents.offerLetter, `${exp.company} - Offer Letter`)}
                          style={{ 
                            padding: 'clamp(0.5rem, 1vw, 0.75rem) clamp(1rem, 2vw, 1.875rem)',
                            borderRadius: 'clamp(0.5rem, 1vw, 0.75rem)',
                            fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                            fontWeight: '500',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.9)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                          }}
                        >
                          📄 Offer Letter
                        </button>
                      )}
                      {exp.documents.certificate && (
                        <button 
                          onClick={() => openDocument(exp.documents.certificate, `${exp.company} - Certificate`)}
                          style={{ 
                            padding: 'clamp(0.5rem, 1vw, 0.75rem) clamp(1rem, 2vw, 1.875rem)',
                            borderRadius: 'clamp(0.5rem, 1vw, 0.75rem)',
                            fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                            fontWeight: '500',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.9)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                          }}
                        >
                          🏆 Certificate
                        </button>
                      )}
                      {exp.documents.experienceLetter && (
                        <button 
                          onClick={() => openDocument(exp.documents.experienceLetter, `${exp.company} - Experience Letter`)}
                          style={{ 
                            padding: 'clamp(0.5rem, 1vw, 0.75rem) clamp(1rem, 2vw, 1.875rem)',
                            borderRadius: 'clamp(0.5rem, 1vw, 0.75rem)',
                            fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                            fontWeight: '500',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.9)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                          }}
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

          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '400px'
          }}>
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
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'clamp(12px, 2vw, 16px)',
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

        <style>{`
          @keyframes fadeIn { 
            from { opacity:0; transform:translateX(-20px); } 
            to { opacity:1; transform:translateX(0); } 
          }
          
          @media (max-width: 968px) { 
            .main-grid { 
              grid-template-columns: 1fr !important; 
            } 
          }
        `}</style>
      </section>

      {selectedDocument && (
        <DocumentViewer 
          document={selectedDocument} 
          onClose={() => setSelectedDocument(null)} 
        />
      )}
    </>
  )
}