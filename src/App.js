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

  const userStats = {
    totalWorkouts: 23,
    totalReps: 223,
    currentStreak: 43
  }

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
      return <Dashboard userStats={userStats}/>;
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
    
    return <Dashboard userStats={userStats}/>;
  };

  return (
    <div className="App">
      <Header />
      <Navigation 
        currentView={currentView} 
        onChangeView={setCurrentView}
      />
      <main style={{
        minHeight: 'calc(100vh - 120px)', // Adjust based on header/nav height
        background: 'var(--neutral-50)'
      }}>
        {renderCurrentView()}
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