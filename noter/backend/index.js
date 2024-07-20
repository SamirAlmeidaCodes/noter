const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '185.27.133.16',
    user: 'erpteste',
    password: '*3-eY1gKQiT6p2',
    database: 'erpteste_noter'
})

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

//Fetch all the notes
app.get('/api/notes', (req, res) => {
    connection.query('SELECT id_note as id, text as content FROM tbl_note', (error, results) => {
        if (error) {
            console.error('Failed to fetch notes:'. error);
            res.status(500).send('Failed to fetch notes');
        } else {
            res.json(results);
        }
    });
});

//Update a note
app.put('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    connection.query('UPDATE tbl_note SET text = ? WHERE id_note = ?', [content, id], (error, results) => {
        if (error) {
            console.error('Failed to update note:', error);
            res.status(500).send('Failed to update note');
        } else {
            res.json({ id, content });
        }
    });
});

//Create a new note
app.post('/api/notes', (req, res) => {
    const { content } = req.body;
    connection.query('INSERT INTO tbl_note (text) VALUES (?)', [content], (error, results) => {
        if (error) {
            console.error('Failed to Create Note:', error);
            res.status(500).send('Failed to Create Note');
        } else {
            res.json({ id: results.insertId, content });
        }
    });
});

//Delete a note
app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM tbl_note WHERE id_note = ?', [id], (error, results) => {
        if (error) {
            console.error('Failed to delete note:', error);
            res.status(500).send('Failed to delete note.');
        } else {
            res.json({ id });
        }
    });
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});