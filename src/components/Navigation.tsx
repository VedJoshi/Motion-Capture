import React from 'react';

function Navigation() {

    const handleNavClick = (viewName) => {
        console.log('Clicked:', viewName);
  };
  return (
    <nav>
      <button onClick={() => handleNavClick('dashboard')}>
        Dashboard
      </button>
      <button onClick={() => handleNavClick('exercises')}>
        Exercises
      </button>
      <button onClick={() => handleNavClick('workout')}>
        Workout
      </button>
    </nav>
  );
}

export default Navigation;
