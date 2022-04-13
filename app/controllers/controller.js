var bCrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

var exports = module.exports = {}
 
exports.signup = function (req, res) {

    const sessionMessage = req.session.messages;
    var emailError = false;

    if (sessionMessage) {
        if (sessionMessage.length !== 0) {
            const isEmailError = sessionMessage[0].includes("Email");

            if (isEmailError) {
                var emailError = true;
            } else {
                var emailError = false;
            }
        }
    }
 
    res.render('signup', {
        errmessage: sessionMessage,
        isEmailError: emailError
    });
    
}

exports.signin = function(req, res) {
 
    const sessionMessage = req.session.messages;
    var emailError = false;
    var passwordError = false;

    if (sessionMessage) {
        if (sessionMessage.length !== 0) {

            const isEmailError = sessionMessage[0].includes("email");
            const isPasswordError = sessionMessage[0].includes("password");

            if (isEmailError) {
                var emailError = true;
            } else {
                var emailError = false;
            }

            if (isPasswordError) {
                var passwordError = true;
            } else {
                var passwordError = false;
            }
        }
    }

    res.render('signin', {
        errmessage: sessionMessage,
        isEmailError: emailError,
        isPasswordError: passwordError
    });
    
}

exports.resetPassHandler = function (req, res, done) {

    // Sequelize model require
    const { User } = require('../models');
    
    const userEmail = req.body.email;

    //Empty session message
    req.session.messages = [];

    User.findOne({
        where: {
            email: userEmail
        }
    }).then(function(user) {
        if (!user) {

            return res.render('resetpass', {
                resetmessage: "Wrong email address!",
                isPasswordReset: true
            });
        } else {

            const userinfo = user.get();

            var date = new Date();
            var twoMin = 2 * 60 * 1000;
        
            if((date - userinfo.resetdate) > twoMin) {

                User.update({resetdate: new Date()}, { where: {email: userEmail}}).then(function (newUser, created) {

                const userName = userinfo.firstname + " " + userinfo.lastname;
                const reghash = userinfo.reghash;

                var options = {
                    viewEngine: {
                    extname: '.hbs',
                    layoutsDir: 'app/views/email/',
                    defaultLayout : 'passreset',
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
                        to: userEmail,
                        subject: 'DDH Reset password!',
                        template: 'passreset',
                        context: {
                            user: userName,
                            reghash: reghash
                        }
                        }, function (error, response) {
                            console.log(error)
                            transporter.close();
                    });
            
                    return res.render('resetpass', {
                        resetmessage: "Your password has been reseted!",
                        isPasswordReset: true
                    });

                });

            } else {
                return res.render('resetpass', {
                    resetmessage: "Your password already reseted, try again later!",
                    isPasswordReset: true
                });
            }

        }
    });
 
}

exports.resetPass = function (req, res) {
    
    const sessionMessage = req.session.messages;

    res.render('resetpass');
 
}

exports.newPasswordHandler = function (req, res) {
    
    const { User } = require('../models');

    var generateHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    };
    
    var regHash = req.params.id;

    const newPassword = req.body.password;
    const reNewPassword = req.body.repassword;

    if (newPassword === reNewPassword) {

         User.findOne({
            where: {
                reghash: regHash
            }
         }).then(function (user) {
            
            const cryptedPassword = generateHash(newPassword);
        
            User.update({password: cryptedPassword}, { where: {reghash: regHash}}).then(function (newUser, created) {

                res.redirect('/');

            });
   
        });
    } else {
        res.render('reset', {
            reghash: regHash,
            isPasswordReset: true,
            resetmessage: "Password must match!"
        });
    }
    
}

exports.newPassword = function (req, res) {

    const { User } = require('../models');
    
    var regHash = req.params.id;

    User.findOne({
            where: {
                reghash: regHash
            }
    }).then(function (user) {
        const userinfo = user.get();

        var date = new Date();
        var FIVE_MIN = 5 * 60 * 1000;
        
        if((date - userinfo.resetdate) < FIVE_MIN) {

            res.render('reset', {reghash: regHash});
        } else {
            res.redirect('/');
        }
   
    });
 
}

exports.dashboard = function(req, res) {

    //console.log(req.user);
    const fullName = req.user.firstname + " " + req.user.lastname;
 
    res.render('dashboard', {username: fullName});
 
}

exports.profile = function(req, res) {

    //console.log(req.user);
    const fullName = req.user.firstname + " " + req.user.lastname;
 
    res.render('profile', {username: fullName});
 
}

exports.logout = function(req, res) {
 
    req.session.destroy(function(err) {
 
        res.redirect('/');
 
    });
 
}