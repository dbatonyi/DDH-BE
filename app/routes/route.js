const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const jwt = require("jsonwebtoken");

var authController = require('../controllers/authController.js');
var pageController = require('../controllers/pageController.js');
var apiController = require('../controllers/apiController.js');
 
module.exports = function(app, passport) {

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();  

        res.redirect('/login');
    }

    function singupHandler(req, res, next) {
        passport.authenticate('local-signup', {
            successRedirect: '/login',
        
            failureRedirect: '/signup',
            
            failureMessage: true
        })(req, res, next);  
    }

    function signinHandler(req, res, next) {
        passport.authenticate('local-signin', {
            successRedirect: '/dashboard',
        
            failureRedirect: '/login',
            
            failureMessage: true
        })(req, res, next);
    }

    //Auth
 
    app.get('/signup', authController.signup);
 
    app.get('/login', authController.signin);

    app.get('/reset-pass', authController.resetPass);

    app.get('/logout', authController.logout);

    app.get('/reset/:id', authController.newPassword);
 
    app.post('/signup', singupHandler);

    app.post('/login', signinHandler);

    app.post('/reset-pass', authController.resetPassHandler);

    app.post('/reset/:id', authController.newPasswordHandler);

    //Page

    app.get('/dashboard', isLoggedIn, pageController.dashboard);

    app.get('/profile', isLoggedIn, pageController.profile);


    // API

    app.post('/api/register', apiController.apiRegister);

    app.post('/api/login', apiController.apiLogin);

}