const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const secretKey = '12345'; // Use a secure key in production

// Database connection pool
const pool = mysql.createPool({
  host: '185.27.133.16',
  user: 'erpteste',
  password: '*3-eY1gKQiT6p2',
  database: 'erpteste_noter',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// User signup
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  pool.query('INSERT INTO tbl_user (user, password) VALUES (?, ?)', [username, hashedPassword], (error, results) => {
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
  const { username, password } = req.body;
  pool.query('SELECT * FROM tbl_user WHERE user = ?', [username], async (error, results) => {
    if (error || results.length === 0) {
      res.status(401).send('Invalid user');
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
  pool.query('SELECT id_note as id, text as content FROM tbl_note WHERE user_id = ?', [req.userId], (error, results) => {
    if (error) {
      console.error('Failed to fetch notes:', error);
      res.status(500).send('Failed to fetch notes');
    } else {
      res.json(results);
    }
  });
});

// Update a note
app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  pool.query('UPDATE tbl_note SET text = ? WHERE id_note = ?', [content, id], (error, results) => {
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
  pool.query('INSERT INTO tbl_note (text, user_id) VALUES (?, ?)', [content, req.userId], (error, results) => {
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
  pool.query('DELETE FROM tbl_note WHERE id_note = ? AND user_id = ?', [id, req.userId], (error, results) => {
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
