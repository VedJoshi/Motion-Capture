import React from 'react';

function Dashboard({userStats}) {

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Your workout statistics will go here</p>
      <div>
        <h3>Quick Stats</h3>
        <p>Total Workouts: {userStats.totalWorkouts}</p>
        <p>Total Reps: {userStats.totalReps}</p>
        <p>Current Streak: {userStats.currentStreak} days</p>
      </div>
    </div>
  );
}

export default Dashboard;