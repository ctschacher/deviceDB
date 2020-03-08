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
router.get('/:id', (req, res) => {
    console.log('Received GET request for ID: ' + req.params.id);
    res.send('This will show ID ' + req.params.id + ' in the future\n');
})

// Create entry
router.post('/', (req, res) => {
    console.log('Received GET request for ID: ' + req.params.id);
})

// Update entry
router.patch('/:id', (req, res) => {   // patch instead (only info that gets passed) of put (which updates all infos at once)
    console.log('Received GET request for ID: ' + req.params.id);
})

// Delete entry
router.delete('/:id', (req, res) => {   // patch instead (only info that gets passed) of put (which updates all infos at once)
    console.log('Received GET request for ID: ' + req.params.id);
})



module.exports = router;