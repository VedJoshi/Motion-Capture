import React, {useState} from 'react';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthContainer from './components/Auth/AuthContainer';
import Header from './components/Common/Header.tsx';
import Navigation from './components/Common/Navigation.tsx';
import ExerciseSelector from './components/Exercises/ExerciseSelector.tsx';
import WorkoutView from './components/Exercises/WorkoutView.tsx';
import Dashboard from './components/Common/Dashboard.tsx';
import WorkoutReports from './components/Reports/WorkoutReports';
import UserProfile from './components/Profile/UserProfile';

/**
 * Main application component with authentication and view management
 */
function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const { user, loading } = useAuth();

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    setCurrentView('workout');
  }

  const resetWorkout = () => {
    setSelectedExercise(null);
    setCurrentView('exercises');
  }

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--neutral-50)'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{
            fontSize: '2rem',
            marginBottom: '1rem'
          }}>🔄</div>
          <p style={{
            color: 'var(--neutral-600)',
            fontSize: '1.1rem'
          }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth container if user is not authenticated
  if (!user) {
    return <AuthContainer />;
  }

  const renderCurrentView = () => {
    if (currentView === 'dashboard') {
      return <Dashboard />;
    } else if (currentView === 'exercises') {
      return <ExerciseSelector onExerciseSelect={handleExerciseSelect}/>;
    } else if (currentView === 'workout') {
      return <WorkoutView 
        selectedExercise={selectedExercise}
        onReset={resetWorkout}
        />;
    } else if (currentView === 'reports') {
      return <WorkoutReports />;
    } else if (currentView === 'profile') {
      return <UserProfile />;
    }
    
    return <Dashboard />;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--neutral-50)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header />
      <Navigation 
        currentView={currentView} 
        onChangeView={setCurrentView}
      />
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '0 1rem 2rem 1rem',
        background: 'transparent'
      }}>
        <div style={{
          width: '100%',
          background: 'var(--surface-white)',
          borderRadius: 'var(--border-radius-xl)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--neutral-200)',
          padding: '2rem',
          minHeight: 'calc(100vh - 200px)'
        }}>
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
}

/**
 * Root App component with AuthProvider wrapper
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;