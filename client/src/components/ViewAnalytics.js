import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import './ViewAnalytics.css';

const ViewAnalytics = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('events')) || [];
    setEvents(data);

    const dayMap = {};
    
    data.forEach(event => {
      const day = new Date(event.date).toLocaleDateString('en-US', { weekday: 'long' });
      dayMap[day] = (dayMap[day] || 0) + 1;
    });

    const formatted = Object.entries(dayMap).map(([day, count]) => ({
      day,
      events: count
    }));

    setChartData(formatted);
  }, []);

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Event Analytics</h2>
        <p>Insights based on your scheduled events</p>
        <button className="btn-dark-theme" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <h5>Total Events</h5>
          <p>{events.length}</p>
        </div>
      </div>

      {/* 📈 Line Chart Section */}
      <h4 className="mt-5 mb-3">Event Frequency by Day</h4>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="day" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip
              contentStyle={{ backgroundColor: '#222', border: '1px solid #444', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
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

      <h4 className="mt-5">All Past Events</h4>
      <div className="event-table mt-3">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Time</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? events.map((ev) => (
              <tr key={ev.id}>
                <td>{ev.title}</td>
                <td>{ev.date}</td>
                <td>{ev.time}</td>
                <td>{ev.location}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">No events to show</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAnalytics;
