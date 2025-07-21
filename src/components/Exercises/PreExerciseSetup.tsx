import React, { useState } from 'react';

/**
 * Pre-Exercise Setup Component with Camera Guidance
 * Provides exercise-specific setup instructions and positioning guidance
 */
interface PreExerciseSetupProps {
  exercise: {
    id: string;
    name: string;
    description?: string;
    cameraDistance?: string;
    cameraHeight?: string;
    cameraAngle?: string;
    demoGif?: string;
    tips?: string[];
  };
  onStartWorkout: () => void;
  onGoBack: () => void;
}

function PreExerciseSetup({ exercise, onStartWorkout, onGoBack }: PreExerciseSetupProps) {
  const [cameraReady, setCameraReady] = useState(false);

  // Exercise-specific camera setup instructions
  const getCameraSetup = (exerciseId: string) => {
    const setups = {
      'squats': {
        distance: 'Place phone 2 meters (6 feet) away',
        height: 'Position at knee height',
        angle: 'Straight horizontal view',
        visibility: 'Ensure full body from head to feet is visible'
      },
      'pushups': {
        distance: 'Place phone 1.5 meters (5 feet) away',
        height: 'Ground level or slightly elevated',
        angle: 'Angled upward 15-30 degrees',
        visibility: 'Ensure full body profile view'
      },
      'overhead_press': {
        distance: 'Place phone 2.5 meters (8 feet) away',
        height: 'Chest height position',
        angle: 'Angled upward 45 degrees',
        visibility: 'Full body with extended arms visible'
      },
      'planks': {
        distance: 'Place phone 1.5 meters (5 feet) away',
        height: 'Ground level',
        angle: 'Straight side view',
        visibility: 'Full body profile from head to feet'
      },
      'bicep_curls': {
        distance: 'Place phone 2 meters (6 feet) away',
        height: 'Chest height',
        angle: 'Straight horizontal view',
        visibility: 'Upper body and arms clearly visible'
      },
      'lunges': {
        distance: 'Place phone 2.5 meters (8 feet) away',
        height: 'Waist height',
        angle: 'Straight horizontal view',
        visibility: 'Full body including legs and feet'
      },
      'situps': {
        distance: 'Place phone 2 meters (6 feet) away',
        height: 'Ground level',
        angle: 'Angled upward 30 degrees',
        visibility: 'Full body profile from head to feet'
      },
      'deadlifts': {
        distance: 'Place phone 2.5 meters (8 feet) away',
        height: 'Knee height',
        angle: 'Straight horizontal view',
        visibility: 'Full body with weights clearly visible'
      }
    };

    return setups[exerciseId] || setups['squats'];
  };

  const cameraSetup = getCameraSetup(exercise.id);

  const handleCameraCheck = () => {
    setCameraReady(!cameraReady);
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: 'var(--space-lg)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Back Button */}
      <button
        onClick={onGoBack}
        style={{
          alignSelf: 'flex-start',
          background: 'none',
          border: 'none',
          color: 'var(--neutral-600)',
          fontSize: 'var(--font-size-lg)',
          cursor: 'pointer',
          padding: 'var(--space-sm)',
          marginBottom: 'var(--space-lg)',
          borderRadius: 'var(--border-radius-md)',
          transition: 'var(--transition-fast)'
        }}
        onMouseOver={(e) => e.target.style.background = 'var(--neutral-100)'}
        onMouseOut={(e) => e.target.style.background = 'none'}
      >
        ← Back to Exercises
      </button>

      {/* Exercise Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
        borderRadius: 'var(--border-radius-xl)',
        padding: 'var(--space-2xl)',
        textAlign: 'center',
        color: 'white',
        marginBottom: 'var(--space-2xl)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h1 style={{
          fontSize: 'var(--font-size-3xl)',
          fontWeight: '700',
          margin: '0 0 var(--space-md) 0'
        }}>
          {exercise.name}
        </h1>
        {exercise.description && (
          <p style={{
            fontSize: 'var(--font-size-lg)',
            margin: 0,
            opacity: 0.9
          }}>
            {exercise.description}
          </p>
        )}
      </div>

      {/* Demo Section */}
      {exercise.demoGif && (
        <div style={{
          background: 'var(--surface-white)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--space-xl)',
          marginBottom: 'var(--space-xl)',
          border: '1px solid var(--neutral-200)',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: 'var(--neutral-700)',
            marginBottom: 'var(--space-md)',
            fontSize: 'var(--font-size-lg)'
          }}>
            Exercise Demo
          </h3>
          <div style={{
            width: '200px',
            height: '200px',
            background: 'var(--neutral-100)',
            borderRadius: 'var(--border-radius-md)',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--font-size-lg)',
            color: 'var(--neutral-500)'
          }}>
            🎥 Demo Animation
          </div>
        </div>
      )}

      {/* Camera Setup Instructions */}
      <div style={{
        background: 'var(--surface-white)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--space-xl)',
        marginBottom: 'var(--space-xl)',
        border: '1px solid var(--neutral-200)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{
          color: 'var(--neutral-700)',
          marginBottom: 'var(--space-lg)',
          fontSize: 'var(--font-size-xl)',
          fontWeight: '600'
        }}>
          📱 Camera Setup
        </h3>

        <div style={{ 
          display: 'grid',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-lg)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: 'var(--space-md)',
            background: 'var(--secondary-ultralight)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--secondary-light)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--border-radius-full)',
              background: 'var(--primary-color)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 'var(--space-md)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: '600'
            }}>
              1
            </div>
            <span style={{ color: 'var(--neutral-700)', fontWeight: '500' }}>
              {cameraSetup.distance}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: 'var(--space-md)',
            background: 'var(--secondary-ultralight)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--secondary-light)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--border-radius-full)',
              background: 'var(--primary-color)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 'var(--space-md)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: '600'
            }}>
              2
            </div>
            <span style={{ color: 'var(--neutral-700)', fontWeight: '500' }}>
              {cameraSetup.height}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: 'var(--space-md)',
            background: 'var(--secondary-ultralight)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--secondary-light)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--border-radius-full)',
              background: 'var(--primary-color)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 'var(--space-md)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: '600'
            }}>
              3
            </div>
            <span style={{ color: 'var(--neutral-700)', fontWeight: '500' }}>
              {cameraSetup.visibility}
            </span>
          </div>
        </div>

        {/* Camera Check */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          padding: 'var(--space-lg)',
          background: cameraReady ? '#dcfce7' : 'var(--neutral-50)',
          borderRadius: 'var(--border-radius-md)',
          border: cameraReady ? '1px solid #bbf7d0' : '1px solid var(--neutral-200)',
          cursor: 'pointer',
          transition: 'var(--transition-fast)'
        }}
        onClick={handleCameraCheck}
        >
          <input
            type="checkbox"
            checked={cameraReady}
            onChange={handleCameraCheck}
            style={{
              width: '20px',
              height: '20px',
              accentColor: 'var(--primary-color)'
            }}
          />
          <span style={{
            color: cameraReady ? '#166534' : 'var(--neutral-700)',
            fontWeight: '500'
          }}>
            Camera is positioned correctly and I can see my full body
          </span>
        </div>
      </div>

      {/* Floor Marker Guidance */}
      <div style={{
        background: 'var(--surface-white)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--space-xl)',
        marginBottom: 'auto',
        border: '1px solid var(--neutral-200)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{
          color: 'var(--neutral-700)',
          marginBottom: 'var(--space-md)',
          fontSize: 'var(--font-size-lg)',
          fontWeight: '600'
        }}>
          🎯 Positioning Tips
        </h3>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          <li style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 'var(--space-sm)',
            color: 'var(--neutral-600)'
          }}>
            <span style={{
              background: 'var(--warning-color)',
              color: 'white',
              width: '20px',
              height: '20px',
              borderRadius: 'var(--border-radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 'var(--space-md)',
              fontSize: 'var(--font-size-xs)'
            }}>
              ⚡
            </span>
            Stand on an imaginary yellow floor marker for best tracking
          </li>
          <li style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 'var(--space-sm)',
            color: 'var(--neutral-600)'
          }}>
            <span style={{
              background: 'var(--success-color)',
              color: 'white',
              width: '20px',
              height: '20px',
              borderRadius: 'var(--border-radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 'var(--space-md)',
              fontSize: 'var(--font-size-xs)'
            }}>
              💡
            </span>
            Ensure good lighting and avoid backlit positions
          </li>
          <li style={{
            display: 'flex',
            alignItems: 'center',
            color: 'var(--neutral-600)'
          }}>
            <span style={{
              background: 'var(--primary-color)',
              color: 'white',
              width: '20px',
              height: '20px',
              borderRadius: 'var(--border-radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 'var(--space-md)',
              fontSize: 'var(--font-size-xs)'
            }}>
              📏
            </span>
            Keep the camera stable and at the specified {cameraSetup.angle.toLowerCase()}
          </li>
        </ul>
      </div>

      {/* Start Button */}
      <button
        onClick={onStartWorkout}
        disabled={!cameraReady}
        style={{
          width: '100%',
          background: cameraReady 
            ? 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-color) 100%)'
            : 'var(--neutral-400)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--space-lg)',
          fontSize: 'var(--font-size-lg)',
          fontWeight: '600',
          cursor: cameraReady ? 'pointer' : 'not-allowed',
          transition: 'var(--transition-fast)',
          marginTop: 'var(--space-xl)',
          minHeight: 'var(--touch-md)',
          boxShadow: cameraReady ? 'var(--shadow-md)' : 'none'
        }}
        onMouseOver={(e) => {
          if (cameraReady) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = 'var(--shadow-lg)';
          }
        }}
        onMouseOut={(e) => {
          if (cameraReady) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'var(--shadow-md)';
          }
        }}
      >
        {cameraReady ? '🚀 Start Workout' : '📱 Complete Camera Setup First'}
      </button>
    </div>
  );
}

export default PreExerciseSetup;
