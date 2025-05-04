// src/components/Admin/ViewFeedback.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ViewFeedback.css';

const ViewFeedback = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchAllFeedbacks = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/feedback', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch feedbacks');

        const data = await res.json();
        setFeedbacks(data);
      } catch (err) {
        console.error('Error loading feedbacks:', err.message);
      }
    };

    fetchAllFeedbacks();
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
            <div className="feedback-card" key={fb._id}>
              <h4 className="feedback-name">
                {fb.user?.name || 'Unknown'}{' '}
                <span className="feedback-email">
                  &lt;{fb.user?.email || 'No email'}&gt;
                </span>
              </h4>
              <p className="feedback-message">{fb.description}</p> {/* Updated this line */}
              <div className="feedback-date">
                🗓 {new Date(fb.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewFeedback;
