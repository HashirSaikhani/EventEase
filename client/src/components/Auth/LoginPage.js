import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const validateLogin = () => {
    const newErrors = {};

    if (!email) newErrors.email = 'Email is required';
    else if (!/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email)) newErrors.email = 'Invalid email format';

    if (!password) newErrors.password = 'Password is required';

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
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setPopup({ show: true, message: 'Login successful', type: 'success' });
        } else {
          setPopup({ show: true, message: data.message || 'Invalid credentials', type: 'error' });
        }
      } catch (error) {
        console.error('Login Error:', error);
        setPopup({ show: true, message: 'Something went wrong. Please try again.', type: 'error' });
      }
    }
  };

  const closePopup = () => {
    setPopup({ ...popup, show: false });

    if (popup.type === 'success') {
      if (email.toLowerCase() === 'admin@gmail.com') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
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

        <div className="d-flex justify-content-between mt-4">
          <p className="mb-0">
            Don’t have an account? <Link to="/signup" className="link-light">Signup</Link>
          </p>
          <p className="mb-0">
            <Link to="/" className="link-light">Back to Home</Link>
          </p>
        </div>

      </div>

      {/* ✅ Popup */}
      {popup.show && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>{popup.type === 'error' ? 'Error' : 'Login Successful'}</h3>
            <p>{popup.message}</p>
            <button className="btn btn-modern mt-3" onClick={closePopup}>
              {popup.type === 'success' ? 'Continue' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
