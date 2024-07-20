const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Database connection
const connection = mysql.createConnection({
  host: '185.27.133.16',
  user: 'erpteste',
  password: '*3-eY1gKQiT6p2',
  database: 'erpteste_noter'
});

connection.connect(error => {
  if (error) {
    console.error('Database connection failed:', error);
    return;
  }
  console.log('Connected to the database.');
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

const secretKey = 'your_secret_key'; // Use a secure key in production

// User signup
app.post('/api/signup', async (req, res) => {
  const { user, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  connection.query('INSERT INTO tbl_user (user, password) VALUES (?, ?)', [user, hashedPassword], (error, results) => {
    if (error) {
      console.error('Failed to create user:', error);
      res.status(500).send('Failed to create user');
    } else {
      res.status(201).send('User created');
    }
  });
});

// User login
app.post('/api/login', (req, res) => {
  const { user, password } = req.body;
  connection.query('SELECT * FROM tbl_user WHERE user = ?', [user], async (error, results) => {
    if (error || results.length === 0) {
      res.status(401).send('Invalid credentials');
      return;
    }
    const userRecord = results[0];
    const isPasswordValid = await bcrypt.compare(password, userRecord.password);
    if (!isPasswordValid) {
      res.status(401).send('Invalid credentials');
      return;
    }
    const token = jwt.sign({ id: userRecord.id_user }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    res.status(401).send('Access denied');
    return;
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.status(401).send('Invalid token');
      return;
    }
    req.userId = decoded.id;
    next();
  });
};

// Fetch all notes for a user
app.get('/api/notes', authenticate, (req, res) => {
  connection.query('SELECT id_note as id, text as content FROM tbl_note WHERE user_id = ?', [req.userId], (error, results) => {
    if (error) {
      console.error('Failed to fetch notes:', error);
      res.status(500).send('Failed to fetch notes');
    } else {
      res.json(results);
    }
  });
});

// Update a note
app.put('/api/notes/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  connection.query('UPDATE tbl_note SET text = ? WHERE id_note = ? AND user_id = ?', [content, id, req.userId], (error, results) => {
    if (error) {
      console.error('Failed to update note:', error);
      res.status(500).send('Failed to update note');
    } else {
      res.json({ id, content });
    }
  });
});

// Create a new note
app.post('/api/notes', authenticate, (req, res) => {
  const { content } = req.body;
  connection.query('INSERT INTO tbl_note (text, user_id) VALUES (?, ?)', [content, req.userId], (error, results) => {
    if (error) {
      console.error('Failed to create note:', error);
      res.status(500).send('Failed to create note');
    } else {
      res.json({ id: results.insertId, content });
    }
  });
});

// Delete a note
app.delete('/api/notes/:id', authenticate, (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM tbl_note WHERE id_note = ? AND user_id = ?', [id, req.userId], (error, results) => {
    if (error) {
      console.error('Failed to delete note:', error);
      res.status(500).send('Failed to delete note');
    } else {
      res.json({ id });
    }
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
