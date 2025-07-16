import React, {useState} from 'react';

/**
 * Navigation bar component with view switching functionality.
 * Renders buttons for Dashboard, Exercises and Workout views.
 */
function Navigation({currentView, onChangeView}) {

    const handleNavClick = (viewName) => {
        onChangeView(viewName);
  };
  
  return (
    <nav>
      <button 
        onClick={() => handleNavClick('dashboard')}
        className={currentView === 'dashboard' ? 'active' : ''}
      >
        Dashboard
      </button>
      <button 
        onClick={() => handleNavClick('exercises')}
        className={currentView === 'exercises' ? 'active' : ''}
      >
        Exercises
      </button>
      <button 
        onClick={() => handleNavClick('workout')}
        className={currentView === 'workout' ? 'active' : ''}
      >
        Workout
      </button>
    </nav>
  );
}

export default Navigation;
