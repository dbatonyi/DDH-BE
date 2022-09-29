const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
const bCrypt = require("bcrypt-nodejs");
const converter = require("json-2-csv");
const fs = require("fs");
const csv = require("fast-csv");
const express = require("express");
const path = require("path");
const multer = require("multer");
const app = express();

var exports = (module.exports = {});

exports.dashboard = function (req, res) {
  const fullName = req.user.firstname + " " + req.user.lastname;

  res.render("dashboard", {
    title: "DDH Dashboard",
    username: fullName,
    role: req.user.role,
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
  const { firstname, lastname, email, role } = req.user;

  res.render("editProfile", {
    title: "DDH User Profile Edit",
    firstname,
    lastname,
    email,
    role,
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

exports.resetPass = function (req, res) {
  const { firstname, lastname, email, role } = req.user;

  res.render("editPassword", {
    title: "DDH Password Reset",
    firstname,
    lastname,
    email,
    role,
  });
};

exports.resetPassHandler = async function (req, res) {
  const { User } = require("../models");
  const { firstname, lastname, email, role } = req.user;
  const { newPassword, reNewPassword, currPassword } = req.body;

  const isValidPassword = function (userpass, password) {
    return bCrypt.compareSync(password, userpass);
  };

  var generateHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
  };

  const user = await User.findOne({ where: { email: email } });

  if (!isValidPassword(user.password, currPassword)) {
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

  if (newPassword !== reNewPassword) {
    res.render("editPassword", {
      title: "DDH User Profile",
      firstname,
      lastname,
      email,
      role,
      systemMessage: "Password not match!",
    });
    return;
  }

  const cryptedPassword = generateHash(newPassword);

  user.password = cryptedPassword;

  await user.save();

  res.render("profile", {
    title: "DDH User Profile",
    firstname: firstname,
    lastname: lastname,
    email: email,
    role,
    systemMessage: "Profile saved!",
  });
};

exports.users = async function (req, res) {
  const { User } = require("../models");
  const users = await User.findAll({ attributes: ["id", "username", "role"] });

  res.render("users", {
    title: "DDH Users",
    users: users,
    role: req.user.role,
  });
};

exports.userRole = async function (req, res) {
  const { User } = require("../models");

  var userId = req.params.id;

  const user = await User.findOne({
    attributes: ["id", "username", "role"],
    where: { id: userId },
  });

  res.render("userRole", {
    title: "DDH User Role",
    user: user,
    role: req.user.role,
  });
};

exports.settings = function (req, res) {
  res.render("settings", {
    title: "DDH Settings",
    role: req.user.role,
  });
};

exports.exportDatabase = async function (req, res) {
  const { Task } = require("../models");

  try {
    const tasks = await Task.findAll({ attributes: { exclude: ["id"] } });

    const jsonUsers = JSON.parse(JSON.stringify(tasks));

    converter.json2csv(jsonUsers, (err, csv) => {
      if (err) {
        throw err;
      }

      fs.writeFileSync("./dbexport/taskdatabase.csv", csv);
    });

    res.render("settings", {
      title: "DDH Settings",
      systemMessage: "Database exported to ./dbexport/taskdatabase.csv",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.uploadCSV = function (req, res) {
  res.render("uploadCSV", {
    title: "DDH Upload DB",
    role: req.user.role,
  });
};

exports.uploadDatabaseHandler = async function (req, res) {
  async function importDatabase() {
    const { Task } = require("../models");

    // Empty table before import new data
    if (req.body.importHandle === "clear") {
      Task.destroy({
        where: {},
        truncate: true,
      });
    }

    let tasks = [];
    let path = "./dbimport/taskdatabase.csv";

    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        tasks.push(row);
      })
      .on("end", () => {
        Task.bulkCreate(tasks)
          .then(() => {
            fs.unlink(path, (err) => {
              if (err) {
                console.error(err);
                return;
              }
            });

            res.render("uploadCSV", {
              title: "DDH Upload DB",
              systemMessage: "Database updated",
            });
          })
          .catch((error) => {
            res.render("uploadCSV", {
              title: "DDH Upload DB",
              systemMessage: "Database error",
            });
          });
      });
  }

  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "./dbimport");
      },
      filename: function (req, file, cb) {
        cb(null, "taskdatabase.csv");
      },
    });

    const maxSize = 10 * 1000 * 1000;

    const upload = multer({
      storage: storage,
      limits: { fileSize: maxSize },
      fileFilter: function (req, file, cb) {
        const filetypes = /csv/;
        const mimetype = filetypes.test(file.mimetype);

        const extname = filetypes.test(
          path.extname(file.originalname).toLowerCase()
        );

        if (mimetype && extname) {
          return cb(null, true);
        }

        cb(
          "Error: File upload only supports the " +
            "following filetypes - " +
            filetypes
        );
      },
    }).single("dbfile");

    upload(req, res, async function (err) {
      if (err) {
        res.render("uploadCSV", {
          title: "DDH Upload DB",
          systemMessage: "Upload error",
        });
      } else {
        await importDatabase();
      }
    });
  } catch (err) {
    res.render("uploadCSV", {
      title: "DDH Upload DB",
      systemMessage: "Something went wrong check",
    });
  }
};
