const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
const bCrypt = require("bcrypt-nodejs");
const converter = require("json-2-csv");
const fs = require("fs");

var exports = (module.exports = {});

exports.dashboard = function (req, res) {
  const fullName = req.user.firstname + " " + req.user.lastname;

  res.render("dashboard", {
    title: "DDH Dashboard",
    username: fullName,
  });
};

exports.profile = function (req, res) {
  const { firstname, lastname, email, role } = req.user;

  res.render("profile", {
    title: "DDH User Profile",
    firstname,
    lastname,
    email,
    role,
  });
};

exports.profileEdit = function (req, res) {
  const { firstname, lastname, email } = req.user;

  res.render("editProfile", {
    title: "DDH User Profile Edit",
    firstname,
    lastname,
    email,
  });
};

exports.profileEditHandler = async function (req, res) {
  const { User } = require("../models");
  const { firstname, lastname, email, role } = req.user;
  const { fname, lname, userEmail, password } = req.body;

  const isValidPassword = function (userpass, password) {
    return bCrypt.compareSync(password, userpass);
  };

  const user = await User.findOne({ where: { email: req.user.email } });

  if (!isValidPassword(user.password, password)) {
    res.render("editProfile", {
      title: "DDH User Profile",
      firstname,
      lastname,
      email,
      role,
      systemMessage: "Password incorrect!",
    });
    return;
  }

  if (fname !== "") {
    user.firstname = fname;
  }
  if (lname !== "") {
    user.lastname = lname;
  }
  if (userEmail !== "") {
    user.email = userEmail;
  }

  await user.save();

  res.render("profile", {
    title: "DDH User Profile",
    firstname: fname ? fname : firstname,
    lastname: lname ? lname : lastname,
    email: userEmail ? userEmail : email,
    role,
    systemMessage: "Profile saved!",
  });
};

exports.settings = function (req, res) {
  res.render("settings", {
    title: "DDH Settings",
  });
};

exports.exportDatabase = async function (req, res) {
  const { firstname, lastname, email, role } = req.user;
  const { Task } = require("../models");

  try {
    const tasks = await Task.findAll();

    const jsonUsers = JSON.parse(JSON.stringify(tasks));

    converter.json2csv(jsonUsers, (err, csv) => {
      if (err) {
        throw err;
      }

      fs.writeFileSync("./dbexport/taskdatabase.csv", csv);
    });

    res.render("profile", {
      title: "DDH User Profile",
      firstname,
      lastname,
      email,
      role,
      systemMessage: "Database exported to ./dbexport/taskdatabase.csv",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
