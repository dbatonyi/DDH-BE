var exports = module.exports = {}
 
exports.signup = function(req, res) {
 
    res.render('signup', { errmessage: req.session.messages });
    
}

exports.signin = function(req, res) {
 
    res.render('signin', { errmessage: req.session.messages });
    
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