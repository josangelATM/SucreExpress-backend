const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Bill = new Schema({
    billLink: {
        type: String,
        required: true,
        unique:true
    },
    billFileName:{
        type: String,
        required: true,
        unique:true
    },
    id:{
        type: String,
        required: true,
        unique:true
    },
    customerID:{
        type: String,
        required: true
    }
},{timestamps : true});

module.exports = mongoose.model('Bill', Bill)
