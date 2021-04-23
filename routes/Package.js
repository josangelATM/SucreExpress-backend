const express = require('express')
const router = express.Router()
const Package = require('../controllers/Package')


router.route('/')
    .get(Package.findPackage)
    .post(Package.add)
    
router.route('/:packageID')
    .get(Package.findById)
    .delete(Package.deletePackage)
    .patch(Package.update)

module.exports = router;