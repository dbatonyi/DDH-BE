const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const env = process.env.NODE_ENV || "development";
const config = require("./config/config.json")[env];

//CORS
app.use(
  cors({
    credentials: true,
    origin: [config.FRONTEND_URL],
  })
);

//Cookie parser
app.use(cookieParser());

//JSON
app.use(express.json());

//Public folder
app.use(express.static(__dirname + "/public"));

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//For error messages
app.use(flash());

//For Passport
app.use(
  session({ secret: "randomstring", resave: true, saveUninitialized: true })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.get("/", function (req, res) {
  res.redirect("/dashboard");
});

//Models
const models = require("./models");

//Sync Database
models.sequelize
  .sync()
  .then(function () {
    console.log("Nice! Database looks fine");
  })
  .catch(function (err) {
    console.log(err, "Something went wrong with the Database Update!");
  });

//For JSX
app.set("views", "./views");
app.set("view engine", "jsx");
app.engine("jsx", require("express-react-views").createEngine());

//Routes
const route = require("./routes/route.js")(app, passport);

//load passport strategies
require("./config/passport/passport.js")(passport, models.User);

//Create server
app.listen(5000, function (err) {
  if (!err) console.log("Site is live: http://localhost:5000");
  else console.log(err);
});
