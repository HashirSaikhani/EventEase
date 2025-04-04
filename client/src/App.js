// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/AuthPages.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import CreateEvent from './components/CreateEvent';
import ManageEvents from './components/ManageEvents'; // ✅ Add this line
import ViewCalendar from './components/ViewCalendar';
import ViewAnalytics from './components/ViewAnalytics';





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/manage-events" element={<ManageEvents />} /> 
        <Route path="/calendar" element={<ViewCalendar />} />
        <Route path="/analytics" element={<ViewAnalytics />} />
      </Routes>
    </Router>
  );
}

export default App;
