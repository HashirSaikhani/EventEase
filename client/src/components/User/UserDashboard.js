import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      setUserName(user.name);
    } else {
      setUserName('User');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* ✅ Absolute Top-Right Logout */}
      <button className="logout-btn-top" onClick={handleLogout}>Logout</button>

      <header className="dashboard-header text-center mb-4">
        <h2>Welcome back, <span className="highlight">{userName}</span></h2>
        <p className="muted-text">Manage your events easily from here</p>
      </header>

      <div className="dashboard-cards">
        <div className="card clickable" onClick={() => navigate('/user/create-event')}>
          <div className="icon-box">📅</div>
          <h4>Create Event</h4>
          <p>Setup a new event</p>
        </div>

        <div className="card clickable" onClick={() => navigate('/user/manage-events')}>
          <div className="icon-box">🛠️</div>
          <h4>Manage Events</h4>
          <p>Edit or delete existing events</p>
        </div>

        <div className="card clickable" onClick={() => navigate('/user/calendar')}>
          <div className="icon-box">📆</div>
          <h4>View Calendar</h4>
          <p>See all scheduled events</p>
        </div>

        <div className="card clickable" onClick={() => navigate('/user/feedback')}>
          <div className="icon-box">💬</div>
          <h4>Send Feedback</h4>
          <p>Submit your feedback or queries</p>
        </div>

        <div className="card clickable" onClick={() => navigate('/user/analytics')}>
          <div className="icon-box">📊</div>
          <h4>View Analytics</h4>
          <p>Analyze event performance</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
