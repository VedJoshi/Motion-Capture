import React, { useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { saveWorkoutReport, calculateWorkoutStats, generateWorkoutFeedback } from '../../utils/workoutReports';
import CameraView from '../Camera/CameraView.tsx';
import FormAnalyzer from './FormAnalyzer.tsx';

/**
 * Main workout interface component with tracking controls and workout reports
 */
function WorkoutView({ selectedExercise, onReset }) {
  const { user } = useAuth();
  const [poseResults, setPoseResults] = useState(null);
  const [totalReps, setTotalReps] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [workoutReport, setWorkoutReport] = useState(null);
  const [formScores, setFormScores] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
    setSaveError(null);
    setSaveSuccess(false);
    console.log('🚀 Workout tracking started!');
  };

  /**
   * Stop tracking and generate workout report
   */
  const stopTracking = async () => {
    setIsTracking(false);
    setIsSaving(true);
    setSaveError(null);
    
    const endTime = new Date();
    const duration = workoutStartTime ? Math.floor((endTime.getTime() - workoutStartTime.getTime()) / 1000) : 0;
    
    // Calculate workout statistics
    const stats = calculateWorkoutStats(formScores);
    
    // Generate AI feedback
    const feedback = generateWorkoutFeedback(selectedExercise.name, stats, formScores);
    
    // Create workout data object
    const workoutData = {
      exerciseName: selectedExercise.name,
      exerciseType: selectedExercise.type || 'reps',
      totalReps: selectedExercise.type === 'time' ? 0 : totalReps,
      duration: selectedExercise.type === 'time' ? totalReps : duration,
      repScores: formScores,
      overallScore: stats.overallScore,
      averageScore: stats.averageScore,
      bestRepScore: stats.bestRepScore,
      feedback: feedback
    };

    // Generate workout report for display
    const report = {
      exercise: selectedExercise.name,
      exerciseType: selectedExercise.type || 'reps',
      totalReps: workoutData.totalReps,
      duration: workoutData.duration,
      avgFormScore: stats.averageScore,
      overallScore: stats.overallScore,
      bestRepScore: stats.bestRepScore,
      formScores: formScores,
      feedback: feedback,
      completedAt: endTime.toLocaleTimeString()
    };
    
    setWorkoutReport(report);
    
    // Save to database
    try {
      const saveResult = await saveWorkoutReport(user.id, workoutData);
      
      if (saveResult.success) {
        setSaveSuccess(true);
        console.log('✅ Workout saved successfully!', saveResult.data);
      } else {
        setSaveError(`Failed to save workout: ${saveResult.error}`);
        console.error('❌ Failed to save workout:', saveResult.error);
      }
    } catch (error) {
      setSaveError(`Error saving workout: ${error.message}`);
      console.error('❌ Error saving workout:', error);
    } finally {
      setIsSaving(false);
    }
    
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
    setSaveError(null);
    setSaveSuccess(false);
    setIsSaving(false);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#22c55e';
    if (score >= 75) return '#eab308';
    if (score >= 60) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="workout-container">
      {/* Header Section */}
      <div style={{
        background: 'var(--white)',
        color: 'var(--grey-700)',
        padding: '2rem',
        borderBottom: '1px solid var(--grey-200)',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          margin: '0 0 1rem 0', 
          fontWeight: '700',
          color: 'var(--grey-700)'
        }}>Workout Session</h2>
        <div style={{ 
          fontSize: '1.125rem',
          fontWeight: '500'
        }}>
          {selectedExercise ? selectedExercise.name : 'Select an Exercise'}
        </div>
      </div>

      {/* Error/Success Messages */}
      {saveError && (
        <div style={{
          background: 'var(--grey-100)',
          color: 'var(--grey-700)',
          padding: '1rem',
          border: '1px solid var(--grey-200)',
          marginBottom: '1rem',
          borderRadius: 'var(--border-radius)'
        }}>
          {saveError}
        </div>
      )}

      {saveSuccess && (
        <div style={{
          background: 'var(--grey-100)',
          color: 'var(--grey-700)',
          padding: '1rem',
          border: '1px solid var(--grey-200)',
          marginBottom: '1rem',
          borderRadius: 'var(--border-radius)'
        }}>
          Workout saved successfully
        </div>
      )}

      <div className="workout-content-grid">
        {/* Camera View */}
        <div style={{
          border: '1px solid var(--grey-200)',
          borderRadius: 'var(--border-radius)',
          overflow: 'hidden'
        }}>
          <CameraView onPoseResults={handlePoseResults} />
        </div>

        {/* Controls Section */}
        <div style={{
          background: 'var(--white)',
          border: '1px solid var(--grey-200)',
          padding: '1.5rem',
          borderRadius: 'var(--border-radius)'
        }}>
          <h3 style={{ 
            margin: '0 0 1.5rem 0',
            fontWeight: '500',
            color: 'var(--grey-700)'
          }}>Controls</h3>

          {/* Status Display */}
          <div style={{
            padding: '0.5rem',
            background: 'var(--grey-100)',
            color: 'var(--grey-700)',
            borderRadius: 'var(--border-radius)',
            marginBottom: '1rem',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {isTracking ? 'TRACKING ACTIVE' : 'TRACKING STOPPED'}
          </div>

          {/* Control Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {!isTracking ? (
              <button
                onClick={startTracking}
                disabled={!selectedExercise || isSaving}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  opacity: (!selectedExercise || isSaving) ? 0.5 : 1
                }}
              >
                {isSaving ? 'Saving...' : 'Start Tracking'}
              </button>
            ) : (
              <button
                onClick={stopTracking}
                disabled={isSaving}
                style={{
                  padding: '0.75rem',
                  background: 'var(--primary-color)',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: 'var(--border-radius)',
                  fontSize: '1rem',
                  fontWeight: '500',
                  opacity: isSaving ? 0.5 : 1
                }}
              >
                {isSaving ? 'Saving...' : 'Stop & Save'}
              </button>
            )}

            <button
              onClick={() => {
                resetWorkout();
                onReset();
              }}
              disabled={isSaving}
              style={{
                padding: '0.75rem',
                background: 'var(--white)',
                color: 'var(--grey-700)',
                border: '1px solid var(--grey-200)',
                borderRadius: 'var(--border-radius)',
                fontSize: '0.875rem',
                fontWeight: '500',
                opacity: isSaving ? 0.5 : 1
              }}
            >
              Reset & Change Exercise
            </button>
          </div>
        </div>
      </div>

      {/* Form Analyzer */}
      <div className="workout-form-analyzer">
        {selectedExercise && (
          <FormAnalyzer
            poseResults={isTracking ? poseResults : null}
            selectedExercise={selectedExercise}
            onRepDetected={handleRepDetected}
          />
        )}
      </div>
    </div>
  );
}

export default WorkoutView;