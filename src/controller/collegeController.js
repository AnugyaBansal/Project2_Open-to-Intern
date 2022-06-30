
const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const validator = require("../validator/validator");

// =================== createCollege =========================

const createColleges = async function (req, res) {
  try {
    const requestBody = req.body;
    if (!validator.isValidRequestBody(requestBody)) {
      res.status(400).send({ status: false, message: "Invalid request parameters. Please provide College Details", });
      return
    }
    const { name, fullName, logoLink, isDeleted } = requestBody;
    if (!validator.isValid(name)) {
      res.status(400).send({ status: false, message: "College name is required" });
      return;
    }
    else if (/\d/.test(name)) {
      res.status(400).send({ status: false, message: "name cannot have numbers.   " });
      return;
    }

    let isNameAlreadyUsed = await collegeModel.findOne({ name });
    if (isNameAlreadyUsed) {
      res.status(400).send({ status: false, message: `${name} College name is already registered`, });
      return;
    }
    if (!validator.isValid(fullName)) {
      res.status(400).send({ status: false, message: "College Fullname is required" });
      return;
    }
    else if (/\d/.test(fullName)) {
      res.status(400).send({ status: false, message: "Fullname cannot have numbers.   " });
      return;
    }
    if (!validator.isValid(logoLink)) {
      res.status(400).send({ status: false, message: "College Logo link is required" });
      return;
    }
    if (!(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(logoLink))) {
      res.status(400).send({ status: false, message: 'Please provide valid URL' })
      return;
    }
    if (isDeleted == true) {
      res.status(400).send({ status: false, message: "Cannot input isDeleted as true while registering" });
      return;
    }
    let isfullNameAlreadyUsed = await collegeModel.findOne({ fullName });
    if (isfullNameAlreadyUsed) {
      res.status(400).send({ status: false, message: `${fullName} College full name is already registered`, });
      return;
    }
    const newCollege = await collegeModel.create(requestBody);
    res.status(201).send({ status: true, message: "New College created successfully", data: newCollege, });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};
// ========================================= getCollegeDetails ==============================================
const getcollegeDetails = async function (req, res) {

  try {

    const collegeName = req.query.name
    if (!collegeName) {
      return res.status(404).send({ status: false, message: "valid query is mandatory" })
    }
    const college = await collegeModel.findOne({ name: collegeName });
    if (!college) {
      return res.status(404).send({ status: false, message: "no such college present" })
    }
    const interData = await internModel.find({ collegeId: college._id });
    // if (!interData.length == 0) {
    //   return res.status(404).send({ status: false, msg: "no such intern" })
    // }
    const interns = interData.map(intern => {
      
      return {
        _id: intern._id,
        name: intern.name,
        email: intern.email,
        mobile: intern.mobile
      }
      
     });
    
    
    const data = {
      collegename: college.name,
      fullName: college.fullName,
      logoLink: college.logoLink,
      interns: interns.length==0 ? "No such Intern" : interns
    };
    
    res.status(200).send({
      status: true,
      data: data,
    });

  } catch (error) {
    res.status(500).send({ status: false, message: error.message });

  }
};
module.exports.createColleges = createColleges;
module.exports.getcollegeDetails = getcollegeDetails;


