const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Package = new Schema({
    source: {
        type: String,
        required: true,
    },
    id:{
        type: String,
        required:true,
        unique: true
    },
    customerID:{
        type: String,
        required: true
    },
    tracking:{
        type: String,
        required:true
    },
    weight:{
        type: String,
        default:'TBD'
    },
    status:{
        type: String,
        required: true,
        default: 'En tránsito'
    },
    arrivalDate:{
        type: Date,
        default: null
    }
},{timestamps : true});

module.exports = mongoose.model('Package', Package)
