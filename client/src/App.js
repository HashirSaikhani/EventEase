// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/AuthPages.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/Auth/ProtectedRoute'; // ✅ Import ProtectedRoute

// Auth Pages
import LandingPage from './components/Auth/LandingPage';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import AboutPage from './components/Auth/AboutPage';

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
        <Route path="/about" element={<AboutPage />} />

        {/* Protected User Routes */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedFor="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/create-event"
          element={
            <ProtectedRoute allowedFor="user">
              <UserCreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/manage-events"
          element={
            <ProtectedRoute allowedFor="user">
              <UserManageEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/calendar"
          element={
            <ProtectedRoute allowedFor="user">
              <UserViewCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/analytics"
          element={
            <ProtectedRoute allowedFor="user">
              <UserViewAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/participants"
          element={
            <ProtectedRoute allowedFor="user">
              <UserParticipants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/feedback"
          element={
            <ProtectedRoute allowedFor="user">
              <UserFeedback />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedFor="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-users"
          element={
            <ProtectedRoute allowedFor="admin">
              <AdminManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-events"
          element={
            <ProtectedRoute allowedFor="admin">
              <AdminManageEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/calendar"
          element={
            <ProtectedRoute allowedFor="admin">
              <AdminViewCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <ProtectedRoute allowedFor="admin">
              <AdminViewFeedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedFor="admin">
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
