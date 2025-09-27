const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

let events = []; // Simple in-memory events store
let users = [];  // Simple in-memory users store

// User registration
app.post('/api/register', (req, res) => {
  const { username, email } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  users.push({ username, email });
  res.status(201).json({ username, email });
});

// Get user info
app.get('/api/user/:username', (req, res) => {
  const user = users.find(u => u.username === req.params.username);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Get all events
app.get('/api/events', (req, res) => {
  res.json(events);
});

// Add new event
app.post('/api/events', (req, res) => {
  const { title, date, description, username } = req.body;
  const event = { id: Date.now(), title, date, description, username };
  events.push(event);
  res.status(201).json(event);
});

// Get events by date
app.get('/api/events/:date', (req, res) => {
  const filtered = events.filter(ev => ev.date === req.params.date);
  res.json(filtered);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
