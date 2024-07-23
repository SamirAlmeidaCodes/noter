import React, { useState, useEffect } from 'react';
import './NoteEditor.css';

const NoteEditor = ({ note, onSave, onDelete }) => {
  const [content, setContent] = useState(note ? note.content : '');
  const [font, setFont] = useState('Arial');

  useEffect(() => {
    if (note) {
      setContent(note.content);
    }
  }, [note]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveNote();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [content]);

  const saveNote = async () => {
    if (note) {
      await fetch(`${process.env.REACT_APP_API_URL}/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
    }
  };

  const handleFontChange = (event) => {
    setFont(event.target.value);
  };

  return (
    <div className="note-editor">
      <div className="editor-toolbar">
        <select value={font} onChange={handleFontChange}>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
        </select>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your note here..."
        style={{ fontFamily: font }}
      />
      {note && (
        <button onClick={() => onDelete(note.id)}>Delete Note</button>
      )}
    </div>
  );
};

export default NoteEditor;
