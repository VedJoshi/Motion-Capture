import React, {useState} from 'react';

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
