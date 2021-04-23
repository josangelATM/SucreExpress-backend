const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const PackageRequest = new Schema({
    customerID:{
        type: String,
        required: true
    },
    tracking:{
        type: String,
        required:true,
        unique:true
    },
    id:{
        type: String,
        required:true,
        unique:true
    }
},{timestamps : true});

module.exports = mongoose.model('PackageRequest', PackageRequest)
