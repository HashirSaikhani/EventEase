// src/components/User/UserFeedback.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/UserFeedback.css';

const UserFeedback = () => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // API call can go here
  };

  return (
    <div className="feedback-container">
      <button className="back-btn" onClick={() => navigate('/user/dashboard')}>
        ← Back to Dashboard
      </button>

      <h2 className="title">Send Feedback</h2>

      {submitted ? (
        <p className="success-text">Thank you! Your feedback has been sent.</p>
      ) : (
        <form onSubmit={handleSubmit} className="feedback-form">
          <textarea
            placeholder="Write your feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit" className="submit-btn">Send Feedback</button>
        </form>
      )}
    </div>
  );
};

export default UserFeedback;
