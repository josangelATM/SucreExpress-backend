const express = require('express')
const router = express.Router()
const User = require('../controllers/User')
const passport = require('passport')


router.get('/', User.findUsers)
router.post('/password/', User.recoverPassword)


router.get('/:userID', User.getByID)
router.patch('/:userID', User.editInfo)
router.patch('/:userID/password', User.changePassword)

router.post('/register',User.register)

router.get('/activate/:userID/:code',User.activate)

router.post('/user/edit/:userID',User.editInfo)



router.post('/recover/:userID/:code',User.resetPassword)

router.post('/login',passport.authenticate('local'),User.login)

module.exports = router;