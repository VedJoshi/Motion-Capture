import React, { useRef, useState } from 'react';
import CameraView from '../Camera/CameraView.tsx';
import FormAnalyzer from './FormAnalyzer.tsx';
/**
 * Main workout interface component
 */
function WorkoutView({ selectedExercise, onReset }) {
  const [poseResults, setPoseResults] = useState(null);
  const [totalReps, setTotalReps] = useState(0);

  const handlePoseResults = (results) => {
    setPoseResults(results);
  };

  const handleRepDetected = (exerciseType, repNumber, formScore) => {
    setTotalReps(repNumber);
    console.log(`${exerciseType} rep #${repNumber} detected with ${formScore}% form quality!`);

    if (formScore >= 90) {
      console.log('🎉 Perfect form!');
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

      {/* Pass pose results callback to camera */}
      <div style={{ marginBottom: '20px' }}>
        <CameraView onPoseResults={handlePoseResults} />
      </div>

      {/* Add form analyzer */}
      {selectedExercise && (
        <FormAnalyzer
          poseResults={poseResults}
          selectedExercise={selectedExercise}
          onRepDetected={handleRepDetected}
        />
      )}

      <div>
        <p>Total Reps: {totalReps}</p>
        <button style={{
          padding: '15px 30px',
          background: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px'
        }}>
          {selectedExercise ? `Analyzing ${selectedExercise.name}` : 'Select Exercise First'}
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