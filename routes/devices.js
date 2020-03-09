const express = require('express');
const router = express.Router();
const Device = require('../models/devices');


// getting all
router.get('/', async (req, res) => {
    try {
        const devices = await Device.find();
        console.log('Received GET request on /');
        let table = '';
        table += `  <form action="http://localhost:3000/devices/" method="post">
                        <td>[ID]</td>
                        <td><input type="text" id="name" name="name"></input></td>
                        <td><input type="text" id="project" name="project"></input></td> 
                        <td><input type="submit" value="ADD" /></form></td>
                    </form>`;
        
        for(let i = 0; i < devices.length; i++) {
            table += `
            <tr>
                <td>${devices[i]._id}</td>
                <td>${devices[i].name}</td>
                <td>${devices[i].project}</td>
                <td><form action="http://localhost:3000/devices/delete/${devices[i]._id}" method="post"><input type="submit" value="DELETE" /></form></td>
            </tr>`;
        }
        let htmlPage = `
            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Device DB</title>
                    <style>
                table, th, td {
                border: 0.1px solid grey;
                },
                body { 
                    background: url(img/cream_dust.png) repeat 0 0;
                }
                </style>
                </head>
                <body>
                <h1>Content of device DB</h1>
                <table style="width:30%">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Project</th>
                    <th>Action</th>
                </tr>
                ${table}
                </table> 
                </body>
            </html>`;
        res.send(htmlPage);
        // res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})

// getting one
router.get('/:id', getDevice, (req, res) => {
    res.send(res.device);
    console.log('Received GET request for ID: ' + req.params.id);

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
        res.json(updatedDevice);
        // res.redirect('/devices');
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