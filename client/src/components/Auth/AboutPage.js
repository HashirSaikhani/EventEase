// src/components/Admin/AboutPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AboutPage.css';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <div className="about-box">
        <h1>About EventEase</h1>
        <p>
          <strong>EventEase</strong> is a modern event management platform designed for organizers, hosts, and attendees. Whether you're managing a small meetup or a large-scale conference, EventEase provides tools to streamline everything from scheduling and registrations to feedback and analytics.
        </p>

        <h2>Features</h2>
        <ul>
          <li>Intelligent Event Scheduling</li>
          <li>Custom Invitations & Guest Management</li>
          <li>Live Feedback Collection</li>
          <li>Real-time Dashboard & Insights</li>
          <li>AI-powered Event Suggestions</li>
        </ul>

        <h2>Who It's For</h2>
        <p>
          Whether you're an event manager, HR coordinator, or student society leader, EventEase adapts to your needs — giving you full control and visibility over your events.
        </p>

        <h2>Security</h2>
        <p>
          We prioritize your data. All information is encrypted and managed securely in compliance with modern best practices.
        </p>

        {/* Back to Main Page */}
        <div style={{ marginTop: '2rem' }}>
          <button 
            onClick={() => navigate('/')} 
            style={{
              padding: '0.7rem 1.5rem',
              backgroundColor: '#444',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
            onMouseOver={e => e.target.style.backgroundColor = '#666'}
            onMouseOut={e => e.target.style.backgroundColor = '#444'}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
