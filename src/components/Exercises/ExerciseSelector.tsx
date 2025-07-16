import React, { useState } from 'react';

/**
 * Exercise selection interface component
 */
function ExerciseSelector({ onExerciseSelect }) {
  const [selectedExercise, setSelectedExercise] = useState(null);
  
  const exercises = [
    { id: 'squats', name: 'Squats', description: 'Lower body strength' },
    { id: 'pushups', name: 'Push-ups', description: 'Upper body strength' },
    { id: 'plank', name: 'Plank', description: 'Core stability' }
  ];

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise.id);
    if (onExerciseSelect) {
      onExerciseSelect(exercise);
    }
  };

  return (
    <div>
      <h2>Choose Your Exercise</h2>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        {exercises.map(exercise => (
          <button
            key={exercise.id}
            onClick={() => handleExerciseClick(exercise)}
            className={selectedExercise === exercise.id ? 'selected' : ''}
            style={{
              padding: '20px',
              border: '2px solid #3498db',
              borderRadius: '8px',
              background: selectedExercise === exercise.id ? '#3498db' : 'white',
              color: selectedExercise === exercise.id ? 'white' : '#3498db'
            }}
          >
            <h3>{exercise.name}</h3>
            <p>{exercise.description}</p>
          </button>
        ))}
      </div>
      
      {selectedExercise && (
        <div style={{ marginTop: '20px' }}>
          <button 
            style={{ 
              padding: '15px 30px',
              background: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          >
            Start {exercises.find(e => e.id === selectedExercise)?.name} Workout
          </button>
        </div>
      )}
    </div>
  );
}

export default ExerciseSelector;