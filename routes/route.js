var authController = require("../controllers/authController.js");
var pageController = require("../controllers/pageController.js");
var apiController = require("../controllers/apiController.js");
var tmfController = require("../controllers/tmfController.js");

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

  function permissionLevelAdmin(req, res, next) {
    if (req.user.role === "Admin") return next();

    res.redirect("/dashboard");
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

  app.get("/profile/edit", isLoggedIn, pageController.profileEdit);

  app.post("/profile/edit", isLoggedIn, pageController.profileEditHandler);

  app.get("/profile/reset-password", isLoggedIn, pageController.resetPass);

  app.post(
    "/profile/reset-password",
    isLoggedIn,
    pageController.resetPassHandler
  );

  app.get("/users", isLoggedIn, pageController.users);

  app.get("/user/role/:id", isLoggedIn, pageController.userRole);

  app.post(
    "/user/edit-role/:id",
    isLoggedIn,
    pageController.userEditRoleHandler
  );

  app.get("/user/delete/:id", isLoggedIn, pageController.userDelete);

  app.get("/remove-user/:id", isLoggedIn, pageController.userDeleteHandler);

  app.get(
    "/settings",
    isLoggedIn,
    permissionLevelAdmin,
    pageController.settings
  );

  app.get(
    "/export-database",
    isLoggedIn,
    permissionLevelAdmin,
    pageController.exportDatabase
  );

  app.get(
    "/upload-db",
    isLoggedIn,
    permissionLevelAdmin,
    pageController.uploadCSV
  );

  app.post(
    "/upload-db",
    isLoggedIn,
    permissionLevelAdmin,
    pageController.uploadDatabaseHandler
  );

  // API

  app.post("/api/register", apiController.apiRegister);

  app.post("/api/password/new", apiController.apiNewPassHandler);

  app.post("/api/password/reset/:id", apiController.apiResetPasswordHandler);

  app.get("/api/account-confirm/:id", authController.accountConfirm);

  app.post("/api/login", apiController.apiLogin);

  app.post("/api/logout", apiController.apiLogout);

  app.get("/api/user", apiController.apiUser);

  app.post("/api/task/new", apiController.apiNewTask);

  app.get("/api/task/list", apiController.apiTaskList);

  app.get("/api/task/:id", apiController.apiTask);

  app.delete("/api/task/:id", apiController.apiDeleteTask);

  app.post("/api/task/edit/:id", apiController.apiEditTask);

  app.post("/api/tmf-form", tmfController.apiTaskManagerForm);
};
