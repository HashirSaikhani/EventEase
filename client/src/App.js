// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/AuthPages.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth Pages
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';

// User Pages
import UserDashboard from './components/UserDashboard';
import CreateEvent from './components/CreateEvent';
import ManageEvents from './components/ManageEvents';
import ViewCalendar from './components/ViewCalendar';
import ViewAnalytics from './components/ViewAnalytics';

// Admin Pages
import AdminDashboard from './components/Admin/AdminDashboard';
import ManageUsers from './components/Admin/ManageUsers';
import AdminManageEvents from './components/Admin/ManageEvents';
import AdminViewCalendar from './components/Admin/ViewCalendar';
import ViewFeedback from './components/Admin/ViewFeedback';
import AdminAnalytics from './components/Admin/ViewAnalytics';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* User Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/manage-events" element={<ManageEvents />} />
        <Route path="/calendar" element={<ViewCalendar />} />
        <Route path="/analytics" element={<ViewAnalytics />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/manage-events" element={<AdminManageEvents />} />
        <Route path="/admin/calendar" element={<AdminViewCalendar />} />
        <Route path="/admin/feedback" element={<ViewFeedback />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
      </Routes>
    </Router>
  );
}

export default App;
