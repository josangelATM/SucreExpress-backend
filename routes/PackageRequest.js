const express = require('express')
const router = express.Router()
const PackageRequest = require('../controllers/PackageRequest')



router.get('/',PackageRequest.find)

router.delete('/:requestID',PackageRequest.delete)

module.exports = router;