'use client'

import { useState, useEffect } from 'react'

export default function MobileWarning() {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    // Also check screen width as a backup
    const isSmallScreen = window.innerWidth < 768
    
    if (isMobile || isSmallScreen) {
      setShowWarning(true)
    }
  }, [])

  if (!showWarning) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      {/* Modal Content */}
      <div
        style={{
          maxWidth: '500px',
          width: '100%',
          background: 'linear-gradient(135deg, rgba(15, 20, 32, 0.98), rgba(10, 14, 26, 0.98))',
          borderRadius: '20px',
          border: '2px solid hsl(140, 70%, 60%)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(140, 255, 200, 0.3)',
          padding: '2rem',
          animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          textAlign: 'center'
        }}
      >
        {/* Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 1.5rem',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, hsl(140, 70%, 60%), rgba(140, 255, 200, 0.6))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(140, 255, 200, 0.4)'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0a0e1a" strokeWidth="2.5">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <path d="M12 18h.01"/>
          </svg>
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          marginBottom: '1rem',
          color: '#fff',
          lineHeight: '1.2'
        }}>
          Mobile Device Detected
        </h2>

        {/* Message */}
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '1.5rem'
        }}>
          This portfolio is optimized for desktop viewing. For the best experience, please enable{' '}
          <strong style={{ color: 'hsl(140, 70%, 60%)' }}>Desktop Site Mode</strong>{' '}
          in your browser settings.
        </p>

        {/* Instructions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'left'
        }}>
          <p style={{
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '0.75rem',
            fontWeight: '600'
          }}>
            How to enable:
          </p>
          <ul style={{
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.6)',
            lineHeight: '1.8',
            paddingLeft: '1.25rem',
            margin: 0
          }}>
            <li><strong>Chrome/Edge:</strong> Menu → Desktop site</li>
            <li><strong>Safari:</strong> AA button → Request Desktop Website</li>
            <li><strong>Firefox:</strong> Menu → Desktop site</li>
          </ul>
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <button
            onClick={() => setShowWarning(false)}
            style={{
              padding: '0.875rem 1.5rem',
              background: 'linear-gradient(135deg, hsl(140, 70%, 60%), rgba(140, 255, 200, 0.8))',
              color: '#0a0e1a',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(140, 255, 200, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 16px rgba(140, 255, 200, 0.4)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 12px rgba(140, 255, 200, 0.3)'
            }}
          >
            I'll Enable Desktop Mode
          </button>

          <button
            onClick={() => setShowWarning(false)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: 'rgba(255, 255, 255, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.color = 'rgba(255, 255, 255, 0.9)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)'
            }}
            onMouseOut={(e) => {
              e.target.style.color = 'rgba(255, 255, 255, 0.6)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
            }}
          >
            Continue Anyway
          </button>
        </div>

        {/* Warning text */}
        <p style={{
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.4)',
          marginTop: '1rem',
          fontStyle: 'italic'
        }}>
          Some features may not work properly on mobile devices
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}