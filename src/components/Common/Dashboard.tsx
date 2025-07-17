import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { dbHelpers } from '../../config/supabase';

/**
 * Enhanced dashboard component displaying real user workout statistics
 */
function Dashboard() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    totalWorkouts: 0,
    totalReps: 0,
    currentStreak: 0,
    loading: true
  });
  const [recentWorkouts, setRecentWorkouts] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchRecentWorkouts();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const { data: reports, error } = await dbHelpers.getUserWorkoutReports(user.id);
      
      if (error) {
        console.error('Error fetching user stats:', error);
        return;
      }

      if (reports && reports.length > 0) {
        // Calculate total workouts
        const totalWorkouts = reports.length;
        
        // Calculate total reps (sum of all reps from all workouts)
        const totalReps = reports.reduce((sum, report) => {
          return sum + (report.total_reps || 0);
        }, 0);

        // Calculate current streak (consecutive days with workouts)
        const currentStreak = calculateWorkoutStreak(reports);

        setUserStats({
          totalWorkouts,
          totalReps,
          currentStreak,
          loading: false
        });
      } else {
        setUserStats({
          totalWorkouts: 0,
          totalReps: 0,
          currentStreak: 0,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setUserStats(prev => ({ ...prev, loading: false }));
    }
  };

  const fetchRecentWorkouts = async () => {
    try {
      const { data: reports, error } = await dbHelpers.getUserWorkoutReports(user.id);
      
      if (error) {
        console.error('Error fetching recent workouts:', error);
        return;
      }

      // Get the 5 most recent workouts
      const recent = reports?.slice(0, 5) || [];
      setRecentWorkouts(recent);
    } catch (error) {
      console.error('Error fetching recent workouts:', error);
    }
  };

  const calculateWorkoutStreak = (reports) => {
    if (!reports || reports.length === 0) return 0;

    // Sort reports by date (most recent first)
    const sortedReports = reports.sort((a, b) => 
      new Date(b.workout_date).getTime() - new Date(a.workout_date).getTime()
    );

    // Get unique workout dates
    const workoutDates = [...new Set(sortedReports.map(report => 
      new Date(report.workout_date).toDateString()
    ))];

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < workoutDates.length; i++) {
      const workoutDate = new Date(workoutDates[i] as string);
      workoutDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#22c55e';
    if (score >= 75) return '#eab308';
    if (score >= 60) return '#f97316';
    return '#ef4444';
  };

  if (userStats.loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
        <p style={{ color: 'var(--neutral-600)' }}>Loading your fitness stats...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '100%', 
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Welcome Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2.5rem',
        padding: '2.5rem 2rem',
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        borderRadius: 'var(--border-radius-xl)',
        color: 'white',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>
        <h2 style={{ 
          margin: '0 0 0.75rem 0', 
          fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
          fontWeight: '700',
          position: 'relative',
          zIndex: 1
        }}>📊 Your Fitness Dashboard</h2>
        <p style={{ 
          margin: 0, 
          fontSize: 'clamp(1rem, 2vw, 1.125rem)', 
          opacity: 0.9,
          fontWeight: '500',
          position: 'relative',
          zIndex: 1
        }}>
          Track your progress and celebrate your achievements!
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        
        {/* Total Workouts Card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--accent-light) 100%)',
          padding: '2rem',
          borderRadius: 'var(--border-radius-xl)',
          color: 'white',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
          transform: 'translateY(0)',
          transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            transform: 'translate(30px, -30px)'
          }}></div>
          <div style={{ fontSize: 'clamp(2.5rem, 6vw, 3rem)', marginBottom: '0.75rem', position: 'relative', zIndex: 1 }}>🔄</div>
          <div style={{ fontSize: 'clamp(2rem, 5vw, 2.25rem)', fontWeight: 'bold', marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>
            {userStats.totalReps}
          </div>
          <div style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', opacity: 0.9, fontWeight: '500', position: 'relative', zIndex: 1 }}>Total Reps</div>
        </div>

        {/* Current Streak Card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--warning-color) 0%, var(--secondary-color) 100%)',
          padding: '2rem',
          borderRadius: 'var(--border-radius-xl)',
          color: 'white',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
          transform: 'translateY(0)',
          transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            transform: 'translate(30px, -30px)'
          }}></div>
          <div style={{ fontSize: 'clamp(2.5rem, 6vw, 3rem)', marginBottom: '0.75rem', position: 'relative', zIndex: 1 }}>🔥</div>
          <div style={{ fontSize: 'clamp(2rem, 5vw, 2.25rem)', fontWeight: 'bold', marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>
            {userStats.currentStreak}
          </div>
          <div style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', opacity: 0.9, fontWeight: '500', position: 'relative', zIndex: 1 }}>Day Streak</div>
        </div>
      </div>

      {/* Recent Workouts Section */}
      {recentWorkouts.length > 0 && (
        <div style={{
          background: 'var(--surface-white)',
          padding: '2rem',
          borderRadius: 'var(--border-radius-xl)',
          marginBottom: '2rem',
          border: '1px solid var(--neutral-200)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{
            margin: '0 0 1.5rem 0',
            color: 'var(--neutral-700)',
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            fontWeight: '600'
          }}>📈 Recent Workouts</h3>
          
          <div style={{
            display: 'grid',
            gap: '1rem'
          }}>
            {recentWorkouts.map((workout, index) => (
              <div key={workout.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: 'var(--neutral-50)',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--neutral-200)'
              }}>
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: 'var(--neutral-700)',
                    marginBottom: '0.25rem',
                    textTransform: 'capitalize'
                  }}>
                    {workout.exercise_name}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: 'var(--neutral-500)'
                  }}>
                    {formatDate(workout.created_at)} • {workout.total_reps || workout.duration} {workout.total_reps ? 'reps' : 'sec'}
                  </div>
                </div>
                <div style={{
                  padding: '0.25rem 0.75rem',
                  background: getScoreColor(workout.overall_score || 0),
                  color: 'white',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {Math.round(workout.overall_score || 0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivational Section */}
      <div style={{
        background: 'var(--surface-white)',
        padding: '2rem',
        borderRadius: 'var(--border-radius-xl)',
        textAlign: 'center',
        border: '1px solid var(--neutral-200)',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 50%, var(--accent-color) 100%)'
        }}></div>
        <h3 style={{ 
          margin: '0 0 1rem 0', 
          color: 'var(--neutral-700)',
          fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
          fontWeight: '600'
        }}>
          {userStats.totalWorkouts === 0 ? '🌟 Welcome to FitForm!' : '💪 Keep Going Strong!'}
        </h3>
        <p style={{ 
          margin: '0 0 1.5rem 0', 
          color: 'var(--neutral-600)', 
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          lineHeight: '1.6',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          {userStats.totalWorkouts === 0 
            ? "Ready to start your fitness journey? Your AI form coach is waiting to help you perfect your technique!"
            : `You've completed ${userStats.totalWorkouts} workouts and ${userStats.totalReps} reps! Ready for your next session?`
          }
        </p>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.875rem 2rem',
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%)',
          color: 'white',
          borderRadius: 'var(--border-radius-md)',
          fontWeight: '600',
          fontSize: '0.95rem',
          boxShadow: 'var(--shadow-sm)',
          border: 'none'
        }}>
          🎯 {userStats.totalWorkouts === 0 ? 'Start your first workout' : 'Continue your fitness journey'}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;