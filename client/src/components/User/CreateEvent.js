import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CreateEvent.css';

const CreateEvent = () => {
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
  });

  const [popup, setPopup] = useState({ show: false, message: '' });

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const formatDate = (inputDate) => {
    const [year, month, day] = inputDate.split("-");
    return `${month}/${day}/${year}`;
  };

  const formatTime = (inputTime) => {
    const [hour, minute] = inputTime.split(":");
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? "PM" : "AM";
    const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not authenticated.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/events/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: event.title,
          description: event.description,
          date: formatDate(event.date),
          time: formatTime(event.time),
          location: event.location,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPopup({ show: true, message: 'Event created successfully!' });
        setEvent({ title: '', description: '', date: '', time: '', location: '' });
      } else {
        alert(data.message || 'Failed to create event.');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const closePopup = () => setPopup({ show: false, message: '' });

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

        <button type="submit" className="btn btn-dark-theme w-100 mb-3">Create Event</button>

        <div className="d-flex flex-column gap-2">
          <button type="button" className="btn btn-dark-theme w-100" onClick={() => navigate('/user/manage-events')}>
            Manage Events
          </button>
          <button type="button" className="btn btn-dark-theme w-100" onClick={() => navigate('/user/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </form>

      {/* ✅ Success Popup */}
      {popup.show && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Success</h3>
            <p>{popup.message}</p>
            <button className="btn btn-modern mt-3" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEvent;
