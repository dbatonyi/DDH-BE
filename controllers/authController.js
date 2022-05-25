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

exports.logout = function(req, res) {
 
    req.session.destroy(function(err) {
 
        res.redirect('/');
 
    });
 
}