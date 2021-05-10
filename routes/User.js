const express = require('express')
const router = express.Router()
const User = require('../controllers/User')
const passport = require('passport')


router.get('/', User.findUsers)
router.post('/password/', User.recoverPassword)

router.route('/:userID')
    .get(User.getByID)
    .delete(User.deleteAccount)
    .patch(User.editInfo)


router.get('/:userID/reactive',User.reactiveAccount)

router.patch('/:userID/password', User.changePassword)

router.post('/register',User.register)

router.get('/activate/:userID/:code',User.activate)

router.post('/user/edit/:userID',User.editInfo)



router.post('/password/:userID/:code',User.resetPassword)
router.post('/password/:userID/',User.adminChangePassword)

router.post('/login',passport.authenticate('local'),User.login)

module.exports = router;