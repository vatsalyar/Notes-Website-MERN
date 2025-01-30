const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes');

app.use(cors());
app.use(express.json());
app.use('/api/notes', noteRoutes);

mongoose
    .connect('mongodb://127.0.0.1:27017/notes')
    .then(() => console.log('Connected to DB'))
    .catch((err) => console.log('Error connecting to DB: ', err));

app.get('/', (req, res) => {
    res.send('Welcome to the Notes');
});

app.listen(5000, () => {
    console.log('Server is running on port 5000. ');
});
