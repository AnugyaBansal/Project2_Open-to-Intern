
const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const validator = require("../validator/validator")

  // =================== createCollege =========================

const createColleges = async function (req, res) {
  try {
    const requestBody = req.body;
    if (!validator.isValidRequestBody(requestBody)) {
      res.status(400).send({ status: false, msg: "Invalid request parameters. Please provide College Details", });
      return
    }
    const { name, fullName, logoLink, isDeleted } = requestBody;
    if (!validator.isValid(name)) {
      res.status(400).send({ status: false, msg: "College name is required" });
      return;
    }
    else if (/\d/.test(name)) {
      res.status(400).send({ status: false, msg: "name cannot have numbers.   " });
      return;
    }

    let isNameAlreadyUsed = await collegeModel.findOne({ name });
    if (isNameAlreadyUsed) {
      res.status(400).send({ status: false, message: `College name is already registered`, });
      return;
    } 
    if (!validator.isValid(fullName)) {
      res.status(400).send({ status: false, msg: "College Fullname is required" });
      return;
    }
    else if (/\d/.test(fullName)) {
      res.status(400).send({ status: false, msg: "Fullname cannot have numbers.   " });
      return;
    }
    if (!validator.isValid(logoLink)) {
      res.status(400).send({ status: false, msg: "College Logo link is required" });
      return;
    }
    if (!(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(logoLink))) {
      res.status(400).send({ status: false, message: 'Please provide valid URL' })
      return;
    }
    if (isDeleted == true) {
      res.status(400).send({ status: false, msg: "Cannot input isDeleted as true while registering" });
      return;
    }
    let isfullNameAlreadyUsed = await collegeModel.findOne({ fullName });
    if (isfullNameAlreadyUsed) {
      res.status(400).send({ status: false, message: `College full name is already registered`, });
      return;
    }
    const newCollege = await collegeModel.create(requestBody);
    res.status(201).send({ status: true, msg: "New College created successfully", data: newCollege, });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};
  // ========================================= getCollegeDetails ==============================================
const getAllIntern = async function (req, res) {
  // res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let collegeName = req.query.collegeName;

    // request query params  validation

    if (!collegeName) {
      return res.status(404).send({ status: false, msg: "give inputs" });
    }

    // college validation

    let collegeDetail = await collegeModel.findOne({
      name: collegeName,
      isDeleted: false,
    });
    if (!collegeDetail) {
      res.status(404).send({status: false, msg: "college not found please provide valid college name",});
    }
     // that is one method fo response structure data in data base
     let collegeDetail1 = await collegeModel.findOne({ name: collegeName, isDeleted: false }).select({ name: 1, fullName: 1, logoLink: 1, _id: 1 });
    let internDetail = await internModel.find({ collegeId: collegeDetail._id, isDeleted: false }).select({ _id: 1, name: 1, email: 1, mobile: 1 });
    if (internDetail.length === 0) {
      return res.status(201).send({status: true, msg: {...collegeDetail1.toObject(),interns: "intern Details not present"}});
    }
    let result = { ...collegeDetail1.toObject(), interns: internDetail };
    res.status(200).send({ status: true, data: result });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.createColleges = createColleges;
module.exports.getAllIntern = getAllIntern;

