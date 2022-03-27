var exports = module.exports = {}
 
exports.signup = function(req, res) {
 
    res.render('signup', { errmessage: req.session.messages });
    
}

exports.signin = function(req, res) {
 
    const sessionMessage = req.session.messages;
    var emailError = false;
    var passwordError = false;

    if (sessionMessage) {
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

    res.render('signin', {
        errmessage: sessionMessage,
        isEmailError: emailError,
        isPasswordError: passwordError
    });
    
}

exports.dashboard = function(req, res) {

    //console.log(req.user);
    const fullName = req.user.firstname + " " + req.user.lastname;
 
    res.render('dashboard', {username: fullName});
 
}

exports.logout = function(req, res) {
 
    req.session.destroy(function(err) {
 
        res.redirect('/');
 
    });
 
}