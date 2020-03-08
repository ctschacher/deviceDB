const express = require('express');
const router = express.Router();
const Device = require('../models/devices');

// getting all
router.get('/', async (req, res) => {
    try {
        const devices = await Device.find();
        res.json(devices);
        
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})

// getting one
router.get('/:id', getDevice, (req, res) => {
    res.send(res.device);
    console.log('Received GET request for ID: ' + req.params.id);
    // res.send('This will show ID ' + req.params.id + ' in the future\n');
})

// Create entry
router.post('/', async (req, res) => {
    const device = new Device({
        name: req.body.name,
        project: req.body.project
    });

    try {
        const newDevice = await device.save();
        res.status(201).json(newDevice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// Update entry
router.patch('/:id', getDevice, async (req, res) => {   // patch instead (only info that gets passed) of put (which updates all infos at once)
    console.log('Received GET request for ID: ' + req.params.id);
    if (req.body.name != null) {
        res.device.name = req.body.name;
    }
    if (req.body.project != null) {
        res.device.project = req.body.project;
    }

    // try to update device
    try {
        const updatedDevice = await res.device.save();
        res.json(updatedDevice);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Delete entry
router.delete('/:id', getDevice, async (req, res) => {   // patch instead (only info that gets passed) of put (which updates all infos at once)
    console.log('Received GET request for ID: ' + req.params.id);
    try {
        await res.device.remove();
        res.json({ message: 'Deleted device ' + res.device.name});
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
});

async function getDevice(req, res, next) {
    let device;

    try {
        device = await Device.findById(req.params.id);
        if (device == null) {
            return res.status(404).json({ message: 'Cannot find device in database'})
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

    res.device = device;
    next();
}



module.exports = router;