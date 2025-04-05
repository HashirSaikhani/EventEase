// src/components/ViewCalendar.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ViewCalendar.css';

const ViewCalendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem('events')) || [];
    const sorted = savedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    setEvents(sorted);
  }, []);

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h2>Event Calendar</h2>
        <p>See all scheduled events in one place</p>
        <button className="btn-back" onClick={() => navigate('/user/dashboard')}>Back to Dashboard</button>
      </div>

      {events.length === 0 ? (
        <p className="no-events">No events scheduled.</p>
      ) : (
        <div className="calendar-list">
          {events.map((event) => (
            <div className="calendar-card" key={event.id}>
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
