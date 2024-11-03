import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import './index.css';

import Dashboard from './components/dashboard';
import Upload from './components/upload';

function NavButton({ to, children }) {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(to)}
      className="nav-button" // Add this class
    >
      {children}
    </button>
  );
}

// Create a separate Navigation component since useNavigate must be used inside Router
function Navigation() {
  return (
    <aside className="App-sidebar">
      <h1 className="App-title">Audiomatic</h1>
      <nav>
        <ul>
          <li>
            <NavButton to="/dashboard">Dashboard</NavButton>
          </li>
          <li>
            <NavButton to="/upload">Upload</NavButton>
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
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;