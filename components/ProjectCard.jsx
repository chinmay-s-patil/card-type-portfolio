export default function ProjectCard({ title, period, tags = [], onClick }) {
  return (
    <article className="project-card card group">
      <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: '0.75rem', flex: '0 0 auto' }}>
          <h4 className="font-semibold text-lg mb-2 group-hover:text-[hsl(var(--accent))] transition-colors" style={{ lineHeight: '1.3' }}>
            {title}
          </h4>
          <div 
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              color: 'var(--muted)',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '0.3rem 0.7rem',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {period}
          </div>
        </div>

        {/* Skill Tags */}
        <div style={{ flex: '1 1 auto', marginBottom: '0.75rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
            alignItems: 'flex-start'
          }}>
            {tags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                style={{
                  padding: '0.3rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.85)',
                  whiteSpace: 'nowrap'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Button */}
        <div style={{ flex: '0 0 auto' }}>
          <button 
            className="btn bg-white/6 border border-white/10" 
            onClick={onClick}
            style={{
              width: '100%',
              justifyContent: 'center',
              fontSize: '0.85rem',
              padding: '0.6rem 1rem'
            }}
          >
            <span>View Details</span>
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ transition: 'transform 0.2s ease' }}
              className="group-hover:translate-x-1"
            >
              <path 
                d="M6 3L11 8L6 13" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}