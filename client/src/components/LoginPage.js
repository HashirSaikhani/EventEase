// src/components/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateLogin = () => {
    const newErrors = {};

    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateLogin()) {
      console.log('Logging in:', { email, password });
      // Simulate login then redirect to dashboard
      navigate('/dashboard');
    }
  };

  return (
    <div className="page-container">
      <div className="auth-box text-center">
        <h2 className="mb-4">Login to EventEase</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3 text-start">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
            {errors.email && <div className="text-danger mt-1 small">{errors.email}</div>}
          </div>

          <div className="mb-3 text-start">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            {errors.password && <div className="text-danger mt-1 small">{errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-modern w-100 mt-3">Login</button>
        </form>

        <p className="mt-4">
          Don’t have an account? <Link to="/signup" className="link-light">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
