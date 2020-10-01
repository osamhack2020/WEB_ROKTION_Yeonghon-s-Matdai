import React from 'react';
import logo from './logo.svg';
import './App.css';
import Data from './components/Data';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          React
        </p>
        <Data/>
      </header>
    </div>
  );
}

export default App;
