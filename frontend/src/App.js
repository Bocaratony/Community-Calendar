import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';

function App() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', description: '' });
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/api/events')
      .then(res => res.json())
      .then(setEvents);
  }, []);

  const addEvent = () => {
    fetch('http://localhost:4000/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newEvent,
        date: date.toISOString().split('T')[0],
        username,
      }),
    })
      .then(res => res.json())
      .then(event => setEvents([...events, event]));
  };

  const registerUser = () => {
    fetch('http://localhost:4000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email }),
    })
      .then(res => res.json())
      .then(response => {
        if (!response.error) setIsRegistered(true);
      });
  };

  return (
    <div className="App">
      <h1>Community Calendar</h1>
      {!isRegistered ? (
        <div className="registration">
          <h2>Register</h2>
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button onClick={registerUser}>Register</button>
        </div>
      ) : (
        <>
          <div>
            <Calendar onChange={setDate} value={date} />
          </div>
          <div className="event-form">
            <h2>Add Event</h2>
            <input
              placeholder="Title"
              value={newEvent.title}
              onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <input
              placeholder="Description"
              value={newEvent.description}
              onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
            />
            <button onClick={addEvent}>Add Event</button>
          </div>
          <div className="event-list">
            <h2>Events on {date.toDateString()}</h2>
            <ul>
              {events
                .filter(ev => ev.date === date.toISOString().split('T')[0])
                .map(ev => (
                  <li key={ev.id}>
                    <strong>{ev.title}</strong> ({ev.username}): {ev.description}
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default App;