'use client'

import { useState, useEffect, useRef } from 'react'

export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [scale, setScale] = useState(1)
  const scrollContainerRef = useRef(null)

  // Reference: 2560x1440 @ 125% = effective 2048x1152
  const BASE_WIDTH = 2560
  const BASE_HEIGHT = 1440

  useEffect(() => {
    const calculateScale = () => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      // Calculate scale based on viewport dimensions relative to base
      const widthScale = viewportWidth / BASE_WIDTH
      const heightScale = viewportHeight / BASE_HEIGHT
      
      // Use the smaller scale to prevent overflow
      const newScale = Math.min(widthScale, heightScale)
      setScale(newScale)
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

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
      documents: { offerLetter: null, certificate: null, experienceLetter: null }
    },
    {
      year: 'Apr 2025',
      role: 'Research Intern',
      company: 'NMCAD Lab, IISc Bangalore',
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
      documents: { offerLetter: null, certificate: null, experienceLetter: null }
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
      documents: { offerLetter: '/docs/csir-offer.pdf', certificate: '/docs/csir-certificate.pdf', experienceLetter: '/docs/csir-experience.pdf' }
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
      documents: { offerLetter: null, certificate: null, experienceLetter: null }
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
      documents: { offerLetter: null, certificate: null, experienceLetter: null }
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

  return (
    <section className="experience-section" style={{ 
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: `0 ${80 * scale}px`,
      maxWidth: `${1800 * scale}px`,
      margin: '0 auto',
      transform: `scale(${scale})`,
      transformOrigin: 'top center'
    }}>
      <div className="intro" style={{ 
        flexShrink: 0, 
        marginBottom: `${35 * scale}px`
      }}>
        <div className="kicker" style={{ 
          fontSize: `${16 * scale}px`,
          marginBottom: `${12 * scale}px`
        }}>Career Journey</div>
        <h2 style={{ 
          fontSize: `${58 * scale}px`,
          fontWeight: '700',
          marginBottom: `${17 * scale}px`,
          background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: '1.1'
        }}>Professional Timeline</h2>
        <p className="muted" style={{ 
          maxWidth: '65ch',
          fontSize: `${21 * scale}px`,
          lineHeight: '1.6',
          marginBottom: `${23 * scale}px`
        }}>Navigate through my career journey — from cutting-edge research to industry applications and creative web development.</p>
      </div>

      <div className="tabs-wrapper" style={{ 
        position: 'relative',
        marginBottom: `${35 * scale}px`,
        flexShrink: 0
      }}>
        <div className="year-tabs" style={{ 
          display: 'flex',
          gap: `${30 * scale}px`,
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
              className="year-button" 
              style={{ 
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: `${6 * scale}px`,
                padding: `${17 * scale}px ${40 * scale}px`,
                borderRadius: `${17 * scale}px`,
                border: idx === activeIndex ? '2px solid hsl(var(--accent))' : '2px solid rgba(255,255,255,0.1)',
                background: idx === activeIndex ? 'linear-gradient(135deg, hsl(var(--accent) / 0.25), hsl(var(--accent) / 0.1))' : 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: idx === activeIndex ? `0 ${7 * scale}px ${28 * scale}px hsl(var(--accent) / 0.3)` : 'none'
              }} 
              aria-current={idx === activeIndex}
            >
              <div style={{ 
                fontSize: `${28 * scale}px`,
                fontWeight: '700',
                color: idx === activeIndex ? 'hsl(var(--accent))' : 'rgba(255,255,255,0.6)',
                transition: 'color 0.3s'
              }}>{exp.year}</div>
              <div style={{ 
                fontSize: `${14 * scale}px`,
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                textAlign: 'center'
              }}>{exp.type}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="main-grid" style={{ 
        display: 'grid',
        gridTemplateColumns: '45% 55%',
        gap: `${60 * scale}px`,
        flex: 1,
        overflow: 'hidden',
        minHeight: 0
      }}>
        <div ref={scrollContainerRef} className="exp-scroll" style={{ 
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          display: 'flex',
          gap: 0,
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}>
          {experiences.map((exp, idx) => (
            <article key={idx} className="exp-panel" style={{ 
              minWidth: '100%',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              display: 'flex',
              alignItems: 'flex-start',
              paddingRight: `${40 * scale}px`
            }} aria-hidden={idx !== activeIndex}>
              <div className="exp-panel-inner" style={{ 
                width: '100%',
                animation: idx === activeIndex ? 'fadeIn 0.5s ease-in' : 'none'
              }}>
                <div className="header" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: `${30 * scale}px`,
                  marginBottom: `${23 * scale}px`
                }}>
                  <div className="accent" style={{ 
                    width: `${8 * scale}px`,
                    height: `${92 * scale}px`,
                    borderRadius: '999px',
                    flexShrink: 0,
                    background: `linear-gradient(180deg, ${exp.color}, transparent)`
                  }} />
                  <div>
                    <h3 className="role" style={{ 
                      fontSize: `${30 * scale}px`,
                      fontWeight: '700',
                      marginBottom: `${6 * scale}px`,
                      color: exp.color,
                      lineHeight: '1.2'
                    }}>{exp.role}</h3>
                    <div className="company" style={{ 
                      fontSize: `${21 * scale}px`,
                      color: 'rgba(255,255,255,0.6)',
                      fontWeight: '500'
                    }}>{exp.company}</div>
                    <div className="period" style={{ 
                      fontSize: `${16 * scale}px`,
                      color: 'rgba(255,255,255,0.4)',
                      marginTop: `${6 * scale}px`,
                      fontStyle: 'italic'
                    }}>{exp.period}</div>
                  </div>
                </div>
                <div className="achievements" style={{ marginBottom: `${23 * scale}px` }}>
                  <h4 style={{ 
                    fontSize: `${17 * scale}px`,
                    fontWeight: '600',
                    color: 'rgba(255,255,255,0.9)',
                    marginBottom: `${12 * scale}px`
                  }}>Key Achievements</h4>
                  <ul style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: `${12 * scale}px`,
                    padding: 0,
                    margin: 0,
                    listStyle: 'none'
                  }}>
                    {exp.achievements.map((a, i) => (
                      <li key={i} style={{ 
                        display: 'flex',
                        gap: `${20 * scale}px`,
                        alignItems: 'flex-start'
                      }}>
                        <span className="bullet" style={{ 
                          color: exp.color,
                          fontSize: `${18 * scale}px`,
                          lineHeight: 1,
                          marginTop: `${3 * scale}px`,
                          flexShrink: 0
                        }}>▹</span>
                        <span className="ach-text" style={{ 
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: `${17 * scale}px`,
                          lineHeight: '1.6'
                        }}>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="skills" style={{ marginBottom: `${23 * scale}px` }}>
                  <h4 style={{ 
                    fontSize: `${17 * scale}px`,
                    fontWeight: '600',
                    color: 'rgba(255,255,255,0.9)',
                    marginBottom: `${12 * scale}px`
                  }}>Technologies & Skills</h4>
                  <div className="skill-list" style={{ 
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: `${16 * scale}px`
                  }}>
                    {exp.skills.map((s, i) => (
                      <span key={i} className="skill-pill" style={{ 
                        padding: `${9 * scale}px ${24 * scale}px`,
                        borderRadius: `${12 * scale}px`,
                        fontSize: `${15 * scale}px`,
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        background: `${exp.color}15`,
                        border: `1px solid ${exp.color}40`,
                        color: exp.color
                      }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className="documents" style={{ marginTop: `${23 * scale}px` }}>
                  <h4 style={{ 
                    fontSize: `${17 * scale}px`,
                    fontWeight: '600',
                    color: 'rgba(255,255,255,0.9)',
                    marginBottom: `${12 * scale}px`
                  }}>Documents</h4>
                  <div style={{ 
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: `${20 * scale}px`
                  }}>
                    {exp.documents.offerLetter && (<a href={exp.documents.offerLetter} target="_blank" rel="noopener noreferrer" style={{ 
                      padding: `${12 * scale}px ${30 * scale}px`,
                      borderRadius: `${12 * scale}px`,
                      fontSize: `${16 * scale}px`,
                      fontWeight: '500',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: `${12 * scale}px`,
                      transition: 'all 0.2s ease'
                    }} className="doc-button"><svg width={14 * scale} height={14 * scale} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Offer Letter</a>)}
                    {exp.documents.certificate && (<a href={exp.documents.certificate} target="_blank" rel="noopener noreferrer" style={{ 
                      padding: `${12 * scale}px ${30 * scale}px`,
                      borderRadius: `${12 * scale}px`,
                      fontSize: `${16 * scale}px`,
                      fontWeight: '500',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: `${12 * scale}px`,
                      transition: 'all 0.2s ease'
                    }} className="doc-button"><svg width={14 * scale} height={14 * scale} viewBox="0 0 24 24" fill="none"><path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2"/><path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Certificate</a>)}
                    {exp.documents.experienceLetter && (<a href={exp.documents.experienceLetter} target="_blank" rel="noopener noreferrer" style={{ 
                      padding: `${12 * scale}px ${30 * scale}px`,
                      borderRadius: `${12 * scale}px`,
                      fontSize: `${16 * scale}px`,
                      fontWeight: '500',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: `${12 * scale}px`,
                      transition: 'all 0.2s ease'
                    }} className="doc-button"><svg width={14 * scale} height={14 * scale} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Experience Letter</a>)}
                    {!exp.documents.offerLetter && !exp.documents.certificate && !exp.documents.experienceLetter && (<span style={{ 
                      padding: `${12 * scale}px ${30 * scale}px`,
                      borderRadius: `${12 * scale}px`,
                      fontSize: `${16 * scale}px`,
                      color: 'rgba(255, 255, 255, 0.4)',
                      fontStyle: 'italic'
                    }}>No documents available</span>)}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="slideshow-column" style={{ 
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div className="fade-left" style={{ 
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${240 * scale}px`,
            background: 'linear-gradient(to right, rgba(10, 14, 26, 1) 0%, rgba(10, 14, 26, 0.8) 40%, rgba(10, 14, 26, 0) 100%)',
            zIndex: 2,
            pointerEvents: 'none'
          }} />
          <div className="slideshow-container" style={{ 
            position: 'relative',
            width: '100%',
            height: `${690 * scale}px`,
            borderRadius: `${23 * scale}px`,
            overflow: 'hidden',
            boxShadow: `0 ${28 * scale}px ${83 * scale}px rgba(0,0,0,0.5)`,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {currentExperience?.images?.map((img, idx) => (
              <div key={`${activeIndex}-${idx}`} className="slide" style={{ 
                position: 'absolute',
                inset: 0,
                opacity: idx === currentImageIndex ? 1 : 0,
                transition: 'opacity 1.2s ease-in-out',
                zIndex: idx === currentImageIndex ? 1 : 0
              }}>
                <img 
                  src={img} 
                  alt={`${currentExperience.company} - Image ${idx + 1}`}
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    console.error(`Failed to load: ${img}`)
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            ))}
          </div>
          <div className="indicators" style={{ 
            position: 'absolute',
            bottom: `${23 * scale}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: `${16 * scale}px`,
            zIndex: 3
          }}>
            {currentExperience?.images?.map((_, idx) => (
              <div key={idx} className="indicator" style={{ 
                width: idx === currentImageIndex ? `${82 * scale}px` : `${20 * scale}px`,
                height: `${12 * scale}px`,
                borderRadius: `${6 * scale}px`,
                background: idx === currentImageIndex ? currentExperience.color : 'rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                boxShadow: idx === currentImageIndex ? `0 0 ${16 * scale}px ${currentExperience.color}80` : 'none'
              }} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
        .year-tabs::-webkit-scrollbar { display: none; }
        .year-button:hover { transform: translateY(-5px); }
        .doc-button:hover { background: rgba(255, 255, 255, 0.1) !important; border-color: rgba(255, 255, 255, 0.2) !important; transform: translateY(-3px); }
        
        @media (max-width: 968px) { 
          .main-grid { 
            grid-template-columns: 1fr !important; 
            gap: ${35 * scale}px !important; 
          } 
          .slideshow-container { 
            height: ${460 * scale}px !important; 
          } 
        }
        
        @media (max-width: 640px) { 
          .year-tabs { 
            justify-content: flex-start !important; 
            overflow-x: auto !important; 
          } 
          .year-button { 
            min-width: ${200 * scale}px !important; 
          } 
        }
      `}</style>
    </section>
  )
}