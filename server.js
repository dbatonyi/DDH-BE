const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bCrypt = require("bcrypt-nodejs");
const env = process.env.NODE_ENV || "development";
const config = require("./config/config.json")[env];
const adminCredentials = require("./config/admin-credentials.json");

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
  .then(async function () {
    const users = await models.User.findAll();

    if (users.length < 1) {
      const generateHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
      };

      const userPassword = generateHash(adminCredentials.admin_password);
      const regHashRow = generateHash(
        adminCredentials.admin_email + adminCredentials.admin_password
      );

      //Remove slashes
      const regHash = regHashRow.replace(/\//g, "");

      const data = {
        email: adminCredentials.admin_email,
        username: adminCredentials.admin_email,
        password: userPassword,
        firstname: adminCredentials.admin_firstname,
        lastname: adminCredentials.admin_lastname,
        role: "Admin",
        reghash: regHash,
      };

      models.User.create(data);

      console.log("Admin user created!");
    }
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
