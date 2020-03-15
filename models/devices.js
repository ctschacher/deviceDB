const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    project: {
        type: String
    },
    status: {

    },
    number: {
        type: Number,
        required: true
    },
    info: {
        type: String

    }
})


module.exports = mongoose.model('Devices', deviceSchema);  // 'Devices' name of model in DB