import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

import Dashboard from './components/dashboard';
import Upload from './components/upload';
import History from './components/history';

function NavButton({ to, children, className = '' }) {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(to)}
      className={`nav-button ${className}`}
    >
      {children}
    </button>
  );
}

function Navigation() {
  return (
    <aside className="App-sidebar">
      <NavButton to="/dashboard" className="title-button ml-0 mr-8 pl-0">
        <div className="title-container ml-0 pl-0 pr-8 mr-8">
          <img 
            src="/logo.png" // Replace with your actual logo path
            alt="Audiomatic Logo"
            className="app-logo"
          />
          <h1 className="App-title">Audiomatic</h1>
        </div>
        
      </NavButton>
      <nav>
        <ul>
          <li>
            <NavButton to="/dashboard">Dashboard</NavButton>
          </li>
          <li>
            <NavButton to="/upload">Upload</NavButton>
          </li>
          <li>
            <NavButton to="/history">History</NavButton>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
