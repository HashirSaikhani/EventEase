// src/components/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Dashboard.css'; // Reuse existing styles

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header mb-5 text-center">
        <h2>Welcome, <span className="highlight">Admin</span> 👨‍💼</h2>
        <p className="muted-text">Control everything from your command center</p>
      </header>

      <div className="dashboard-cards">
        <div className="card clickable" onClick={() => navigate('/admin/manage-users')}>
          <div className="icon-box">👥</div>
          <h4>Manage Users</h4>
          <p>View, update, or remove users</p>
        </div>

        <div className="card clickable" onClick={() => navigate('/admin/manage-events')}>
          <div className="icon-box">🗓️</div>
          <h4>Manage Events</h4>
          <p>Edit or delete any event</p>
        </div>

        <div className="card clickable" onClick={() => navigate('/admin/calendar')}>
          <div className="icon-box">📆</div>
          <h4>View Calendar</h4>
          <p>All scheduled events</p>
        </div>

        <div className="card clickable" onClick={() => navigate('/admin/feedback')}>
          <div className="icon-box">💬</div>
          <h4>View Feedback</h4>
          <p>See what users are saying</p>
        </div>

        <div className="card clickable" onClick={() => navigate('/admin/analytics')}>
          <div className="icon-box">📈</div>
          <h4>View Analytics</h4>
          <p>Track platform performance</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
