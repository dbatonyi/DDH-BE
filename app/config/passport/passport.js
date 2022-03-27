//load bcrypt
var bCrypt = require('bcrypt-nodejs');
 
module.exports = function(passport, User) {

    var LocalStrategy = require('passport-local').Strategy;
 
    //REGISTER
    passport.use('local-signup', new LocalStrategy(
 
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
 
        function(req, email, password, done) {
 
            var generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };

            //Empty session message
            req.session.messages = [];

            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (user) {

                    return done(null, false, {
                        message: "Email already taken"
                    });
                } else {
                    var userPassword = generateHash(password);
                    var data =
                        {
                            email: email,
                            password: userPassword,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            role: 'User'
                        };
                    User.create(data).then(function(newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        }
                        if (newUser) {
                            return done(null, newUser);
                        }
                    });
                }
            });
        }
    ));

    //LOCAL LOGIN
    passport.use('local-signin', new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
    
        function(req, email, password, done) {
        
            var isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            }

            //Empty session message
            req.session.messages = [];
        
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (!user) {
                    return done(null, false, {
                        message: 'Wrong email address.'
                    });
                }
        
                if (!isValidPassword(user.password, password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
            
                var userinfo = user.get();
                return done(null, userinfo);
            
            }).catch(function(err) {
            
                console.log("Error:", err);
            
                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });
            });
        }
    ));

    //serialize
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    //deserialize user
    passport.deserializeUser(function(id, done) {
        
        User.findOne({ where: {id} }).then(function(user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });
}