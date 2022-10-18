const appConfig = require("../app-config.json")["variables"];

var exports = (module.exports = {});

exports.signup = function (req, res) {
  const errorMessage = req.flash("errorMessage");
  const errorPassMessage = req.flash("errorPassMessage");

  res.render("signup", {
    title: "DDH Signup",
    errMessage: errorMessage[0],
    errPassMessage: errorPassMessage[0]
  });
};

exports.accountConfirm = async function (req, res) {
  const { User } = require("../models");

  var regHash = req.params.id;
  let redirectParam = req.query.redirectParam;

  const user = await User.findOne({ where: { reghash: regHash } });

  if (!user) {
    res.json({ status: "Account not found!" });
    return;
  }

  const updateUser = await User.update(
    { status: "active" },
    { where: { reghash: regHash } }
  );

  if (redirectParam) {
    window.location.replace(redirectParam + "/login");
    return;
  }

  res.json({ status: "Account activated!" });
  return;
};

exports.signin = function (req, res) {
  const successMessage = req.flash("successMessage");
  const errorMessage = req.flash("errorMessage");

  res.render("signin", {
    title: "DDH Sign-in",
    successMessage: successMessage[0],
    errMessage: errorMessage[0]
  });
};

exports.logout = function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
};
