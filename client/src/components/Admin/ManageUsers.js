// src/components/Admin/ManageUsers.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ManageUsers.css'; // Create this if needed

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(savedUsers);
  }, []);

  const handleDelete = (id) => {
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));
  };

  const startEditing = (user) => {
    setEditingId(user.id);
    setEditedUser({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleEditChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const saveEdit = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, ...editedUser } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setEditingId(null);
  };

  return (
    <div className="manage-users-container">
      <h2 className="text-center mb-4">Manage Users</h2>

      <div className="text-start mb-4">
        <button className="btn btn-outline-light" onClick={() => navigate('/admin/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="table-responsive">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {editingId === user.id ? (
                    <input type="text" name="name" value={editedUser.name} onChange={handleEditChange} className="form-control form-control-sm" />
                  ) : user.name}
                </td>
                <td>
                  {editingId === user.id ? (
                    <input type="email" name="email" value={editedUser.email} onChange={handleEditChange} className="form-control form-control-sm" />
                  ) : user.email}
                </td>
                <td>
                  {editingId === user.id ? (
                    <select name="role" value={editedUser.role} onChange={handleEditChange} className="form-select form-select-sm">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : user.role}
                </td>
                <td>
                  {editingId === user.id ? (
                    <button className="btn btn-sm btn-success me-2" onClick={() => saveEdit(user.id)}>Save</button>
                  ) : (
                    <button className="btn btn-sm btn-edit me-2" onClick={() => startEditing(user)}>Edit</button>
                  )}
                  <button className="btn btn-sm btn-delete" onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-muted">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
