import React, { useState, useEffect } from 'react';

const NoteEditor = ({ note, onSave, onDelete }) => {
  const [content, setContent] = useState(note ? note.content : '');

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

  return (
    <div className="note-editor">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your note here..."
      />
      {note && (
        <button onClick={() => onDelete(note.id)}>Delete Note</button>
      )}
    </div>
  );
};

export default NoteEditor;