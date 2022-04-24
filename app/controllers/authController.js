const bCrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

var exports = module.exports = {}
 
exports.signup = function (req, res) {

    const errorMessageEmail = req.flash("errorMessageEmail");
    const errorMessagePass = req.flash("errorMessagePass");
 
    res.render('signup', {
        title: "DDH Signup",
        isEmailError: errorMessageEmail[0],
        isPasswordError: errorMessagePass[0]
    });
    
}

exports.signin = function(req, res) {
 
    const successMessage = req.flash('successMessage');
    const errorMessage = req.flash('errorMessage');
    const errorMessageEmail = req.flash("errorMessageEmail");
    const errorMessagePass = req.flash("errorMessagePass");

    res.render('signin', {
        title: "DDH Sign-in",
        successMessage: successMessage[0],
        errMessage: errorMessage[0],
        isEmailError: errorMessageEmail[0],
        isPasswordError: errorMessagePass[0]
    });
    
}

exports.resetPassHandler = async function (req, res, done) {

    // Sequelize model require
    const { User } = require('../models');
    
    const userEmail = req.body.email;

    function setPassResetDate(user) {
        const userInfo = user.get();

        var date = new Date();
        var twoMin = 2 * 60 * 1000;
        
        if((date - userInfo.resetdate) > twoMin) {

            User.update({resetdate: new Date()}, { where: {email: userEmail}}).then(function (newUser, created) {

                const userName = userInfo.firstname + " " + userInfo.lastname;
                const reghash = userInfo.reghash;

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
                    req.flash('successMessage', 'Your password has been reseted!');
                    res.redirect('/');
                });
        } else {
            req.flash('errorMessage', 'Your password already reseted, try again later!');
            res.redirect('/reset-pass');
        }

    }

    const user = await User.findOne({ where: { email: userEmail } });

    if (!user) {
        req.flash('errorMessage', 'Wrong email address!');
        res.redirect('/reset-pass');
    } 

    setPassResetDate(user);
}

exports.resetPass = function (req, res) {
    
    const errorMessage = req.flash('errorMessage');

    res.render('resetpass', {
        title: "DDH Password Reset",
        errMessage: errorMessage[0]
    });
 
}

exports.newPasswordHandler = async function (req, res) {
    
    const { User } = require('../models');

    var generateHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    };
    
    var regHash = req.params.id;

    const newPassword = req.body.password;
    const reNewPassword = req.body.repassword;
    const cryptedPassword = generateHash(newPassword);

    if (newPassword === reNewPassword) {

        const user = await User.findOne({ where: { reghash: regHash } });
        if (user) {
            User.update({password: cryptedPassword}, { where: {reghash: regHash}}).then(function (newUser, created) {
                req.flash('successMessage', 'You successfully reseted your password now you can login!');
                res.redirect('/');
            });
        } else {
            req.flash('errorMessage', 'Something went wrong!');
            res.redirect('/');
        }     
   
    } else {
        req.flash('errorMessage', 'Password must match!');
        res.redirect(`/reset/${regHash}`);
    }
    
}

exports.newPassword = async function (req, res, done) {

    const { User } = require('../models');
    
    const regHash = req.params.id;

    const user = await User.findOne({ where: { reghash: regHash } });

    const userInfo = user.get();

    const errorMessage = req.flash('errorMessage');

    const date = new Date();
    const fiveMin = 5 * 60 * 1000;
        
    if((date - userInfo.resetdate) < fiveMin) {
        res.render('reset', {
            title: "DDH Password Reset",
            reghash: regHash,
            errorMessage: errorMessage[0]
        });
    } else {
        req.flash('errorMessage', 'Your password reset link expired!');
        res.redirect('/');
    }
 
}

exports.logout = function(req, res) {
 
    req.session.destroy(function(err) {
 
        res.redirect('/');
 
    });
 
}