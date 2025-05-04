import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Papa from 'papaparse';
import '../../styles/UserParticipants.css';

const UserParticipants = () => {
  const [participants, setParticipants] = useState([]);
  const [parsedCSV, setParsedCSV] = useState([]);
  const [error, setError] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false); // For delete confirmation
  const [deleteParticipantId, setDeleteParticipantId] = useState(null); // Store participant ID for deletion
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState(''); // Success message after delete
  const [emailSending, setEmailSending] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const eventId = location.state?.eventId;

  useEffect(() => {
    if (eventId) fetchParticipants();
    else setError('Missing event ID. Please create or select an event first.');
  }, [eventId]);

  // Hide success/error message after 2 seconds
  useEffect(() => {
    if (error || uploadStatus || deleteSuccessMsg) {
      const timer = setTimeout(() => {
        setError('');
        setUploadStatus('');
        setDeleteSuccessMsg('');
      }, 2000);
      return () => clearTimeout(timer); // Clear timeout if component unmounts
    }
  }, [error, uploadStatus, deleteSuccessMsg]);

  const fetchParticipants = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/participants/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setParticipants(data);
      } else {
        setError(data.msg || 'Failed to fetch participants');
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching participants');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setError('');
    setUploadStatus('');
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const required = ['name', 'email'];
        const headersValid = required.every((field) =>
          Object.keys(results.data[0] || {}).includes(field)
        );
        if (!headersValid) {
          setError("CSV must include: name, email");
          setParsedCSV([]);
        } else {
          setParsedCSV(results.data);
        }
      },
      error: () => setError("Failed to parse CSV")
    });
  };

  const handleUploadToServer = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput?.files[0];

    if (!file || !eventId) {
      setError('Missing CSV file or event ID.');
      return;
    }

    formData.append('file', file);

    try {
      const res = await fetch(`http://localhost:5000/api/participants/upload/${eventId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setUploadStatus(`${data.msg}. Skipped: ${data.skipped}`);
        setParsedCSV([]); // Clear parsed CSV
        fetchParticipants(); // Refresh the table
      } else {
        setError(data.msg || 'Failed to upload participants');
      }
    } catch (err) {
      console.error(err);
      setError('Upload failed');
    }
  };

  // Handle delete confirmation
  const confirmDelete = (participantId) => {
    setDeleteConfirmation(true);
    setDeleteParticipantId(participantId); // Store the participant ID to delete
  };

  const handleDelete = async () => {
    const participantId = deleteParticipantId;
    if (!participantId) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:5000/api/participants/delete/${eventId}/${participantId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setParticipants(participants.filter(p => p._id !== participantId));
        setDeleteSuccessMsg('Participant deleted successfully!');
        setDeleteConfirmation(false); // Close the confirmation popup
      } else {
        setError(data.msg || 'Failed to delete participant');
      }
    } catch (err) {
      console.error(err);
      setError('Error deleting participant');
    }
  };

  const handleSendEmails = async () => {
    setEmailSending(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:5000/api/email/send/${eventId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUploadStatus(data.msg);
      } else {
        setError(data.msg || 'Failed to send emails');
      }
    } catch (err) {
      console.error(err);
      setError('Error sending emails');
    } finally {
      setEmailSending(false);
    }
  };


  return (
    <div className="participants-container">
      <button className="back-btn" onClick={() => navigate('/user/manage-events')}>
        ← Back to Manage Events
      </button>

      <h2 className="title">Participants</h2>

      <input type="file" accept=".csv" onChange={handleFileUpload} className="csv-upload" />
      {error && <p className="error-text">{error}</p>}
      {uploadStatus && <p className="success-text">{uploadStatus}</p>}
      {deleteSuccessMsg && <p className="success-text">{deleteSuccessMsg}</p>} {/* Show delete success msg */}

      {parsedCSV.length > 0 && (
        <button className="upload-btn" onClick={handleUploadToServer}>
          ⬆️ Upload Participants
        </button>
      )}

      {participants.length > 0 ? (
        <>
          <table className="participants-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>
                    <button className="delete-btn" onClick={() => confirmDelete(p._id)}>
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="email-btn" onClick={handleSendEmails} disabled={emailSending}>
            {emailSending ? 'Sending Emails...' : '📧 Send Email to All'}
          </button>

        </>
      ) : (
        <p>No participants uploaded yet.</p>
      )}

      {/* Delete confirmation popup */}
      {deleteConfirmation && (
        <div className="delete-confirmation-popup">
          <div className="popup-content">
            <p>Are you sure you want to delete this participant?</p>
            <button onClick={handleDelete}>Yes</button>
            <button onClick={() => setDeleteConfirmation(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserParticipants;
