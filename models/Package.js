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
        required:true,
        unique: true
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
    },
    comments:{
        type: String
    }
},{timestamps : true, strict: false});

Package.virtual('owner',{
    ref: 'User',
    localField: 'customerID',
    foreignField: 'id',
    justOne: true
})

Package.set('toObject', { virtuals: true });
Package.set('toJSON', { virtuals: true });



module.exports = mongoose.model('Package', Package)
