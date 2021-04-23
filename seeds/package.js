rawData = require('./rawPackages.json')
const generateUniqueId = require('generate-unique-id')
const Package = require('../models/Package')
const mongoose = require('mongoose');

const dbPath = 'mongodb://localhost/ExpressBoxDB'
const options = {useNewUrlParser: true, useUnifiedTopology: true}
const mongo = mongoose.connect(dbPath, options);


for(data of rawData){
    let package = new Package({...data})
    package.id = generateUniqueId({length:6, useLetters: false})
    package.save().then((result) => {
        console.log('Registered');
    }).catch((err) => {
        console.log(err);
    });
}


