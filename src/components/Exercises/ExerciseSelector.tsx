import React, { useState } from 'react';
import { getAllExercises } from '../../data/exercises';

function ExerciseSelector({ onExerciseSelect }) {
  const [selectedExercise, setSelectedExercise] = useState(null);
  
  const exercises = getAllExercises();

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
              color: selectedExercise === exercise.id ? 'white' : '#3498db',
              textAlign: 'left',
              minWidth: '200px'
            }}
          >
            <h3>{exercise.name}</h3>
            <p>{exercise.description}</p>
            <small>Type: {exercise.type === 'time' ? 'Hold Duration' : 'Repetitions'}</small>
            <br />
            <small>Muscles: {exercise.targetMuscles.join(', ')}</small>
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
            Start {exercises.find(e => e.id === selectedExercise)?.name} Analysis
          </button>
        </div>
      )}
    </div>
  );
}

export default ExerciseSelector;