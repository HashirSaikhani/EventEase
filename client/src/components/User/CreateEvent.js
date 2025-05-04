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

  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const formatDate = (inputDate) => {
    if (!inputDate) return '';
    const [year, month, day] = inputDate.split('-');
    return `${month}/${day}/${year}`;
  };

  const formatTime = (inputTime) => {
    if (!inputTime) return '';
    let [hour, minute] = inputTime.split(':');
    const ampm = inputTime.includes('AM') ? 'AM' : 'PM';

    // Convert hour to integer and adjust for AM/PM
    let hourNum = parseInt(hour);
    if (ampm === 'AM' && hourNum === 12) {
      hourNum = 0; // Midnight case
    } else if (ampm === 'PM' && hourNum !== 12) {
      hourNum += 12; // Convert PM to 24-hour format
    }

    // Pad hour with leading zero if necessary
    const formattedHour = hourNum.toString().padStart(2, '0');

    return `${formattedHour}:${minute} ${ampm}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not authenticated.');
      return;
    }

    const payload = {
      title: event.title,
      description: event.description,
      date: formatDate(event.date),
      time: formatTime(event.time),
      location: event.location,
    };

    console.log("Sending event data to server:", payload);

    try {
      const res = await fetch('http://localhost:5000/api/events/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (res.ok) {
        setPopup({ show: true, message: 'Event created successfully!', type: 'success' });
        setEvent({ title: '', description: '', date: '', time: '', location: '' });
      } else {
        setPopup({ show: true, message: data.msg || 'Failed to create event.', type: 'error' });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setPopup({ show: true, message: 'Something went wrong. Please try again.', type: 'error' });
    }
  };

  const closePopup = () => {
    setPopup({ show: false, message: '', type: '' });
    // Navigate to Upload Participants page if event creation was successful
    if (popup.type === 'success') {
      navigate('/user/manage-events');
    }
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
          ></textarea>
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

      {popup.show && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>{popup.type === 'success' ? 'Success' : 'Error'}</h3>
            <p>{popup.message}</p>
            <button className="btn btn-modern mt-3" onClick={closePopup}>
              {popup.type === 'success' ? 'Go to Upload Participants' : 'Retry'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEvent;
