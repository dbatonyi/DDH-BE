const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];

var authController = require("../controllers/authController.js");
var pageController = require("../controllers/pageController.js");
var apiController = require("../controllers/apiController.js");

module.exports = function (app, passport) {
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();

    res.redirect("/login");
  }

  function singupHandler(req, res, next) {
    passport.authenticate("local-signup", {
      successRedirect: "/login",

      failureRedirect: "/signup",

      failureMessage: true,
    })(req, res, next);
  }

  function signinHandler(req, res, next) {
    passport.authenticate("local-signin", {
      successRedirect: "/dashboard",

      failureRedirect: "/login",

      failureMessage: true,
    })(req, res, next);
  }

  //Auth

  app.get("/signup", authController.signup);

  app.get("/login", authController.signin);

  app.get("/logout", authController.logout);

  app.post("/signup", singupHandler);

  app.post("/login", signinHandler);

  //Page

  app.get("/dashboard", isLoggedIn, pageController.dashboard);

  app.get("/profile", isLoggedIn, pageController.profile);

  // API

  app.post("/api/register", apiController.apiRegister);

  app.post("/api/password/new", apiController.apiNewPassHandler);

  app.post("/api/password/reset/:id", apiController.apiResetPasswordHandler);

  app.post("/api/login", apiController.apiLogin);

  app.post("/api/logout", apiController.apiLogout);

  app.get("/api/user", apiController.apiUser);

  app.post("/api/task/new", apiController.apiNewTask);

  app.get("/api/task/list", apiController.apiTaskList);

  app.get("/api/task/:id", apiController.apiTask);

  app.post("/api/task/edit/:id", apiController.apiEditTask);
};
