// src/components/ManageEvents.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageEvents.css';

const ManageEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedEvent, setEditedEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('events')) || [];
    setEvents(saved);
  }, []);

  const handleDelete = (id) => {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    localStorage.setItem('events', JSON.stringify(updated));
  };

  const startEditing = (event) => {
    setEditingId(event.id);
    setEditedEvent({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
    });
  };

  const handleEditChange = (e) => {
    setEditedEvent({ ...editedEvent, [e.target.name]: e.target.value });
  };

  const saveEdit = (id) => {
    const updatedEvents = events.map((event) =>
      event.id === id ? { ...event, ...editedEvent } : event
    );
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setEditingId(null);
  };

  return (
    <div className="manage-events-container">
      <h2 className="text-center mb-4">Manage Events</h2>

      <div className="text-start mb-4">
        <button className="btn btn-outline-light" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="table-responsive">
        <table className="event-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Time</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>
                  {editingId === event.id ? (
                    <input type="text" name="title" value={editedEvent.title} onChange={handleEditChange} className="form-control form-control-sm" />
                  ) : event.title}
                </td>
                <td>
                  {editingId === event.id ? (
                    <input type="text" name="description" value={editedEvent.description} onChange={handleEditChange} className="form-control form-control-sm" />
                  ) : event.description}
                </td>
                <td>
                  {editingId === event.id ? (
                    <input type="date" name="date" value={editedEvent.date} onChange={handleEditChange} className="form-control form-control-sm" />
                  ) : event.date}
                </td>
                <td>
                  {editingId === event.id ? (
                    <input type="time" name="time" value={editedEvent.time} onChange={handleEditChange} className="form-control form-control-sm" />
                  ) : event.time}
                </td>
                <td>
                  {editingId === event.id ? (
                    <input type="text" name="location" value={editedEvent.location} onChange={handleEditChange} className="form-control form-control-sm" />
                  ) : event.location}
                </td>
                <td>
                  {editingId === event.id ? (
                    <button className="btn btn-sm btn-success me-2" onClick={() => saveEdit(event.id)}>Save</button>
                  ) : (
                    <button className="btn btn-sm btn-edit me-2" onClick={() => startEditing(event)}>Edit</button>
                  )}
                  <button className="btn btn-sm btn-delete" onClick={() => handleDelete(event.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">No events found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageEvents;
