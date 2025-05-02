// src/components/Admin/ViewFeedback.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ViewFeedback.css';

const ViewFeedback = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const storedFeedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    const sorted = storedFeedbacks.sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
    setFeedbacks(sorted);
  }, []);

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <h2>User Feedback</h2>
        <p>See what users have shared with you</p>
        <button className="btn-back" onClick={() => navigate('/admin/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      {feedbacks.length === 0 ? (
        <p className="no-feedback">No feedback available.</p>
      ) : (
        <div className="feedback-list">
          {feedbacks.map((fb) => (
            <div className="feedback-card" key={fb.id}>
              <h4 className="feedback-name">{fb.name} <span className="feedback-email">&lt;{fb.email}&gt;</span></h4>
              <p className="feedback-message">{fb.message}</p>
              <div className="feedback-date">🗓 {fb.date}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewFeedback;
