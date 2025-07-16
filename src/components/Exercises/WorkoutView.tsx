import React, { useRef, useState } from 'react';
import CameraView from '../Camera/CameraView.tsx';
import CameraControls from '../Camera/CameraControls.tsx';

/**
 * Main workout interface component
 */
function WorkoutView({ selectedExercise, onReset }) {
  const cameraRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleStartCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.startCamera();
      setIsCameraActive(true);
    }
  };

  const handleStopCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.stopCamera();
      setIsCameraActive(false);
    }
  };

  return (
    <div>
      <h2>Workout Session</h2>
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <p><strong>Selected Exercise:</strong> {selectedExercise ? selectedExercise.name : 'None'}</p>
        {selectedExercise && (
          <p><strong>Description:</strong> {selectedExercise.description}</p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <CameraView ref={cameraRef} />
        <CameraControls 
          onStartCamera={handleStartCamera}
          onStopCamera={handleStopCamera}
          isCameraActive={isCameraActive}
        />
      </div>

      <div>
        <p>Reps Completed: 0</p>
        <button style={{
          padding: '15px 30px',
          background: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px'
        }}>
          {selectedExercise ? `Start ${selectedExercise.name}` : 'Select Exercise First'}
        </button>

        <button
          onClick={onReset}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '14px'
          }}
        >
          Reset
        </button>

      </div>
    </div>
  );
}

export default WorkoutView;