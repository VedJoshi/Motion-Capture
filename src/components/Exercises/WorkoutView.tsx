import React, { useRef, useState } from 'react';
import CameraView from '../Camera/CameraView.tsx';
import FormAnalyzer from './FormAnalyzer.tsx';

/**
 * Main workout interface component with tracking controls and workout reports
 */
function WorkoutView({ selectedExercise, onReset }) {
  const [poseResults, setPoseResults] = useState(null);
  const [totalReps, setTotalReps] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [workoutReport, setWorkoutReport] = useState(null);
  const [formScores, setFormScores] = useState([]);

  const handlePoseResults = (results) => {
    setPoseResults(results);
  };

  const handleRepDetected = (exerciseType, repNumber, formScore) => {
    if (isTracking) {
      setTotalReps(repNumber);
      setFormScores(prev => [...prev, formScore]);
      console.log(`${exerciseType} rep #${repNumber} detected with ${formScore}% form quality!`);

      if (formScore >= 90) {
        console.log('🎉 Perfect form!');
      }
    }
  };

  /**
   * Start tracking workout session
   */
  const startTracking = () => {
    setIsTracking(true);
    setWorkoutStartTime(new Date());
    setTotalReps(0);
    setFormScores([]);
    setWorkoutReport(null);
    console.log('🚀 Workout tracking started!');
  };

  /**
   * Stop tracking and generate workout report
   */
  const stopTracking = () => {
    setIsTracking(false);
    const endTime = new Date();
    const duration = workoutStartTime ? Math.floor((endTime.getTime() - workoutStartTime.getTime()) / 1000) : 0;
    
    // Calculate average form score
    const avgFormScore = formScores.length > 0 
      ? Math.round(formScores.reduce((sum, score) => sum + score, 0) / formScores.length)
      : 0;

    // Generate workout report
    const report = {
      exercise: selectedExercise.name,
      totalReps,
      duration,
      avgFormScore,
      formScores,
      completedAt: endTime.toLocaleTimeString()
    };
    
    setWorkoutReport(report);
    console.log('✅ Workout tracking stopped!', report);
  };

  /**
   * Reset entire workout session
   */
  const resetWorkout = () => {
    setIsTracking(false);
    setTotalReps(0);
    setFormScores([]);
    setWorkoutReport(null);
    setWorkoutStartTime(null);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>💪 Workout Session</h2>
        <div style={{ fontSize: '18px', opacity: 0.9 }}>
          <strong>Exercise:</strong> {selectedExercise ? selectedExercise.name : 'None Selected'}
        </div>
        {selectedExercise && (
          <div style={{ fontSize: '14px', marginTop: '10px', opacity: 0.8 }}>
            {selectedExercise.description}
          </div>
        )}
      </div>

      {/* Main Content - Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Left Column - Camera */}
        <div>
          <CameraView onPoseResults={handlePoseResults} />
        </div>

        {/* Right Column - Controls and Status */}
        <div>
          {/* Tracking Controls */}
          <div style={{
            background: '#f8f9fa',
            border: '2px solid #e9ecef',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#495057' }}>🎯 Workout Controls</h3>
            
            {/* Status Display */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'inline-block',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                background: isTracking ? '#d4edda' : '#f8d7da',
                color: isTracking ? '#155724' : '#721c24',
                border: isTracking ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
              }}>
                {isTracking ? '🟢 TRACKING ACTIVE' : '🔴 TRACKING STOPPED'}
              </div>
            </div>

            {/* Current Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div style={{ textAlign: 'center', padding: '15px', background: 'white', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{totalReps}</div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>REPS</div>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', background: 'white', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                  {formScores.length > 0 ? Math.round(formScores.reduce((a,b) => a + b, 0) / formScores.length) : 0}%
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>AVG FORM</div>
              </div>
            </div>

            {/* Control Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {!isTracking ? (
                <button
                  onClick={startTracking}
                  disabled={!selectedExercise}
                  style={{
                    flex: 1,
                    padding: '15px',
                    background: selectedExercise ? '#28a745' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: selectedExercise ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s'
                  }}
                >
                  ▶️ Start Tracking
                </button>
              ) : (
                <button
                  onClick={stopTracking}
                  style={{
                    flex: 1,
                    padding: '15px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  ⏹️ Stop & Report
                </button>
              )}
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                resetWorkout();
                onReset();
              }}
              style={{
                width: '100%',
                marginTop: '15px',
                padding: '12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              🔄 Reset & Change Exercise
            </button>
          </div>

          {/* Workout Report */}
          {workoutReport && (
            <div style={{
              background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--secondary-color) 100%)',
              color: 'white',
              padding: '25px',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>📊 Workout Report</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
                <div><strong>Exercise:</strong> {workoutReport.exercise}</div>
                <div><strong>Duration:</strong> {Math.floor(workoutReport.duration / 60)}m {workoutReport.duration % 60}s</div>
                <div><strong>Total Reps:</strong> {workoutReport.totalReps}</div>
                <div><strong>Avg Form:</strong> {workoutReport.avgFormScore}%</div>
              </div>
              <div style={{ marginTop: '15px', fontSize: '12px', opacity: 0.9 }}>
                Completed at {workoutReport.completedAt}
              </div>
              {workoutReport.avgFormScore >= 80 && (
                <div style={{ marginTop: '10px', fontSize: '16px' }}>
                  🎉 Excellent form! Keep it up!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Form Analyzer - Only process when tracking */}
      {selectedExercise && (
        <FormAnalyzer
          poseResults={isTracking ? poseResults : null}
          selectedExercise={selectedExercise}
          onRepDetected={handleRepDetected}
        />
      )}
    </div>
  );
}

export default WorkoutView;