const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
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
