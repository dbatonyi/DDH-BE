var exports = module.exports = {}
 
exports.signup = function(req, res) {

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