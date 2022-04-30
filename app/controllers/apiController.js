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
            firstname: req.body.firstName,
            lastname: req.body.lastName,
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

    res.json({ status: 'Successfully logged in!', username: userInfo.email, role: userInfo.role, accessToken, refreshToken })

    return;
 
}

exports.apiRefresh = async function (req, res) {

    const { User } = require('../models');

    const refreshToken = req.body.token;

    function pushRefreshToken(data) {
        User.update({ refreshtoken: data.refreshtoken }, { where: { refreshtoken: data.refreshtoken } });
    }

    const getUserData = await User.findOne({ where: { refreshtoken: refreshToken } });

    if (getUserData) {

        const userInfo = getUserData.get();

        const getRefreshToken = userInfo.refreshtoken;

        console.log(getRefreshToken.includes(refreshToken));

        if (!refreshToken) return res.status(401).json("You are not authenticated!");
        if (!getRefreshToken.includes(refreshToken)) {
            return res.status(403).json("Refresh token is not valid!");
        }
        jwt.verify(refreshToken, config.jwtrefreshkey, (err, user) => {
            err && console.log(err);

            //Gerenate an access token

            const generateAccessToken = (user) => {
                return jwt.sign(
                    { id: userInfo.id, role: userInfo.role },
                    config.jwtkey,
                    { expiresIn: "15m" }
                );
            }

            const generateRefreshToken = (user) => {
                return jwt.sign(
                    { id: userInfo.id, role: userInfo.role },
                    config.jwtrefreshkey,
                );
            } 

            const newAccessToken = generateAccessToken(getUserData);
            const newRefreshToken = generateRefreshToken(getUserData);

            const data = { refreshtoken: refreshToken };
    
            pushRefreshToken(data);

            res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            });
        });

    } else {
        return res.status(403).json("Refresh token is not valid!");
    }
    
}

exports.apiLogout = async function (req, res) {

    const { User } = require('../models');

    function pushRefreshToken(data) {
        User.update({ refreshtoken: data.deletetoken }, { where: { refreshtoken: data.refreshtoken } });
    }

    const refreshToken = req.body.token;

    const data = { refreshtoken: refreshToken, deletetoken: null };
    
    pushRefreshToken(data);

    res.status(200).json("You logged out successfully.");

}