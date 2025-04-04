// src/components/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header mb-5 text-center">
        <h2>Welcome back, <span className="highlight">User</span> 👋</h2>
        <p className="muted-text">Manage your events easily from here</p>
      </header>

      <div className="dashboard-cards">
        <div className="card clickable" onClick={() => navigate('/create-event')}>
          <div className="icon-box">📅</div>
          <h4>Create Event</h4>
          <p>Setup a new event</p>
        </div>

        <div className="card clickable" onClick={() => navigate('/manage-events')}>
          <div className="icon-box">🛠️</div>
          <h4>Manage Events</h4>
          <p>Edit or delete existing events</p>
        </div>

        <div className="card clickable" onClick={() => navigate('/calendar')}>
          <div className="icon-box">📆</div>
          <h4>View Calendar</h4>
          <p>See all scheduled events</p>
        </div>

        <div className="card clickable" onClick={() => navigate('/analytics')}>
          <div className="icon-box">📊</div>
          <h4>View Analytics</h4>
          <p>Analyze event performance</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
