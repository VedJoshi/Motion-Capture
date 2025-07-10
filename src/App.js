import React from 'react';
import './App.css';
import Header from './components/Header.tsx';
import Navigation from './components/Navigation.tsx';

function App() {
  return (
    <div className="App">
      <Header />
      <Navigation />
      <main>
        <p>Main app content will go here</p>
      </main>
    </div>
  );
}

export default App;