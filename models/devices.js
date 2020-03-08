const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    project: {
        type: String
    },
    status: {

    },
    dateAdded: {
        type: Date,
        required: true,
        default: Date.now

    },
    info: {
        type: String

    }
})


module.exports = mongoose.model('Devices', deviceSchema);  // 'Devices' name of model in DB