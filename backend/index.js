const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log('Hello World!');
});

app.use('/api/pix', require('./middleware/pixMiddleware'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})