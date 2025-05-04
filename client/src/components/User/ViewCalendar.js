import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ViewCalendar.css';

const ViewCalendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

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

        // Sort using correct parsing of MM/DD/YYYY
        const sorted = data.events.sort((a, b) => {
          const [am, ad, ay] = a.date.split('/');
          const [bm, bd, by] = b.date.split('/');
          const dateA = new Date(`${ay}-${am}-${ad}`);
          const dateB = new Date(`${by}-${bm}-${bd}`);
          return dateA - dateB;
        });

        setEvents(sorted);
      } catch (err) {
        console.error('Error loading events:', err.message);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h2>Event Calendar</h2>
        <p>See all scheduled events in one place</p>
        <button className="btn-back" onClick={() => navigate('/user/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      {events.length === 0 ? (
        <p className="no-events">No events scheduled.</p>
      ) : (
        <div className="calendar-list">
          {events.map((event) => (
            <div className="calendar-card" key={event._id}>
              <h4 className="event-title">{event.title}</h4>
              <p className="event-desc">{event.description || 'No description provided.'}</p>
              <div className="event-info">
                <span>📅 {event.date}</span>
                <span>⏰ {event.time}</span>
                <span>📍 {event.location}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewCalendar;
