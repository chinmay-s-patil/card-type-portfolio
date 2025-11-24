'use client'
import { useEffect, useState, useRef } from 'react'

// Save as: app/components/DocumentViewer.jsx
export default function DocumentViewer({ document, onClose }) {
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const containerRef = useRef(null)

  const isPDF = document?.url?.toLowerCase().endsWith('.pdf')
  const isImage = !isPDF

  useEffect(() => {
    if (typeof window !== 'undefined' && document.body) {
      document.body.style.overflow = 'hidden'
      return () => {
        if (document.body) {
          document.body.style.overflow = 'unset'
        }
      }
    }
  }, [])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Reset zoom and position when document changes
  useEffect(() => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    setRotation(0)
  }, [document])

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 5))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.25))
  }

  const handleResetView = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    setRotation(0)
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      handleZoomIn()
    } else {
      handleZoomOut()
    }
  }

  const handleDownload = () => {
    const link = window.document.createElement('a')
    link.href = document.url
    link.download = document.name || 'document'
    link.click()
  }

  if (!document) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(8px)'
        }}
      />

      {/* Control Panel - Top */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(12px)',
          padding: '0.75rem 1rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 10,
          animation: 'slideDown 0.4s ease'
        }}
      >
        {/* Document Name */}
        <div style={{
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          fontSize: '0.9rem',
          fontWeight: '600',
          color: '#fff',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '300px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {document.name || 'Document'}
        </div>

        {/* Zoom Controls */}
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0.25}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: zoom <= 0.25 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            cursor: zoom <= 0.25 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            opacity: zoom <= 0.25 ? 0.3 : 1
          }}
          className="control-button"
          title="Zoom Out"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 11H14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 0.75rem',
          fontSize: '0.9rem',
          fontWeight: '600',
          color: '#fff',
          minWidth: '60px',
          justifyContent: 'center',
          fontFamily: 'monospace'
        }}>
          {Math.round(zoom * 100)}%
        </div>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= 5}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: zoom >= 5 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            cursor: zoom >= 5 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            opacity: zoom >= 5 ? 0.3 : 1
          }}
          className="control-button"
          title="Zoom In"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 11H14M11 8V14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Divider */}
        <div style={{
          width: '1px',
          height: '40px',
          background: 'rgba(255, 255, 255, 0.2)',
          margin: '0 0.25rem'
        }} />

        {/* Rotate Button (for images only) */}
        {isImage && (
          <button
            onClick={handleRotate}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            className="control-button"
            title="Rotate 90°"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21.5 2V6H17.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21.5 6C19.57 3.17 16.47 1.24 13 1.24C6.93 1.24 2 6.17 2 12.24C2 18.31 6.93 23.24 13 23.24C17.39 23.24 21.14 20.67 22.73 17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        {/* Reset View */}
        <button
          onClick={handleResetView}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          className="control-button"
          title="Reset View"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="white" strokeWidth="2"/>
            <path d="M12 7V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Divider */}
        <div style={{
          width: '1px',
          height: '40px',
          background: 'rgba(255, 255, 255, 0.2)',
          margin: '0 0.25rem'
        }} />

        {/* Download Button */}
        <button
          onClick={handleDownload}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          className="control-button"
          title="Download"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Close Button - Top Right */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          zIndex: 10,
          animation: 'slideDown 0.4s ease'
        }}
        className="control-button"
        title="Close (Esc)"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Document Content */}
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        style={{
          position: 'relative',
          width: '90%',
          height: '90%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
          userSelect: 'none'
        }}
      >
        {isPDF ? (
          <iframe
            src={document.url}
            style={{
              width: `${100 * zoom}%`,
              height: `${100 * zoom}%`,
              border: 'none',
              borderRadius: '12px',
              background: '#fff',
              boxShadow: '0 20px 80px rgba(0, 0, 0, 0.6)',
              transform: `translate(${position.x}px, ${position.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.1s ease'
            }}
            title={document.name || 'PDF Document'}
          />
        ) : (
          <img
            src={document.url}
            alt={document.name || 'Document'}
            onMouseDown={handleMouseDown}
            draggable={false}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: '12px',
              boxShadow: '0 20px 80px rgba(0, 0, 0, 0.6)',
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.1s ease',
              pointerEvents: zoom > 1 ? 'auto' : 'none'
            }}
            onError={(e) => {
              console.error(`Failed to load image: ${document.url}`)
              e.target.style.display = 'none'
            }}
          />
        )}
      </div>

      {/* Help Text - Bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(12px)',
          padding: '0.75rem 1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.7)',
          display: 'flex',
          gap: '2rem',
          animation: 'slideUp 0.4s ease',
          zIndex: 10
        }}
      >
        <span>
          <kbd style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.8rem'
          }}>Scroll</kbd> to zoom
        </span>
        {zoom > 1 && (
          <span>
            <kbd style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.8rem'
            }}>Drag</kbd> to pan
          </span>
        )}
        <span>
          <kbd style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.8rem'
          }}>Esc</kbd> to close
        </span>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .control-button:not(:disabled):hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.05);
        }

        .control-button:not(:disabled):active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  )
}