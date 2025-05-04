import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/AuthPages.css';

const SignupPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  const validateSignup = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';

    if (!form.email) newErrors.email = 'Email is required';
    else if (!/^[\w.%+-]+@gmail\.com$/i.test(form.email))
      newErrors.email = 'Only valid @gmail.com addresses are allowed';

    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(form.password))
      newErrors.password = 'Password must include letters, numbers, and a special character';

    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirm your password';
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateSignup()) {
      try {
        const res = await fetch('http://localhost:5000/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setForm({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
          setPopup({
            show: true,
            message: data.message || 'Account created successfully!',
            type: 'success',
          });
        } else {
          const msg = data.message?.toLowerCase().includes('email')
            ? 'Email already exists'
            : (data.message || 'Signup failed');
          setPopup({ show: true, message: msg, type: 'error' });
        }
      } catch (error) {
        console.error('Signup Error:', error);
        setPopup({ show: true, message: 'An error occurred. Please try again.', type: 'error' });
      }
    }
  };

  const closePopup = () => {
    setPopup({ ...popup, show: false });
    if (popup.type === 'success') navigate('/login');
  };

  return (
    <div className="page-container">
      <div className="auth-box">
        <h2 className="text-center mb-4">Create Account</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
            />
            {errors.name && <small className="text-danger">{errors.name}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              placeholder="Email (must be @gmail.com)"
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters with @#$%"
            />
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-type password"
            />
            {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
          </div>

          <button type="submit" className="btn btn-modern w-100">Signup</button>
        </form>

        <div className="d-flex justify-content-between mt-3">
          <p className="text-center mb-0">
            Already have an account? <Link to="/login" className="link-light">Login</Link>
          </p>
          <p className="text-center mb-0">
            <Link to="/" className="link-light">Back to Home</Link>
          </p>
        </div>
      </div>

      {popup.show && (
        <div className="popup-overlay">
          <div className={`popup-box ${popup.type === 'error' ? 'error' : 'success'}`}>
            <h3>{popup.type === 'error' ? 'Error' : 'Account Created'}</h3>
            <p>{popup.message}</p>
            <button className="btn btn-modern mt-3" onClick={closePopup}>
              {popup.type === 'success' ? 'Go to Login' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
