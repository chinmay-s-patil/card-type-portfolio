'use client'

export default function SectionWrapper({ id, index, children }) {
  return (
    <section 
      id={id} 
      className="section" 
      data-section-index={index}
      style={{
        minHeight: '100vh',
        position: 'relative',
        scrollSnapAlign: 'start',
        overflow: 'hidden'
      }}
    >
      <div className="section-inner" style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    </section>
  )
}