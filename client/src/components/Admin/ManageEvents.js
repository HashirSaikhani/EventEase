import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ManageEvents.css';

const ManageEventsAdmin = () => {
  const navigate = useNavigate();
  const [usersWithEvents, setUsersWithEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedEvent, setEditedEvent] = useState({
    description: '',
    date: '',
    time: '',
    location: '',
  });
  const [message, setMessage] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const fetchUsersAndEvents = async () => {
    const token = localStorage.getItem('token');

    try {
      const userRes = await fetch('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!userRes.ok) throw new Error('Failed to fetch users');
      const { users } = await userRes.json();

      // For each user, fetch their events
      const usersWithEventsData = await Promise.all(
        users.map(async (user) => {
          const eventRes = await fetch(`http://localhost:5000/api/events/user/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const { events } = await eventRes.json();
          return { ...user, events };
        })
      );

      setUsersWithEvents(usersWithEventsData);
    } catch (err) {
      console.error('Error loading users and events:', err.message);
    }
  };

  useEffect(() => {
    fetchUsersAndEvents();
  }, []);

  const handleDelete = (_id) => {
    setDeleteConfirmation({ _id, open: true });
  };

  const confirmDelete = async (_id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/events/${_id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Delete failed');

      await fetchUsersAndEvents();
      setMessage('Event deleted successfully');
      setTimeout(() => setMessage(''), 3000);
      setDeleteConfirmation(null);
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

      await fetchUsersAndEvents();
      setEditingId(null);
      setMessage('Event updated successfully');
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
      <h2 className="text-center mb-4">Admin: Manage All User Events</h2>

      <div className="text-start mb-4">
        <button
          className="btn btn-outline-light"
          onClick={() => navigate('/admin/dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      {message && <p className="success-text">{message}</p>}

      {usersWithEvents.map((user) => (
        <div key={user._id} className="mb-5">
          <h5 className="mb-3">
            {user.name} ({user.email})
          </h5>
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
                {user.events && user.events.length > 0 ? (
                  user.events.map((event) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No events for this user.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}

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

export default ManageEventsAdmin;
