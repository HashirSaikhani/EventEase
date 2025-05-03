// src/components/User/UserParticipants.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import '../../styles/UserParticipants.css';

const UserParticipants = () => {
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setError('');
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const required = ['Name', 'Email', 'Contact', 'Address'];
        const headersValid = required.every((field) =>
          Object.keys(results.data[0] || {}).includes(field)
        );
        if (!headersValid) {
          setError("CSV must include: Name, Email, Contact, Address");
          setParticipants([]);
        } else {
          setParticipants(results.data);
        }
      },
      error: () => setError("Failed to parse CSV")
    });
  };

  const handleSendEmails = () => {
    // In real scenario: send email to all participants
    alert("Emails sent to all participants!");
  };

  return (
    <div className="participants-container">
      <button className="back-btn" onClick={() => navigate('/user/dashboard')}>
        ← Back to Dashboard
      </button>

      <h2 className="title">Participants</h2>

      <input type="file" accept=".csv" onChange={handleFileUpload} className="csv-upload" />
      {error && <p className="error-text">{error}</p>}

      {participants.length > 0 && (
        <>
          <table className="participants-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, index) => (
                <tr key={index}>
                  <td>{p.Name}</td>
                  <td>{p.Email}</td>
                  <td>{p.Contact}</td>
                  <td>{p.Address}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="email-btn" onClick={handleSendEmails}>
            📧 Send Email to All
          </button>
        </>
      )}
    </div>
  );
};

export default UserParticipants;
