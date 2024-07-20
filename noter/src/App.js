import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import NoteEditor from './NoteEditor';
import Login from './Login';
import Signup from './Signup';
import './App.css';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/notes`, {
        headers: {
          'Authorization': token
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
  };

  const handleCreateNote = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ content: '' }),
      });
      const newNote = await response.json();
      setNotes([...notes, newNote]);
      setSelectedNote(newNote);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token
        }
      });
      setNotes(notes.filter(note => note.id !== id));
      setSelectedNote(null);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setNotes([]);
    setSelectedNote(null);
  };

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup onSignup={() => window.location.href = '/'} />} />
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <button onClick={handleLogout}>Logout</button>
        <Sidebar notes={notes} onNoteSelect={handleNoteSelect} onCreateNote={handleCreateNote} />
        <NoteEditor note={selectedNote} onDelete={handleDeleteNote} />
      </div>
    </Router>
  );
};

export default App;
