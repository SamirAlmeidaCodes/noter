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

  const handleCreateNote = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      });
      setNotes(notes.filter(note => note.id !== id));
      setSelectedNote(null);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  return (
    <div className="app-container">
      <Sidebar notes={notes} onNoteSelect={handleNoteSelect} onCreateNote={handleCreateNote} />
      <NoteEditor note={selectedNote} onDelete={handleDeleteNote} />
    </div>
  );
};

export default App;
