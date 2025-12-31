'use client'

export default function EventModal({ event, onClose, scale, imageIndices }) {
  if (!event) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${32 * scale}px`,
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)'
      }} />

      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: `${1400 * scale}px`,
          width: '95%',
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, rgba(15, 20, 32, 0.95), rgba(10, 14, 26, 0.95))',
          borderRadius: `${24 * scale}px`,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: `0 ${20 * scale}px ${80 * scale}px rgba(0, 0, 0, 0.6)`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: `${24 * scale}px`,
            right: `${24 * scale}px`,
            width: `${40 * scale}px`,
            height: `${40 * scale}px`,
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          aria-label="Close modal"
        >
          <svg width={20 * scale} height={20 * scale} viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Content */}
        <div style={{ 
          overflowY: 'auto', 
          overflowX: 'hidden',
          padding: `${40 * scale}px`,
          flex: 1
        }}>
          {/* Header */}
          <div style={{ marginBottom: `${32 * scale}px` }}>
            <div style={{
              fontSize: `${14 * scale}px`,
              color: event.color,
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: `${12}px`
            }}>
              {event.type}
            </div>
            
            <h2 style={{
              fontSize: `${40 * scale}px`,
              fontWeight: '700',
              marginBottom: `${12 * scale}px`,
              background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {event.title}
            </h2>

            <div style={{
              display: 'flex',
              gap: `${32 * scale}px`,
              flexWrap: 'wrap',
              alignItems: 'center',
              marginTop: `${16 * scale}px`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: `${8 * scale}px`,
                fontSize: `${15 * scale}px`,
                color: 'var(--muted)'
              }}>
                <svg width={16 * scale} height={16 * scale} viewBox="0 0 24 24" fill="none">
                  <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                {event.location}
              </div>

              <div style={{
                fontFamily: 'monospace',
                fontSize: `${14 * scale}px`,
                color: event.color,
                padding: `${6 * scale}px ${16 * scale}px`,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: `${8 * scale}px`,
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                {event.date}
              </div>
            </div>
          </div>

          {/* 3-Image Slideshow */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: `${16 * scale}px`,
            marginBottom: `${32 * scale}px`,
            height: `${400 * scale}px`
          }}>
            {(imageIndices || [0, 1, 2]).map((imgIndex, slotIndex) => (
              <div
                key={slotIndex}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: `${12 * scale}px`,
                  overflow: 'hidden',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <img
                  src={event.images[imgIndex]}
                  alt={`${event.title} - ${imgIndex + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ marginBottom: `${32 * scale}px` }}>
            <h3 style={{
              fontSize: `${20 * scale}px`,
              fontWeight: '600',
              marginBottom: `${16 * scale}px`,
              color: 'rgba(255, 255, 255, 0.95)'
            }}>
              Overview
            </h3>
            <p style={{
              fontSize: `${16 * scale}px`,
              lineHeight: '1.8',
              color: 'var(--muted)'
            }}>
              {event.description}
            </p>
          </div>

          {/* Tags */}
          <div>
            <h3 style={{
              fontSize: `${20 * scale}px`,
              fontWeight: '600',
              marginBottom: `${16 * scale}px`,
              color: 'rgba(255, 255, 255, 0.95)'
            }}>
              Topics
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: `${12 * scale}px`
            }}>
              {event.tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    padding: `${8 * scale}px ${20 * scale}px`,
                    borderRadius: `${12 * scale}px`,
                    fontSize: `${14 * scale}px`,
                    fontWeight: '600',
                    background: `${event.color}15`,
                    border: `1px solid ${event.color}40`,
                    color: event.color
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}