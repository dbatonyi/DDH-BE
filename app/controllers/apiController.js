const bCrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const jwt = require("jsonwebtoken");

var exports = module.exports = {}

exports.apiRegister = async function (req, res) {

    const { User } = require('../models');

    const email = req.body.email;
    const password = req.body.password;

    function createNewUser(data) {
        User.create(data).then(function (newUser, created) {

            const options = {
                viewEngine: {
                extname: '.hbs',
                layoutsDir: 'app/views/email/',
                defaultLayout : 'registration',
                partialsDir : 'app/views/partials/'
                },
            viewPath: 'app/views/email/',
            extName: '.hbs'
            };

            const transporter = nodemailer.createTransport({
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
                        res.json({ status: 'Unexpected error!' })
                        return;
                    }
                    if (newUser) {
                        res.json({ status: 'Successfully registered!' })
                        return;
                    }
                });
    }

    const generateHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    };

    const user = await User.findOne({ where: { email: email } })
            
    if (user) {
        res.json({ status: 'User already exist' })
        return;
    }
            
    const userPassword = generateHash(password);
    const regHashRow = generateHash(email + password);
                    
    //Remove slashes
    const regHash = regHashRow.replace(/\/+$/, '');

    const data =
        {
            email: email,
            password: userPassword,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            role: 'User',
            reghash: regHash
        };  
        
    createNewUser(data);
        
}

exports.apiLogin = async function (req, res) {

    const { User } = require('../models');

    const email = req.body.email;
    const password = req.body.password;
        
    const isValidPassword = function(userpass, password) {
        return bCrypt.compareSync(password, userpass);
    }
        
    const user = await User.findOne({ where: { email: email } })
            
    if (!user) {
        res.json({ status: 'Wrong email address.' })
        return;
    }
        
    if (!isValidPassword(user.password, password)) {
        res.json({ status: 'Incorrect password.' })
        return;
    }
            
    const userInfo = user.get();

    //Gerenate an access token

    const generateAccessToken = (user) => {
        return jwt.sign(
            { id: user.id, role: user.role },
            config.jwtkey,
            { expiresIn: "15m" }
        );
    }

    const accessToken = generateAccessToken(userInfo);

    res.cookie('jwt', accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    res.send({message: 'Success!'});
 
}

exports.apiUser = async function (req, res) {

    const { User } = require('../models');

    try {
        const cookie = req.cookies['jwt'];

        const claims = jwt.verify(cookie, config.jwtkey);

        if (!claims) {
            res.json({
                message: "Invalid Token!",
                auth: false
            })
            return;
        }

        const user = await User.findOne({ where: { id: claims.id } });

        const { password, reghash, resetdate, updatedAt, createdAt, uuid, ...data } = await user.toJSON();

        res.send({userInfo: data, auth: true});

    } catch {
        res.json({
            message: "Invalid Token!",
            auth: false
        })
        return;

    }
 
}

exports.apiLogout = async function (req, res) {

    res.cookie('jwt', "", { maxAge: 0 })
    
    res.send({message: "Successfully logged out!"})
 
}