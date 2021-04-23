const express = require('express')
const router = express.Router()
const Quotation = require('../controllers/Quotation')


router.get('/', Quotation.get)
router.post('/add', Quotation.add)
router.get('/:quotationID', Quotation.getByID)
router.patch('/:quotationID', Quotation.update)
router.delete('/:quotationID', Quotation.delete)

module.exports = router;