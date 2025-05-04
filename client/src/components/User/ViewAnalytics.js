import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar
} from 'recharts';
import '../../styles/ViewAnalytics.css';

const ViewAnalytics = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventsAndParticipants = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch('http://localhost:5000/api/events', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();
        const allEvents = result.events;

        // Fetch participants for each event
        const eventsWithParticipants = await Promise.all(
          allEvents.map(async (event) => {
            try {
              const res = await fetch(`http://localhost:5000/api/participants/${event._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              const participants = await res.json();
              return { ...event, participantCount: participants.length };
            } catch {
              return { ...event, participantCount: 0 };
            }
          })
        );

        setEvents(eventsWithParticipants);

        // Line chart: Events by weekday
        const dayMap = {};
        eventsWithParticipants.forEach(event => {
          const weekday = new Date(event.date).toLocaleDateString('en-US', { weekday: 'long' });
          dayMap[weekday] = (dayMap[weekday] || 0) + 1;
        });

        const formatted = Object.entries(dayMap).map(([day, count]) => ({
          day, events: count
        }));

        setChartData(formatted);
      } catch (err) {
        console.error('Error fetching data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsAndParticipants();
  }, []);

  const totalParticipants = events.reduce((sum, ev) => sum + (ev.participantCount || 0), 0);
  const averageParticipants = events.length > 0 ? (totalParticipants / events.length).toFixed(1) : 0;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Event Analytics</h2>
        <p>Insights based on your scheduled events</p>
        <button className="btn-dark-theme" onClick={() => navigate('/user/dashboard')}>Back to Dashboard</button>
      </div>

      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="stats-row">
            <div className="stat-card">
              <h5>Total Events</h5>
              <p>{events.length}</p>
            </div>
            <div className="stat-card">
              <h5>Total Participants</h5>
              <p>{totalParticipants}</p>
            </div>
            <div className="stat-card">
              <h5>Avg Participants / Event</h5>
              <p>{averageParticipants}</p>
            </div>
          </div>

          {/* Line Chart: Events by Weekday */}
          <h4 className="mt-5 mb-3">📈 Events by Day of Week</h4>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="events"
                  stroke="#8884d8"
                  strokeWidth={3}
                  dot={{ fill: '#8884d8', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart: Participants per Event */}
          <h4 className="mt-5 mb-3">📊 Participants per Event</h4>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={events}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="participantCount" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table: Event Summary */}
          <h4 className="mt-5">📋 Event Summary</h4>
          <div className="event-table mt-3">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Participants</th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? events.map((ev) => (
                  <tr key={ev._id}>
                    <td>{ev.title}</td>
                    <td>{ev.date}</td>
                    <td>{ev.time}</td>
                    <td>{ev.location}</td>
                    <td>{ev.participantCount}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">No events to show</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewAnalytics;
