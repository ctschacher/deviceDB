const express = require('express');
const router = express.Router();
const Device = require('../models/devices');

getNumber = async function() {
    const devices = await Device.find();
    let length = devices.length;
    let ids = [];

    if(!length || length === 0) return 1;
    devices.forEach((device) => ids.push(device.number));
    let sortedIds = ids.sort((a, b) => a - b);

    for(var i = 1; i <= length; i++) {    
        if(sortedIds[i-1] != i){
                return i;
        }
    }
    return length + 1;
}

router.get('/', async (req, res) => {
    try {
        const devices = await Device.find();   // accesses MongoDB to retrieve all device entries
        console.log('Received GET request on /');
        let table = '';

        // create one table column per found device
        for(let i = 0; i < devices.length; i++) {

            // using the objectId to retrieve date
            let day = devices[i]._id.getTimestamp().getDate();
            if(day < parseInt(10)) day = '0' + day; 
            let month = devices[i]._id.getTimestamp().getMonth()+1;
            if(month < 10) month = '0' + month;
            let year = devices[i]._id.getTimestamp().getFullYear();
            let counter = devices[i].number;

            table += `
            <tr>
                <td>${parseInt(counter)}</td>
                <td>${devices[i].name}</td>
                <td>${devices[i].project}</td>
                <td>${year}-${month}-${day}</td>
                <td>
                    <form action="http://localhost:3000/devices/delete/${devices[i]._id}" method="post"><button class="btn" type="submit"><i class="fa fa-trash"></i></button></form>
                    <form action="http://localhost:3000/devices/${devices[i]._id}" method="post"><button class="btn" type="submit"><i class="fa fa-pencil-square"></i></button></form>
                </td>
            </tr>`;
        };
        // table += `
        // `;

        res.render('index', {  // render for using the view engine
            tableBody: table              
        });  

        // res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})

// find by string
router.post('/find', async (req, res) => {
    console.log('Received POST request on /find');
    let devices;
    const regex = new RegExp(`${req.body.sname}`, 'gi');

    try {
        devices = await Device.find({ "name": { $regex: regex } });
        console.log('Found match: ', devices);
        if (!devices) return res.status(404).json({ message: 'Cannot find device in database' });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

    res.render('index', {  // render for using the view engine
       tableBody: getTable(devices)              
   }); 

})


// getting one
router.post('/:id', getDevice, async (req, res) => {
    console.log('Received GET request on / with id:', req.params.id);
    try {
        const devices = await Device.find();   // accesses MongoDB to retrieve all device entries
        res.render('index', {  // render for using the view engine
            tableBody: getTable(devices)              
        });  

        // res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})



// Create entry
router.post('/', async (req, res) => {
    // getNumber();
    let myNumber = await getNumber();
  
    const device = new Device({
        number: myNumber,
        name: req.body.name,
        project: req.body.project
    });

    try {
        const newDevice = await device.save();
        // res.status(201).json(newDevice);
        res.redirect('/devices');
    } catch (error) {
        // res.status(400).send(`<h1>${error.message}</h1>`)
        console.log(error)
        // res.status(400).json({ message: error });
        res.render('index', {  // render for using the view engine
            tableBody: table,
            error: error.message            
        });  
    }
})

// Update entry
router.post('/update/:id', getDevice, async (req, res) => {   // patch instead (only info that gets passed) of put (which updates all infos at once)
    console.log('Received GET request for ID: ' + req.params.id);
    if (req.body.name) res.device.name = req.body.name;
    if (req.body.project) res.device.project = req.body.project;

    // try to update device
    try {
        const updatedDevice = await res.device.save();
        res.redirect('/devices');
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Delete entry
router.post('/delete/:id', getDevice, async (req, res) => {   // patch instead (only info that gets passed) of put (which updates all infos at once)
    console.log('Received POST request to delete ID: ' + req.params.id);
    try {
        await res.device.remove();
        res.redirect('/devices');
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
});

// middle ware handler
async function getDevice(req, res, next) {
    let device;

    try {
        device = await Device.findById(req.params.id);
        if (!device) return res.status(404).json({ message: 'Cannot find device in database' });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

    res.device = device;
    next();
}

getTable = function(devices) {
    let table = '';
    // create one table column per found device
    for(let i = 0; i < devices.length; i++) {

        // using the objectId to retrieve date
        let day = devices[i]._id.getTimestamp().getDate();
        if(day < parseInt(10)) day = '0' + day; 
        let month = devices[i]._id.getTimestamp().getMonth()+1;
        if(month < 10) month = '0' + month;
        let year = devices[i]._id.getTimestamp().getFullYear();
        let counter = devices[i].number;

        table += `
        <tr>
            <td>${parseInt(counter)}</td>
            <td>${devices[i].name}</td>
            <td>${devices[i].project}</td>
            <td>${year}-${month}-${day}</td>
            <td>
                <form action="http://localhost:3000/devices/delete/${devices[i]._id}" method="post"><button class="btn" type="submit"><i class="fa fa-trash"></i></button></form>
                <form action="http://localhost:3000/devices/${devices[i]._id}" method="post"><button class="btn" type="submit"><i class="fa fa-pencil-square"></i></button></form>
            </td>
        </tr>`;
    };
    return table;
}

module.exports = router;