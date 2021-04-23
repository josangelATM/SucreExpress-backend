const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    type : {
        type: String,
        required: true,
        default: 'customer'
    },
    registDate:{
        type: Date,
        default: Date.now,
        required: true,
    },
    address:{
        type: String,
        default: 'Default Address'
    },
    status:{
        type: String,
        default: 'pending'
    }
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)


