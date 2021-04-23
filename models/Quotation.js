const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Quotation = new Schema({
    id:{
        type:String,
        required:true,
        unique:true
    },
    customerID:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true
    },
    phoneNumber:{
        type: String,
        required: true
    },
    originCountry:{
        type: String,
        default: 'NA'
    },
    destinationCountry:{
        type:String,
        default: 'NA'
    },
    qtyBultos:{
        type:String,
        default: 'NA'
    },
    weight:{
        type:String,
        default: 'NA'
    },
    cubicMeters:{
        type:String,
        default: 'NA'
    },
    cubicFeets:{
        type:String,
        default: 'NA'
    },
    message:{
        type:String,
        default: 'NA'
    },
    links:{
        type:[String],
        default: ['NA']
    },
    status:{
        type:String,
        default: 'Pendiente'
    },
    contactMethod:{
        type:String
    }
},{timestamps : true});

module.exports = mongoose.model('Quotation', Quotation)
