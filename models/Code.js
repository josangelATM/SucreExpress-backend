const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const Code = new Schema({
    email: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        expires: '10m',
    },
});

module.exports = mongoose.model('Code', Code)
