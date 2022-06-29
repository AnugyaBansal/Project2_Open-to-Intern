const mongoose = require("mongoose")
const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const validator = require("../validator/validator")

const createColleges = async function (req, res) {
  try {
    const requestBody = req.body;
    if (!validator.isValidRequestBody(requestBody)) {
      res
        .status(400)
        .send({
          status: false,
          msg: "Invalid request parameters. Please provide College Details",
        });
      return
    }
    const { name, fullName, logoLink, isDeleted } = requestBody;
    if (!validator.isValid(name)) {
      res.status(400).send({ status: false, msg: "College name is required" });
      return;
    }
    if (!validator.isValid(fullName)) {
      res
        .status(400)
        .send({ status: false, msg: "College Fullname is required" });
      return;
    }
    if (!validator.isValid(logoLink)) {
      res
        .status(400)
        .send({ status: false, msg: "College Logo link is required" });
      return;
    }

    if (!(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(logoLink))) {

      res.status(400).send({ status: false, message: 'Please provide valid URL' })
      return;
    }
    if (isDeleted == true) {
      res
        .status(400)
        .send({ status: false, msg: "Cannot input isDeleted as true while registering" });
      return;
    }
    let isfullNameAlreadyUsed = await collegeModel.findOne({ fullName });
    if (isfullNameAlreadyUsed) {
      res
        .status(400)
        .send({
          status: false,
          message: `College full name is already registered`,
        });
      return;
    }
    const newCollege = await collegeModel.create(requestBody);
    res
      .status(201)
      .send({
        status: true,
        msg: "New College created successfully",
        data: newCollege,
      });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.createColleges = createColleges