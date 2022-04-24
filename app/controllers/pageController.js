const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

var exports = module.exports = {}

exports.dashboard = function(req, res) {

    const fullName = req.user.firstname + " " + req.user.lastname;
 
    res.render('dashboard', {
        title: "DDH Dashboard",
        username: fullName
    });
 
}

exports.profile = function (req, res) {
    
    const firstName = req.user.firstName;
    const lastName = req.user.lastname;
    const email = req.user.email;
    const permissionLevel = req.user.role;
 
    res.render('profile', {
        title: "DDH User Profile",
        firstname: firstName,
        lastname: lastName,
        email: email,
        permissionlevel: permissionLevel
    });
 
}