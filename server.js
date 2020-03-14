require('dotenv').config()

const   express = require('express'),
        app = express(),
        mongoose = require('mongoose'),
        bodyParser = require('body-parser'),
        path = require('path');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

const publicDirectoryPath = path.join(__dirname, 'public');
// console.log(publicDirectoryPath)
// console.log(Date.now())
app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));    // used by post values evaluation
app.use(bodyParser.json());        
app.set('view engine', 'hbs');                     // used by post values evaluation
// app.get('/', (req, res) => {
//     res.render('index', {

//     });  // render for using the view engine
// })


const deviceDbRouter = require('./routes/devices.js');
app.use('/devices', deviceDbRouter);


let port = 3000;
app.listen(port, () => console.log('Server started, listening on port ' + port));