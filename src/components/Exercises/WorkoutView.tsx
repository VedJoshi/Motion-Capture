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
      duration: selectedExercise.type === 'time' ? totalReps : duration, // For time-based exercises, totalReps is actually time
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
            {selectedExercise.description} • {selectedExercise.type === 'time' ? 'Time-based' : 'Rep-based'}
          </div>
        )}
      </div>

      {/* Error/Success Messages */}
      {saveError && (
        <div style={{
          background: '#fee2e2',
          color: '#dc2626',
          padding: '12px 20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #fecaca'
        }}>
          ❌ {saveError}
        </div>
      )}

      {saveSuccess && (
        <div style={{
          background: '#dcfce7',
          color: '#166534',
          padding: '12px 20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #bbf7d0'
        }}>
          ✅ Workout saved successfully! Check your reports to see the details.
        </div>
      )}

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
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                  {selectedExercise?.type === 'time' ? `${totalReps}s` : totalReps}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                  {selectedExercise?.type === 'time' ? 'TIME' : 'REPS'}
                </div>
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
                  disabled={!selectedExercise || isSaving}
                  style={{
                    flex: 1,
                    padding: '15px',
                    background: (selectedExercise && !isSaving) ? '#28a745' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: (selectedExercise && !isSaving) ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s'
                  }}
                >
                  {isSaving ? '💾 Saving...' : '▶️ Start Tracking'}
                </button>
              ) : (
                <button
                  onClick={stopTracking}
                  disabled={isSaving}
                  style={{
                    flex: 1,
                    padding: '15px',
                    background: isSaving ? '#6c757d' : '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {isSaving ? '💾 Saving...' : '⏹️ Stop & Save'}
                </button>
              )}
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                resetWorkout();
                onReset();
              }}
              disabled={isSaving}
              style={{
                width: '100%',
                marginTop: '15px',
                padding: '12px',
                backgroundColor: isSaving ? '#adb5bd' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: isSaving ? 'not-allowed' : 'pointer'
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
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px', marginBottom: '15px' }}>
                <div><strong>Exercise:</strong> {workoutReport.exercise}</div>
                <div><strong>Type:</strong> {workoutReport.exerciseType}</div>
                {workoutReport.exerciseType === 'time' ? (
                  <div><strong>Duration:</strong> {workoutReport.duration}s</div>
                ) : (
                  <>
                    <div><strong>Total Reps:</strong> {workoutReport.totalReps}</div>
                    <div><strong>Duration:</strong> {Math.floor(workoutReport.duration / 60)}m {workoutReport.duration % 60}s</div>
                  </>
                )}
                <div><strong>Avg Form:</strong> {workoutReport.avgFormScore}%</div>
                <div><strong>Best Score:</strong> {workoutReport.bestRepScore}%</div>
              </div>

              <div style={{
                padding: '15px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                  Overall Score: <span style={{ color: getScoreColor(workoutReport.overallScore) }}>
                    {workoutReport.overallScore}%
                  </span>
                </div>
                <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                  {workoutReport.feedback}
                </div>
              </div>

              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                Completed at {workoutReport.completedAt}
              </div>
              
              {workoutReport.overallScore >= 80 && (
                <div style={{ marginTop: '10px', fontSize: '16px' }}>
                  🎉 Excellent performance! Keep it up!
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