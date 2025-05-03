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
  const navigate = useNavigate();

  const validateSignup = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format';

    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirm your password';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

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
          alert(data.message || 'Signup successful');
          setForm({ name: '', email: '', password: '', confirmPassword: '' });
          navigate('/login');
        } else {
          alert(data.message || 'Signup failed');
        }
      } catch (error) {
        console.error('Signup Error:', error);
        alert('An error occurred. Please try again.');
      }
    }
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
              placeholder="Email"
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
              placeholder="Password"
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
              placeholder="Confirm password"
            />
            {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
          </div>
          <button type="submit" className="btn btn-modern w-100">Signup</button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login" className="link-light">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
