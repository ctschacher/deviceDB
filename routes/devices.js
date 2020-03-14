const express = require('express');
const router = express.Router();
const Device = require('../models/devices');

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
            let counter = devices[i]._id.toString().slice(-2);

            table += `
            <tr>
                <td>${parseInt(counter, 16)}</td>
                <td>${devices[i].name}</td>
                <td>${devices[i].project}</td>
                <td>${year}-${month}-${day}</td>
                <td>
                    <form action="http://localhost:3000/devices/delete/${devices[i]._id}" method="post"><button class="btn" type="submit"><i class="fa fa-trash"></i></button></form>
                    <form action="http://localhost:3000/devices/${devices[i]._id}" method="post"><button class="btn" type="submit"><i class="fa fa-pencil-square"></i></button></form>
                </td>
            </tr>`;
        };
        table += `
        <form action="http://localhost:3000/devices/" method="post">
        <td></td>
        <td><input type="text" id="name" name="name"></input></td>
        <td><input type="text" id="project" name="project"></input></td>
        <td></td>
        <td><input type="submit" value="ADD" /></form></td>
        </form>`;

        res.render('index', {  // render for using the view engine
            tableBody: table              
        });  

        // res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})

// getting one
router.post('/:id', getDevice, async (req, res) => {
    try {
        const devices = await Device.find();   // accesses MongoDB to retrieve all device entries
        console.log('Received GET request on /', req.params.id);
        let table = '';

        // create one table column per found device
        for(let i = 0; i < devices.length; i++) {

            let objectId = devices[i]._id;
            // using the objectId to retrieve date
            let day = objectId.getTimestamp().getDate();
            if(day < parseInt(10)) day = '0' + day; 
            let month = objectId.getTimestamp().getMonth()+1;
            if(month < 10) month = '0' + month;
            let year = objectId.getTimestamp().getFullYear();

            let counter = objectId.toString().slice(-2);

            if(req.params.id === objectId.toString()) {
                table += `
                <tr>
                    <form action="http://localhost:3000/devices/update/${devices[i]._id}" method="post">
                    <td>${parseInt(counter, 16)}</td>
                    <td><input type="text" id="name" name="name" value="${devices[i].name}"></input></td>
                    <td><input type="text" id="project" name="project" value="${devices[i].project}"></input></td>
                    <td>${year}-${month}-${day}</td>
                    <td><input type="submit" value="CHANGE" /></td>
                    </form>
                </tr>`;
            } else {
                table += `
                <tr>
                    <td>${parseInt(counter, 16)}</td>
                    <td>${devices[i].name}</td>
                    <td>${devices[i].project}</td>
                    <td>${year}-${month}-${day}</td>
                    <td></td>
                </tr>`;
            }
            
        };

        res.render('index', {  // render for using the view engine
            tableBody: table              
        });  

        // res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Create entry
router.post('/', async (req, res) => {
  
    const device = new Device({
        name: req.body.name,
        project: req.body.project
    });

    try {
        const newDevice = await device.save();
        // res.status(201).json(newDevice);
        res.redirect('/devices');
    } catch (error) {
        res.status(400).json({ message: error.message });
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


module.exports = router;