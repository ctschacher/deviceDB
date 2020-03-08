require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

app.use(express.json());

const deviceDbRouter = require('./routes/devices.js');
app.use('/devices', deviceDbRouter);


let port = 3000;
app.listen(port, () => console.log('Server started, listening on port ' + port));