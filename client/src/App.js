// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/AuthPages.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth Pages
import LandingPage from './components/User/LandingPage';
import LoginPage from './components/User/LoginPage';
import SignupPage from './components/User/SignupPage';

// User Pages
import UserDashboard from './components/User/UserDashboard';
import UserCreateEvent from './components/User/CreateEvent';
import UserManageEvents from './components/User/ManageEvents';
import UserViewCalendar from './components/User/ViewCalendar';
import UserViewAnalytics from './components/User/ViewAnalytics';
import UserParticipants from './components/User/UserParticipants';
import UserFeedback from './components/User/UserFeedback';

// Admin Pages
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminManageUsers from './components/Admin/ManageUsers';
import AdminManageEvents from './components/Admin/ManageEvents';
import AdminViewCalendar from './components/Admin/ViewCalendar';
import AdminViewFeedback from './components/Admin/ViewFeedback';
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
        <Route path="/user/create-event" element={<UserCreateEvent />} />
        <Route path="/user/manage-events" element={<UserManageEvents />} />
        <Route path="/user/calendar" element={<UserViewCalendar />} />
        <Route path="/user/analytics" element={<UserViewAnalytics />} />
        <Route path="/user/participants" element={<UserParticipants />} />
        <Route path="/user/feedback" element={<UserFeedback />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-users" element={<AdminManageUsers />} />
        <Route path="/admin/manage-events" element={<AdminManageEvents />} />
        <Route path="/admin/calendar" element={<AdminViewCalendar />} />
        <Route path="/admin/feedback" element={<AdminViewFeedback />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
      </Routes>
    </Router>
  );
}

export default App;
