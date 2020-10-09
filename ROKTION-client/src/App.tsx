import React from 'react';
import logo from './logo.svg';
import './App.css';
import APItest from './components/api_test';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          React
        </p>
        <APItest />
      </header>
    </div>
  );
}

export default App;
