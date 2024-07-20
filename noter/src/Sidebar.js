import React from 'react';

const Sidebar = ({ notes, onNoteSelect }) => {
  return (
    <div className="sidebar">
      <button onClick={() => onNoteSelect({ id: null, content: '' })}>+ Add Note</button>
      <ul>
        {notes.map(note => (
          <li key={note.id} onClick={() => onNoteSelect(note)}>
            <div className="note-preview">{note.content.substring(0, 30)}...</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
