import React from 'react';

/**
 * Camera control buttons component
 */
function CameraControls({ onStartCamera, onStopCamera, isCameraActive }) {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '10px', 
      justifyContent: 'center',
      marginTop: '10px' 
    }}>
      {!isCameraActive ? (
        <button 
          onClick={onStartCamera}
          style={{
            padding: '8px 16px',
            background: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Start Camera
        </button>
      ) : (
        <button 
          onClick={onStopCamera}
          style={{
            padding: '8px 16px',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Stop Camera
        </button>
      )}
    </div>
  );
}

export default CameraControls;