import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ManageEvents.css'; // Reuse same styling

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch users');

      const data = await res.json();
      console.log('Users:', data.users); // ✅ Debug log
      setUsers(data.users);
    } catch (err) {
      console.error('Error loading users:', err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (_id) => {
    setDeleteConfirmation({ _id, open: true });
  };

  const confirmDelete = async (_id) => {
    setDeleteConfirmation({ open: false });
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/users/${_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Delete failed');

      const deleted = users.find((u) => u._id === _id);
      setUsers(users.filter((u) => u._id !== _id));
      setMessage(`Deleted "${deleted.name}" successfully`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting user:', err.message);
    }
  };

  const startEditing = (user) => {
    setEditingId(user._id);
    setEditedUser({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleEditChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/users/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editedUser)
      });

      if (!res.ok) throw new Error('Update failed');

      const updatedUser = await res.json();
      const updatedUsers = users.map((u) =>
        u._id === editingId ? updatedUser : u
      );
      setUsers(updatedUsers);
      setEditingId(null);
      setMessage(`Updated "${updatedUser.name}" successfully`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error updating user:', err.message);
    }
  };

  return (
    <div className="manage-events-container">
      <h2 className="text-center mb-4">Manage Users</h2>

      <div className="text-start mb-4">
        <button
          className="btn btn-outline-light"
          onClick={() => navigate('/admin/dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      {message && <p className="success-text">{message}</p>}

      <div className="table-responsive">
        <table className="event-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>New Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  {editingId === user._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editedUser.name}
                      onChange={handleEditChange}
                      className="form-control form-control-sm"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingId === user._id ? (
                    <input
                      type="email"
                      name="email"
                      value={editedUser.email}
                      onChange={handleEditChange}
                      className="form-control form-control-sm"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingId === user._id ? (
                    <input
                      type="password"
                      name="password"
                      value={editedUser.password}
                      onChange={handleEditChange}
                      className="form-control form-control-sm"
                    />
                  ) : (
                    '••••••'
                  )}
                </td>
                <td>
                  {editingId === user._id ? (
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={saveEdit}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-edit me-2"
                      onClick={() => startEditing(user)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-delete"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr key="no-users">
                <td colSpan="4" className="text-center text-muted">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirmation?.open && (
        <div className="delete-confirmation-popup">
          <div className="popup-content">
            <p>Are you sure you want to delete this user?</p>
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

export default ManageUsers;
