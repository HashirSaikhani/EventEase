import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/AuthPages.css';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateLogin()) {
      try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          // Save token and user info to localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          alert('Login successful');
          navigate('/user/dashboard');
        } else {
          alert(data.message || 'Invalid credentials');
        }
      } catch (error) {
        console.error('Login Error:', error);
        alert('Something went wrong. Please try again.');
      }
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
