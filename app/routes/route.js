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

    app.get('/dashboard', isLoggedIn, controller.dashboard);

    app.get('/logout', controller.logout);
 
    app.post('/signup', singupHandler);

    app.post('/login', signinHandler);
 
}