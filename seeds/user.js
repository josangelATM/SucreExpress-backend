rawData = require('./CurrentUsers.json')
const generateUniqueId = require('generate-unique-id')
const User = require('../models/user')
const mongoose = require('mongoose');
require('dotenv').config();
const dbPath =  process.env.DB_URL || 'mongodb://localhost/ExpressBoxDB'
const options = {useNewUrlParser: true, useUnifiedTopology: true}
const mongo = mongoose.connect(dbPath, options);


for(data of rawData){
    let user = new User({...data})
    user.status = 'active'
    user.username = `${user.firstName.charAt(0)}${user.lastName}`
    User.register(user,user.phoneNumber).then((result) => {
        console.log(user.id);
    }).catch((err) => {
        console.log(err);
    });
}


