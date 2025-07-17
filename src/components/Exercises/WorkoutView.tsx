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
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        color: 'white',
        padding: 'clamp(1.5rem, 3vw, 2rem)',
        borderRadius: 'var(--border-radius-xl)',
        marginBottom: '2rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <h2 className="responsive-text-3xl" style={{ 
          margin: '0 0 1rem 0', 
          fontWeight: '700'
        }}>💪 Workout Session</h2>
        <div className="responsive-text-xl" style={{ 
          opacity: 0.9,
          marginBottom: '0.5rem'
        }}>
          <strong>Exercise:</strong> {selectedExercise ? selectedExercise.name : 'None Selected'}
        </div>
        {selectedExercise && (
          <div style={{ 
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', 
            opacity: 0.8
          }}>
            {selectedExercise.description} • {selectedExercise.type === 'time' ? 'Time-based' : 'Rep-based'}
          </div>
        )}
      </div>

      {/* Error/Success Messages */}
      {saveError && (
        <div style={{
          background: '#fee2e2',
          color: '#dc2626',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--border-radius-lg)',
          marginBottom: '2rem',
          border: '1px solid #fecaca',
          fontSize: '0.95rem'
        }}>
          ❌ {saveError}
        </div>
      )}

      {saveSuccess && (
        <div style={{
          background: '#dcfce7',
          color: '#166534',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--border-radius-lg)',
          marginBottom: '2rem',
          border: '1px solid #bbf7d0',
          fontSize: '0.95rem'
        }}>
          ✅ Workout saved successfully! Check your reports to see the details.
        </div>
      )}

      {/* Main Content - Responsive Layout */}
      <div className="workout-content-grid">
        
        {/* Left Column - Camera (takes remaining space) */}
        <div className="workout-camera-section">
          <CameraView onPoseResults={handlePoseResults} />
        </div>

        {/* Right Column - Controls and Status */}
        <div className="workout-controls-section">
          {/* Tracking Controls */}
          <div style={{
            background: 'var(--surface-white)',
            border: '1px solid var(--neutral-200)',
            borderRadius: 'var(--border-radius-xl)',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ 
              margin: '0 0 1.5rem 0', 
              color: 'var(--neutral-700)',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>🎯 Workout Controls</h3>
            
            {/* Status Display */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600',
                background: isTracking ? '#dcfce7' : '#fee2e2',
                color: isTracking ? '#166534' : '#dc2626',
                border: isTracking ? '1px solid #bbf7d0' : '1px solid #fecaca'
              }}>
                {isTracking ? '🟢 TRACKING ACTIVE' : '🔴 TRACKING STOPPED'}
              </div>
            </div>

            {/* Current Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                background: 'var(--neutral-50)', 
                borderRadius: 'var(--border-radius-lg)',
                border: '1px solid var(--neutral-200)'
              }}>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  color: 'var(--primary-color)',
                  marginBottom: '0.25rem'
                }}>
                  {selectedExercise?.type === 'time' ? `${totalReps}s` : totalReps}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--neutral-600)',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {selectedExercise?.type === 'time' ? 'TIME' : 'REPS'}
                </div>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                background: 'var(--neutral-50)', 
                borderRadius: 'var(--border-radius-lg)',
                border: '1px solid var(--neutral-200)'
              }}>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  color: 'var(--success-color)',
                  marginBottom: '0.25rem'
                }}>
                  {formScores.length > 0 ? Math.round(formScores.reduce((a,b) => a + b, 0) / formScores.length) : 0}%
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--neutral-600)',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  AVG FORM
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {!isTracking ? (
                <button
                  onClick={startTracking}
                  disabled={!selectedExercise || isSaving}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: (selectedExercise && !isSaving) 
                      ? 'linear-gradient(135deg, var(--success-color) 0%, var(--accent-color) 100%)' 
                      : 'var(--neutral-400)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--border-radius-lg)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: (selectedExercise && !isSaving) ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {isSaving ? '💾 Saving...' : '▶️ Start Tracking'}
                </button>
              ) : (
                <button
                  onClick={stopTracking}
                  disabled={isSaving}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: isSaving 
                      ? 'var(--neutral-400)' 
                      : 'linear-gradient(135deg, var(--danger-color) 0%, var(--warning-color) 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--border-radius-lg)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {isSaving ? '💾 Saving...' : '⏹️ Stop & Save'}
                </button>
              )}

              {/* Reset Button */}
              <button
                onClick={() => {
                  resetWorkout();
                  onReset();
                }}
                disabled={isSaving}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: isSaving ? 'var(--neutral-300)' : 'var(--neutral-500)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--border-radius-lg)',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🔄 Reset & Change Exercise
              </button>
            </div>
          </div>

          {/* Workout Report */}
          {workoutReport && (
            <div style={{
              background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--secondary-color) 100%)',
              color: 'white',
              padding: '1.5rem',
              borderRadius: 'var(--border-radius-xl)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h3 style={{ 
                margin: '0 0 1rem 0',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>📊 Workout Report</h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem', 
                fontSize: '0.875rem', 
                marginBottom: '1rem'
              }}>
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
                padding: '1rem',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 'var(--border-radius-lg)',
                marginBottom: '1rem'
              }}>
                <div style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem'
                }}>
                  Overall Score: <span style={{ color: getScoreColor(workoutReport.overallScore) }}>
                    {workoutReport.overallScore}%
                  </span>
                </div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  lineHeight: '1.4',
                  opacity: 0.9
                }}>
                  {workoutReport.feedback}
                </div>
              </div>

              <div style={{ 
                fontSize: '0.75rem', 
                opacity: 0.8
              }}>
                Completed at {workoutReport.completedAt}
              </div>
              
              {workoutReport.overallScore >= 80 && (
                <div style={{ 
                  marginTop: '0.75rem', 
                  fontSize: '1rem',
                  fontWeight: '500'
                }}>
                  🎉 Excellent performance! Keep it up!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Form Analyzer - Full Width */}
      <div className="workout-form-analyzer">
        {selectedExercise && (
          <FormAnalyzer
            poseResults={isTracking ? poseResults : null}
            selectedExercise={selectedExercise}
            onRepDetected={handleRepDetected}
          />
        )}
      </div>
      <div style={{ 
        marginTop: '2rem',
        width: '100%'
      }}>
      </div>
    </div>
  );
}

export default WorkoutView;