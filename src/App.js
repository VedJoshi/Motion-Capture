import React, {useState} from 'react';
import './App.css';
import Header from './components/Common/Header.tsx';
import Navigation from './components/Common/Navigation.tsx';
import ExerciseSelector from './components/Exercises/ExerciseSelector.tsx';
import WorkoutView from './components/Exercises/WorkoutView.tsx';
import Dashboard from './components/Common/Dashboard.tsx';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedExercise, setSelectedExercise] = useState(null);

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
    }
    
    // Default
    return <Dashboard userStats={userStats}/>;
  };

  return (
    <div className="App">
      <Header />
      <Navigation 
        currentView={currentView} 
        onChangeView={setCurrentView}
      />
      <main>
        {renderCurrentView()} {/* Show different component based on state */}
      </main>
    </div>
  );
}

export default App;