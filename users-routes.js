const express = require('express');
const router = express.Router();
const userController = require('./controllers/usersController');
const passport = require('passport');
const passportConf = require('./passport');


router.post('/register', userController.create);
router.post('/authenticate', userController.authenticate);
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.get('/secret', passport.authenticate('jwt', { session: false }), userController.secret);

module.exports = router;
