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
const appConfig = require("./app-config.json");

//CORS
app.use(
  cors({
    credentials: true,
    origin: [appConfig.variables.frontendUrl],
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

//Functions

async function createAdmin(users) {

    if (users.length < 1) {
      const generateHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
      };

      const userPassword = generateHash(
        appConfig.adminCredentials.adminPassword
      );
      const regHashRow = generateHash(
        appConfig.adminCredentials.adminEmail +
          appConfig.adminCredentials.adminPassword
      );

      //Remove slashes
      const regHash = regHashRow.replace(/\//g, "");

      const data = {
        email: appConfig.adminCredentials.adminEmail,
        username: appConfig.adminCredentials.adminEmail,
        password: userPassword,
        firstname: appConfig.adminCredentials.adminFirstname,
        lastname: appConfig.adminCredentials.adminLastname,
        status: "active",
        role: "Admin",
        reghash: regHash,
      };

      models.User.create(data);

      console.log("Admin user created!");
    }
    
    return;
}

async function cleanUpDB(users) {

  const date = new Date();
  const currentDate = date.getTime();

  const filteredData = users.filter(user => {
    const createdDate = user.createdAt.getTime();
    const dayDifference = (currentDate - createdDate) / (1000*3600*24);
    if(user.status === "inactive" && dayDifference > 90) {
      return user.uuid;
    }
    return null;
  }).map(function(item) {
    return item.uuid;
  })

  if(filteredData.length > 0) {
    await models.User.destroy({where: { uuid: filteredData }});
    console.log(`Database cleaned - ${filteredData.length} account deleted in the process!`);
    return;
  }

  console.log("Database clean!")
}

//Sync Database

(async function(){

  try {
    const syncDB = await models.sequelize.sync();
    const users = await models.User.findAll();
    createAdmin(users);
    cleanUpDB(users);
    console.log("Nice! Database looks fine");
  } catch (error) {
    console.log(error, "Something went wrong with the Database Update!");
  }
  
})();

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
