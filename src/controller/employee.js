const User = require("../models/user");

//get all employee users from the database
exports.getEmployees = (req, res) => {
  User.find({}).exec((err, employees) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    if (employees) {
      return res.status(200).json({ employees });
    }
  });
};
