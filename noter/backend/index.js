const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let notes = [
  { id: 1, content: 'First note' },
  { id: 2, content: 'Second note' }
];

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const note = notes.find(note => note.id === parseInt(id));
  if (note) {
    note.content = content;
    res.json(note);
  } else {
    res.status(404).send('Note not found');
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
