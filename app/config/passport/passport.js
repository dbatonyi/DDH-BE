//load packages
var bCrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
const env = process.env.NODE_ENV || 'development';
const config = require('../config.json')[env];
 
module.exports = function(passport, User) {

    var LocalStrategy = require('passport-local').Strategy;
 
    //REGISTER
    passport.use('local-signup', new LocalStrategy(
 
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
 
        function (req, email, password, done) {
 
            var generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };

            var generateRegHash = function (regHash) {
                return bCrypt.hashSync(regHash, bCrypt.genSaltSync(8), null);
            }

            //Empty session message
            req.session.messages = [];

            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (user) {

                    return done(null, false, {
                        message: "Email address already exists."
                    });
                } else {
                    var userPassword = generateHash(password);
                    var regHash = generateRegHash(email+passport);
                    var data =
                        {
                            email: email,
                            password: userPassword,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            role: 'User',
                            reghash: regHash
                        };
                    User.create(data).then(function (newUser, created) {

                        var options = {
                            viewEngine: {
                            extname: '.hbs',
                            layoutsDir: 'app/views/email/',
                            defaultLayout : 'registration',
                            partialsDir : 'app/views/partials/'
                        },
                        viewPath: 'app/views/email/',
                        extName: '.hbs'
                        };

                        var transporter = nodemailer.createTransport({
                            host: config.smtpemail,
                            service: 'gmail',
                            auth: {
                                user: config.smtpemail,
                                pass: config.smtppass
                            },
                            secure: true,
                            logger: true,
                            ignoreTLS: true
                        });

                        transporter.use('compile', hbs(options));
                        transporter.sendMail({
                            from: config.smtpemail,
                            to: data.email,
                            subject: 'DDH registration!',
                            template: 'registration',
                            context: {
                                user : data.firstname + " " + data.lastname
                            }
                            }, function (error, response) {
                                console.log(error)
                                transporter.close();
                        });

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