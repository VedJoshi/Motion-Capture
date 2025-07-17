import React from 'react';

/**
 * Professional camera control buttons component
 */
function CameraControls({ onStartCamera, onStopCamera, isCameraActive }) {
  const buttonBaseStyle = {
    padding: '0.875rem 2rem',
    border: '1px solid transparent',
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
    justifyContent: 'center'
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '1rem', 
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      width: '100%',
      maxWidth: '1200px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginRight: 'auto',
      }}>
        <img 
          src="/fitformlogo.png" 
          alt="FitForm Logo" 
          style={{
            height: '40px',
            display: { xs: 'none', sm: 'block' }
          }}
        />
      </div>
      
      {!isCameraActive ? (
        <button 
          onClick={onStartCamera}
          style={{
            ...buttonBaseStyle,
            background: `linear-gradient(135deg, var(--success-color) 0%, var(--accent-light) 100%)`,
            color: 'white',
            boxShadow: 'var(--shadow-md)',
            borderColor: 'var(--success-color)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-1px)';
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
            background: `linear-gradient(135deg, var(--danger-color) 0%, #dc2626 100%)`,
            color: 'white',
            boxShadow: 'var(--shadow-md)',
            borderColor: 'var(--danger-color)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-1px)';
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