import React from 'react';

/**
 * Enhanced dashboard component displaying user workout statistics
 */
function Dashboard({userStats}) {

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
          <div style={{ fontSize: 'clamp(2.5rem, 6vw, 3rem)', marginBottom: '0.75rem', position: 'relative', zIndex: 1 }}>🏋️</div>
          <div style={{ fontSize: 'clamp(2rem, 5vw, 2.25rem)', fontWeight: 'bold', marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>
            {userStats.totalWorkouts}
          </div>
          <div style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', opacity: 0.9, fontWeight: '500', position: 'relative', zIndex: 1 }}>Total Workouts</div>
        </div>

        {/* Total Reps Card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
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

      {/* Professional Motivational Section */}
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
        }}>💪 Keep Going Strong!</h3>
        <p style={{ 
          margin: '0 0 1.5rem 0', 
          color: 'var(--neutral-600)', 
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          lineHeight: '1.6',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Ready to start your next workout? Your AI form coach is waiting to help you perfect your technique!
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
          🎯 Select an exercise to get started
        </div>
      </div>
    </div>
  );
}

export default Dashboard;