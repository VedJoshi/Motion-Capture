import React from 'react';

/**
 * Professional camera control buttons component
 */
function CameraControls({ onStartCamera, onStopCamera, isCameraActive }) {
  const buttonBaseStyle = {
    padding: '0.875rem 2rem',
    border: '2px solid transparent',
    borderRadius: 'var(--border-radius-lg)',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'inherit',
    minWidth: '160px',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
    color: 'white',
    boxShadow: 'var(--shadow-md)',
    margin: '0 auto'
  };

  return (
    <div style={{ 
      width: '100%',
      maxWidth: '800px',
      margin: '1rem auto',
      textAlign: 'center'
    }}>
      {!isCameraActive ? (
        <button 
          onClick={onStartCamera}
          style={buttonBaseStyle}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          📹 Start Camera
        </button>
      ) : (
        <button 
          onClick={onStopCamera}
          style={{
            ...buttonBaseStyle,
            background: 'linear-gradient(135deg, var(--danger-color) 0%, var(--error-color) 100%)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          ⏹️ Stop Camera
        </button>
      )}
    </div>
  );
}

export default CameraControls;