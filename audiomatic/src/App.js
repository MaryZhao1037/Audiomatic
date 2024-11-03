import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

import Dashboard from './components/dashboard';
import Upload from './components/upload';
import History from './components/history';
import ButtonAppBar from './components/sidebar';
import Home from './components/home';

function Navigation() {
  return (
    <ButtonAppBar></ButtonAppBar>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
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
