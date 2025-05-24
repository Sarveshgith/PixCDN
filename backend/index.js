const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const { syncDB } = require('./config/database');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log('Hello World!');
});

app.use('/', require('./middleware/pixMiddleware'));

const startServer = async () => {
    try {
        await syncDB();
        app.listen(port);
        console.log(`Server is running on port ${port}`);
    } catch (error) {
        console.error('Error starting server:', error);
    }
}

startServer();