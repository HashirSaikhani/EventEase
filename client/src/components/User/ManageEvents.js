import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ManageEvents.css';

const ManageEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedEvent, setEditedEvent] = useState({
    description: '',
    date: '',
    time: '',
    location: '',
  });
  const [message, setMessage] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // For custom delete alert

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch events');

        const data = await res.json();
        setEvents(data.events);
      } catch (err) {
        console.error('Error loading events:', err.message);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = (_id) => {
    setDeleteConfirmation({ _id, open: true });
  };

  const confirmDelete = async (_id) => {
    setDeleteConfirmation({ open: false });
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/events/${_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Delete failed');

      const deleted = events.find((e) => e._id === _id);
      setEvents(events.filter((e) => e._id !== _id));
      setMessage(`Deleted "${deleted.title}" successfully`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting event:', err.message);
    }
  };

  const startEditing = (event) => {
    setEditingId(event._id);
    setEditedEvent({
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
    });
  };

  const handleEditChange = (e) => {
    setEditedEvent({ ...editedEvent, [e.target.name]: e.target.value });
  };

  const saveEdit = async (_id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/events/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedEvent),
      });

      if (!res.ok) throw new Error('Update failed');

      const updatedEvent = await res.json();
      const updatedEvents = events.map((event) =>
        event._id === _id ? updatedEvent : event
      );
      setEvents(updatedEvents);
      setEditingId(null);
      setMessage(`Saved "${updatedEvent.title}" successfully`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error updating event:', err.message);
    }
  };

  const handleUploadParticipants = (eventId) => {
    navigate('/user/participants', { state: { eventId } });
  };

  return (
    <div className="manage-events-container">
      <h2 className="text-center mb-4">Manage Events</h2>

      <div className="text-start mb-4">
        <button
          className="btn btn-outline-light"
          onClick={() => navigate('/user/dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      {message && <p className="success-text">{message}</p>}

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
              <tr key={event._id}>
                <td>{event.title}</td>
                <td>
                  {editingId === event._id ? (
                    <input
                      type="text"
                      name="description"
                      value={editedEvent.description}
                      onChange={handleEditChange}
                      className="form-control form-control-sm"
                    />
                  ) : (
                    event.description
                  )}
                </td>
                <td>
                  {editingId === event._id ? (
                    <input
                      type="text"
                      name="date"
                      value={editedEvent.date}
                      onChange={handleEditChange}
                      className="form-control form-control-sm"
                    />
                  ) : (
                    event.date
                  )}
                </td>
                <td>
                  {editingId === event._id ? (
                    <input
                      type="text"
                      name="time"
                      value={editedEvent.time}
                      onChange={handleEditChange}
                      className="form-control form-control-sm"
                    />
                  ) : (
                    event.time
                  )}
                </td>
                <td>
                  {editingId === event._id ? (
                    <input
                      type="text"
                      name="location"
                      value={editedEvent.location}
                      onChange={handleEditChange}
                      className="form-control form-control-sm"
                    />
                  ) : (
                    event.location
                  )}
                </td>
                <td>
                  {editingId === event._id ? (
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => saveEdit(event._id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-edit me-2"
                      onClick={() => startEditing(event)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-delete"
                    onClick={() => handleDelete(event._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-sm btn-primary ms-2"
                    onClick={() => handleUploadParticipants(event._id)}
                  >
                    Upload Participants
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Delete Confirmation Popup */}
      {deleteConfirmation?.open && (
        <div className="delete-confirmation-popup">
          <div className="popup-content">
            <p>Are you sure you want to delete this event?</p>
            <button
              className="btn btn-danger"
              onClick={() => confirmDelete(deleteConfirmation._id)}
            >
              Yes
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setDeleteConfirmation(null)}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
