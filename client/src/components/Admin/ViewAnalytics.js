import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar
} from 'recharts';
import '../../styles/ViewAnalytics.css';

const ViewAnalytics = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersAndFeedbacks = async () => {
      const token = localStorage.getItem('token');

      try {
        // Fetch users
        const resUsers = await fetch('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataUsers = await resUsers.json();
        setUsers(dataUsers.users);

        // Fetch feedbacks
        const resFeedbacks = await fetch('http://localhost:5000/api/feedback', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataFeedbacks = await resFeedbacks.json();
        setFeedbacks(dataFeedbacks);

        // Line chart: Feedbacks by day of the week
        const dayMap = {};
        dataFeedbacks.forEach(feedback => {
          const day = new Date(feedback.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
          dayMap[day] = (dayMap[day] || 0) + 1;
        });

        const formatted = Object.entries(dayMap).map(([day, count]) => ({
          day,
          feedbacks: count
        }));
        setFeedbackData(formatted);
      } catch (err) {
        console.error('Error fetching data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndFeedbacks();
  }, []);

  const totalFeedbacks = feedbacks.length;
  const totalUsers = users.length;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Admin Analytics</h2>
        <p>Overview of users and feedbacks</p>
        <button className="btn-dark-theme" onClick={() => navigate('/admin/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="stats-row">
            <div className="stat-card">
              <h5>Total Users</h5>
              <p>{totalUsers}</p>
            </div>
            <div className="stat-card">
              <h5>Total Feedbacks</h5>
              <p>{totalFeedbacks}</p>
            </div>
          </div>

          {/* Line Chart: Feedbacks by Day of Week */}
          <h4 className="mt-5 mb-3">📈 Feedbacks by Day of Week</h4>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={feedbackData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="feedbacks"
                  stroke="#8884d8"
                  strokeWidth={3}
                  dot={{ fill: '#8884d8', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart: Feedbacks per User */}
          <h4 className="mt-5 mb-3">📊 Feedbacks per User</h4>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={users}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="feedbackCount" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table: User Feedback Summary */}
          <h4 className="mt-5">📋 User Feedback Summary</h4>
          <div className="user-feedback-table mt-3">
            <table>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Feedback Count</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? users.map((user) => {
                  const userFeedbacks = feedbacks.filter(feedback => feedback.user._id === user._id);
                  return (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{userFeedbacks.length}</td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">No users to show</td>
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
