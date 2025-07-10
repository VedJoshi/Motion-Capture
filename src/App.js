import React, {useState} from 'react';
import './App.css';
import Header from './components/Common/Header.tsx';
import Navigation from './components/Common/Navigation.tsx';
import ExerciseSelector from './components/Exercises/ExerciseSelector.tsx';
import WorkoutView from './components/Exercises/WorkoutView.tsx';
import Dashboard from './components/Common/Dashboard.tsx';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    if (currentView === 'dashboard') {
      return <Dashboard />;
    } else if (currentView === 'exercises') {
      return <ExerciseSelector />;
    } else if (currentView === 'workout') {
      return <WorkoutView />;
    }
    
    // Default
    return <Dashboard />;
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