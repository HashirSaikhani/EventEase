// src/components/CreateEvent.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css';

const CreateEvent = () => {
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
  });

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const newEvent = { ...event, id: Date.now() };
    events.push(newEvent);
    localStorage.setItem('events', JSON.stringify(events));
    setEvent({ title: '', description: '', date: '', time: '', location: '' });
    alert('Event created!');
  };

  return (
    <div className="create-container">
      <form className="create-box" onSubmit={handleSubmit}>
        <h2 className="text-center mb-2">Create Event</h2>
        <p className="text-center text-muted mb-4">Fill out the form to create a new event.</p>

        <div className="mb-3">
          <label className="form-label">Event Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            placeholder="Event Title"
            value={event.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            placeholder="Description"
            rows="3"
            value={event.description}
            onChange={handleChange}
          />
        </div>

        <div className="d-flex gap-3 mb-3">
          <div className="flex-fill">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={event.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex-fill">
            <label className="form-label">Time</label>
            <input
              type="time"
              name="time"
              className="form-control"
              value={event.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            className="form-control"
            placeholder="Location"
            value={event.location}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-dark-theme w-100 mb-3">Create Event</button>

        {/* Below Buttons */}
        <div className="d-flex flex-column gap-2">
          <button type="button" className="btn btn-dark-theme w-100" onClick={() => navigate('/manage-events')}>
            Manage Events
          </button>
          <button type="button" className="btn btn-dark-theme w-100" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
