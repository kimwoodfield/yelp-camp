const express = require('express');
const router = express.Router();
const catchAsyncError = require('../utils/catchAsyncError');
const passport = require('passport');
const user = require('../controllers/users');

router.route('/register')
    .get(user.renderRegisterUserForm)
    .post(catchAsyncError(user.createUser))
;

router.route('/login')
    .get(user.renderLoginUserForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.loginUser)
;

router.get('/logout', user.logoutUser);

module.exports = router;