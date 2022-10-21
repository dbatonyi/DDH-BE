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
  const systemMessage = req.flash("systemMessage");

  res.render("profile", {
    title: "DDH User Profile",
    firstname,
    lastname,
    email,
    role,
    systemMessage
  });
};

exports.profileEdit = function (req, res) {
  const { firstname, lastname, email, role } = req.user;
  const systemMessage = req.flash("systemMessage");

  res.render("editProfile", {
    title: "DDH User Profile Edit",
    firstname,
    lastname,
    email,
    role,
    systemMessage,
  });
};

exports.profileEditHandler = async function (req, res) {
  const { User } = require("../models");
  const { fname, lname, userEmail, password } = req.body;

  const isValidPassword = function (userpass, password) {
    return bCrypt.compareSync(password, userpass);
  };

  const user = await User.findOne({ where: { email: req.user.email } });

  if (!isValidPassword(user.password, password)) {
    req.flash("systemMessage", "Incorrect password.");

    res.redirect("/profile/edit");
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

  req.flash("systemMessage", "Profile saved!");

  res.redirect("/profile");
  return;
};

exports.resetPass = function (req, res) {
  const { firstname, lastname, email, role } = req.user;
  const systemMessage = req.flash("systemMessage");

  res.render("editPassword", {
    title: "DDH Password Reset",
    firstname,
    lastname,
    email,
    role,
    systemMessage,
  });
};

exports.resetPassHandler = async function (req, res) {
  const { User } = require("../models");
  const { newPassword, reNewPassword, currPassword } = req.body;

  const isValidPassword = function (userpass, password) {
    return bCrypt.compareSync(password, userpass);
  };

  var generateHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
  };

  const user = await User.findOne({ where: { email: req.user.email } });

  if (!isValidPassword(user.password, currPassword)) {
    req.flash("systemMessage", "Password incorrect!");

    res.redirect("/profile/reset-password");
    return;
  }

  if (newPassword !== reNewPassword) {
    req.flash("systemMessage", "Password not match!");

    res.redirect("/profile/reset-password");
    return;
  }

  const cryptedPassword = generateHash(newPassword);

  user.password = cryptedPassword;

  await user.save();

  req.flash("systemMessage", "Profile saved!");

  res.redirect("/profile/edit");
  return;
};

exports.users = async function (req, res) {
  function paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  let page = req.query.page;
  let sort = req.query.sort;

  if (!["asc", "desc"].includes(sort)) {
    sort = "asc";
  }

  if (!page) {
    page = 1;
  }

  const pageSize = 10;

  const { User } = require("../models");
  const users = await User.findAll({
    attributes: ["id", "username", "role"],
    order: [["username", sort]],
  });

  const paginatedUserList = paginate(users, pageSize, page);

  const listLength = users.length / pageSize;

  const systemMessage = req.flash("systemMessage");

  res.render("users", {
    title: "DDH Users",
    users: paginatedUserList,
    listLength,
    page: Number(page),
    sort: sort ? sort : "asc",
    role: req.user.role,
    systemMessage
  });
};

exports.userRole = async function (req, res) {
  const { User } = require("../models");

  const userId = req.params.id;

  const user = await User.findOne({
    attributes: ["id", "username", "role"],
    where: { id: userId },
  });

  res.render("userRole", {
    title: "DDH User Role",
    user: user,
    role: req.user.role
  });
};

exports.userEditRoleHandler = async function (req, res) {
  const { User } = require("../models");

  const userId = req.params.id;
  const role = req.body.newRole;

  const user = await User.findOne({
    attributes: ["id", "username", "role"],
    where: { id: userId },
  });

  user.update(
    {
      role,
    },
    { where: { id: userId } }
  );

  req.flash("systemMessage", `${user.username}'s role updated!`);

  res.redirect("/users");
  return;
};

exports.userDelete = async function (req, res) {
  const { User } = require("../models");

  const userId = req.params.id;

  const user = await User.findOne({
    attributes: ["uuid", "username", "role"],
    where: { id: userId },
  });

  res.render("userDelete", {
    title: "DDH Delete User",
    user: user,
    role: req.user.role
  });
};

exports.userDeleteHandler = async function (req, res) {
  const { User } = require("../models");

  const userUuid = req.params.id;

  const user = await User.findOne({ where: { uuid: userUuid } });

  if (user) {

    if (userUuid === req.user.uuid) {
      await user.destroy();

      req.session.destroy(function (err) {
        res.redirect("/");
      });
    } else {
      req.flash("systemMessage", `${user.username}'s user deleted!`);

      await user.destroy();

      res.redirect("/users");
      return;
    }
  }
};

exports.settings = function (req, res) {
  const systemMessage = req.flash("systemMessage");

  res.render("settings", {
    title: "DDH Settings",
    role: req.user.role,
    systemMessage,
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

    req.flash(
      "systemMessage",
      "Database exported to /dbexport/taskdatabase.csv"
    );

    res.redirect("/settings");
    return;
  } catch (err) {
    req.flash("systemMessage", "Database error! ErrorCode: 40");

    res.redirect("/settings");
    return;
  }
};

exports.uploadCSV = function (req, res) {
  const systemMessage = req.flash("systemMessage");

  res.render("uploadCSV", {
    title: "DDH Upload DB",
    role: req.user.role,
    systemMessage,
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

            req.flash("systemMessage", "Database updated!");

            res.redirect("/settings");
            return;
          })
          .catch((error) => {
            req.flash("systemMessage", "Database error! ErrorCode: 40");

            res.redirect("/upload-db");
            return;
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
        req.flash("systemMessage", "Upload error! ErrorCode: 30");

        res.redirect("/upload-db");
        return;
      } else {
        await importDatabase();
      }
    });
  } catch (err) {
    req.flash("systemMessage", "Something went wrong! ErrorCode: 50");

    res.redirect("/upload-db");
    return;
  }
};
