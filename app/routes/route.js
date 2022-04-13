var controller = require('../controllers/controller.js');
 
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
 
    app.get('/signup', controller.signup);
 
    app.get('/login', controller.signin);

    app.get('/reset-pass', controller.resetPass);

    app.get('/dashboard', isLoggedIn, controller.dashboard);

    app.get('/profile', isLoggedIn, controller.profile);

    app.get('/logout', controller.logout);

    app.get('/reset/:id', controller.newPassword);

    app.post('/reset/:id', controller.newPasswordHandler);
 
    app.post('/signup', singupHandler);

    app.post('/login', signinHandler);

    app.post('/reset-pass', controller.resetPassHandler);
}