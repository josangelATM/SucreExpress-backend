const express = require('express')
const router = express.Router()
const Bill = require('../controllers/Bill')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.route('/')
    .post(Bill.add)
    .get(Bill.find)

router.route('/lastID')
    .get(Bill.getLastID)

router.route('/:billID')
    .get(Bill.getBillLink)
    


module.exports = router;