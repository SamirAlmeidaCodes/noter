import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import NoteEditor from './NoteEditor';
import './App.css';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/notes`);
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

  return (
    <div className="app-container">
      <Sidebar notes={notes} onNoteSelect={handleNoteSelect} />
      <NoteEditor note={selectedNote} />
    </div>
  );
};

export default App;
