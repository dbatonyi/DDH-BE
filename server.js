var express = require('express');
var app = express();
var passport   = require('passport');
var session    = require('express-session');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

const path = require('path');

//var env = require('dotenv').load();

//Public folder
app.use(express.static(__dirname + '/public'));

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
//For Passport
app.use(session({ secret: 'randomstring',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.get('/', function(req, res) {
 
    res.redirect('/dashboard');
 
});
 
//Models
var models = require("./app/models");
 
//Sync Database
models.sequelize.sync().then(function() {
 
    console.log('Nice! Database looks fine')
 
}).catch(function(err) {
 
    console.log(err, "Something went wrong with the Database Update!")
 
});

//For Handlebars
app.set('views', './app/views')
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: false,
    layoutsDir: "views/"
}));
app.set('view engine', '.hbs');

//Routes
var route = require('./app/routes/route.js')(app,passport);

//load passport strategies
require('./app/config/passport/passport.js')(passport, models.User);

//Create server
app.listen(5000, function(err) {
 
    if (!err)
        console.log("Site is live: http://localhost:5000");
    else console.log(err)
 
});