import React from 'react';

function WorkoutView({ selectedExercise, onReset }) {

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
      
      <div style={{
        border: '2px dashed #ccc',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <p>Camera view will appear here</p>
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