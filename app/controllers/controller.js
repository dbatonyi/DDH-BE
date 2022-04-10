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
    console.log(sessionMessage)
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
        }
    });
 
}

exports.resetPass = function (req, res) {
    
    const sessionMessage = req.session.messages;
    console.log(sessionMessage)

    res.render('resetpass');
 
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