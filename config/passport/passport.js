//load packages
const bCrypt = require("bcrypt-nodejs");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const env = process.env.NODE_ENV || "development";
const config = require("../config.json")[env];
const appConfig = require("../../app-config.json")["variables"];

module.exports = function (passport, User) {
  const LocalStrategy = require("passport-local").Strategy;

  //REGISTER
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },

      async function (req, email, password, done) {
        function createNewUser(data) {
          User.create(data).then(function (newUser, created) {
            console.log(config.host + ":5000/login");

            const options = {
              viewEngine: {
                extname: ".hbs",
                layoutsDir: "views/email/",
                defaultLayout: "registration",
                partialsDir: "views/partials/",
              },
              viewPath: "views/email/",
              extName: ".hbs",
            };

            const transporter = nodemailer.createTransport({
              host: appConfig.smtpHost,
              port: 465,
              service: "yahoo",
              secure: false,
              auth: {
                user: appConfig.smtpEmail,
                pass: appConfig.smtpPassword,
              },
              logger: true,
            });

            transporter.use("compile", hbs(options));
            transporter.sendMail(
              {
                from: appConfig.smtpEmail,
                to: data.email,
                subject: "DDH registration!",
                template: "registration",
                context: {
                  user: data.firstname + " " + data.lastname,
                  loginUrl: config.host + ":5000/login",
                  activationUrl:
                    config.host + `:5000/api/account-confirm/${data.regHash}`,
                },
              },
              function (error, response) {
                console.log(error);
                transporter.close();
              }
            );

            if (!newUser) {
              return done(null, false);
            }
            if (newUser) {
              req.flash("successMessage", "Successful registration!");
              return done(null, newUser);
            }
          });
        }

        const generateHash = function (password) {
          return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        };

        const user = await User.findOne({ where: { email: email } });

        if (user) {
          req.flash("errorMessage", "Email address already exists.");
          return done(null, false);
        }

        const userPassword = generateHash(password);
        const regHashRow = generateHash(email + password);

        //Remove slashes
        const regHash = regHashRow.replace(/\//g, "");

        const data = {
          email: email,
          username: email,
          password: userPassword,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          role: "User",
          reghash: regHash,
        };

        if (req.body.password === req.body.repassword) {
          createNewUser(data);
        } else {
          req.flash("errorPassMessage", "Password not match!");
          return done(null, false);
        }
      }
    )
  );

  //LOCAL LOGIN
  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },

      async function (req, email, password, done) {
        const isValidPassword = function (userpass, password) {
          return bCrypt.compareSync(password, userpass);
        };

        const user = await User.findOne({ where: { email: email } });

        if (!user) {
          req.flash("errorMessage", "Incorrect email address or/and password!");
          return done(null, false);
        }

        if (!isValidPassword(user.password, password)) {
          req.flash("errorMessage", "Incorrect email address or/and password!");
          return done(null, false);
        }

        if (user.status === "inactive") {
          req.flash("errorMessage", "Please activate your account first!");
          return done(null, false);
        }

        const userInfo = user.get();
        return done(null, userInfo);
      }
    )
  );

  //serialize
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  //deserialize user
  passport.deserializeUser(function (id, done) {
    User.findOne({ where: { id } }).then(function (user) {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });
};
