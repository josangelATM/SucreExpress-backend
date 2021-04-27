const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRoutes = require('./routes/User')
const packageRoutes = require('./routes/Package')
const packageRequestRoutes = require('./routes/PackageRequest')
const quotationRoutes = require('./routes/Quotation')
const billRoutes = require('./routes/Bill')
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('./models/User')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload')

if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
  }


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors())
app.use(cookieParser());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles : true,
    tempFileDir : '/tmp/'
  }));


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const dbPath = process.env.DB_URL || 'mongodb://localhost:27017/ExpressBox'
const options = { useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false}
const mongo = mongoose.connect(dbPath, options);

mongo.then(() => {
    console.log('DB Connected');
}, err => {
    console.log(err);
})


app.use('/users', userRoutes)
app.use('/packages', packageRoutes)
app.use('/packageRequests', packageRequestRoutes)
app.use('/quotation', quotationRoutes)
app.use('/bills',billRoutes)

app.use((err, req, res, next) => {
    console.log(err)
    res.status(400).send(err)
})

const port = process.env.PORT || 5000

 
app.listen(port)