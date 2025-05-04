import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="brand">EventEase</div>
        <div className="nav-buttons">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/signup')}>Signup</button>
        </div>
      </header>

      {/* Main Section */}
      <main className="main-content">
        <div className="text-box">
          <h1>Welcome to EventEase</h1>
          <p className="highlight">
            EventEase — where you can manage all events.
          </p>
          <p>
            EventEase is your ultimate companion for planning, organizing, and managing events effortlessly. Whether you're hosting a corporate conference or a birthday bash, our platform ensures your event runs smoothly from start to finish.
          </p>
          <p>
            Experience intuitive scheduling, participant management, smart alerts, and AI-powered recommendations – all under one seamless dashboard.
          </p>
          <div className="main-buttons">
            <button onClick={() => navigate('/login')}>Get Started</button>
            <button className="secondary" onClick={() => navigate('/about')}>Learn More</button>

          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
