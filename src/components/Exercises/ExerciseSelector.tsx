import React, { useState } from 'react';
import { getAllExercises } from '../../data/exercises';

/**
 * Enhanced exercise selection component with improved UI
 */
function ExerciseSelector({ onExerciseSelect }) {
  const [selectedExercise, setSelectedExercise] = useState(null);
  
  const exercises = getAllExercises();

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise.id);
    if (onExerciseSelect) {
      onExerciseSelect(exercise);
    }
  };

  const getExerciseEmoji = (exerciseName) => {
    const name = exerciseName.toLowerCase();
    if (name.includes('squat')) return '🦵';
    if (name.includes('pushup') || name.includes('push-up')) return '💪';
    if (name.includes('plank')) return '🏋️';
    return '🤸';
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        padding: '30px',
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        borderRadius: '16px',
        color: 'white'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>🎯 Choose Your Exercise</h2>
        <p style={{ margin: 0, opacity: 0.9 }}>Select an exercise to start your AI-powered form analysis</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '25px',
        marginBottom: '30px'
      }}>
        {exercises.map(exercise => (
          <button
            key={exercise.id}
            onClick={() => handleExerciseClick(exercise)}
            style={{
              padding: '25px',
              border: selectedExercise === exercise.id ? '3px solid #667eea' : '2px solid #e9ecef',
              borderRadius: '16px',
              background: selectedExercise === exercise.id 
                ? 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)' 
                : 'white',
              color: selectedExercise === exercise.id ? 'white' : '#495057',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedExercise === exercise.id 
                ? '0 8px 25px rgba(37, 99, 235, 0.3)' 
                : '0 4px 15px rgba(0, 0, 0, 0.1)',
              transform: selectedExercise === exercise.id ? 'translateY(-4px)' : 'translateY(0)'
            }}
            onMouseOver={(e) => {
              if (selectedExercise !== exercise.id) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseOut={(e) => {
              if (selectedExercise !== exercise.id) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <span style={{ fontSize: '32px' }}>{getExerciseEmoji(exercise.name)}</span>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>{exercise.name}</h3>
            </div>
            
            <p style={{ 
              margin: '0 0 15px 0', 
              fontSize: '14px', 
              lineHeight: '1.5',
              opacity: selectedExercise === exercise.id ? 0.9 : 0.8
            }}>
              {exercise.description}
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              <span style={{
                padding: '4px 12px',
                background: selectedExercise === exercise.id ? 'rgba(255,255,255,0.2)' : '#f8f9fa',
                color: selectedExercise === exercise.id ? 'white' : '#6c757d',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {exercise.type === 'time' ? '⏱️ Hold Duration' : '🔄 Repetitions'}
              </span>
            </div>
            
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              <strong>Target:</strong> {exercise.targetMuscles.join(', ')}
            </div>
          </button>
        ))}
      </div>
      
      {selectedExercise && (
        <div style={{ 
          textAlign: 'center',
          padding: '25px',
          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
          borderRadius: '16px',
          color: 'white'
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>🚀 Ready to Start!</h3>
          <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>
            You've selected <strong>{exercises.find(e => e.id === selectedExercise)?.name}</strong>
          </p>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
            The workout will begin once you proceed to the next screen
          </p>
        </div>
      )}
    </div>
  );
}

export default ExerciseSelector;