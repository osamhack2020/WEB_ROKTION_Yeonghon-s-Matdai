import React from 'react';
import logo from './logo.svg';
import './App.css';
import API_test from './components/api_test';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          React
        </p>
        <API_test />
      </header>
    </div>
  );
}

export default App;
