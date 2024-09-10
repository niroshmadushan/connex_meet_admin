// AnalyticsDashboard.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', meetings: 40, events: 24 },
  { name: 'Feb', meetings: 30, events: 13 },
  { name: 'Mar', meetings: 20, events: 98 },
  { name: 'Apr', meetings: 27, events: 39 },
];

const AnalyticsDashboard = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="meetings" stroke="#8884d8" />
        <Line type="monotone" dataKey="events" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AnalyticsDashboard;
