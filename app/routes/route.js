var controller = require('../controllers/controller.js');
 
module.exports = function(app, passport) {

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();  

        res.redirect('/login');
    }
 
    app.get('/signup', controller.signup);
 
    app.get('/login', controller.signin);

    app.get('/dashboard', isLoggedIn, controller.dashboard);

    app.get('/logout', controller.logout);
 
    app.post('/signup', function(req, res, next ){
        passport.authenticate('local-signup', function(err, user, info) {
            
          if (!user) { 
                res.render('signup', {message: info.message});
            }
          if (user) {
            res.redirect('/login');
          }

        })(req, res, next);   
    });

    app.post('/login', passport.authenticate('local-signin', {
            successRedirect: '/dashboard',
        
            failureRedirect: '/login'
        }
    ));
 
}