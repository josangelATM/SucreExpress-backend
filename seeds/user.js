rawData = require('./raw.json')
const generateUniqueId = require('generate-unique-id')
const User = require('../models/user')
const mongoose = require('mongoose');

const dbPath = 'mongodb://localhost/ExpressBoxDB'
const options = {useNewUrlParser: true, useUnifiedTopology: true}
const mongo = mongoose.connect(dbPath, options);


for(data of rawData){
    let user = new User({...data})
    user.status = 'active'
    User.register(user,'123').then((result) => {
        console.log(user.id);
    }).catch((err) => {
        console.log(err);
    });
}


