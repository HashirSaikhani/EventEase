// src/components/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPages.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="auth-box text-center">
        <h1 className="mb-4 fw-bold">Welcome to <span style={{ color: '#ccc' }}>EventEase</span></h1>
        <p className="mb-4" style={{ color: '#999' }}>
          Your ultimate event assistant with elegant style.
        </p>
        <div className="d-grid gap-3">
          <button className="btn btn-modern btn-lg mb-3" onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="btn btn-modern btn-lg" onClick={() => navigate('/signup')}>
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
