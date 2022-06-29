const mongoose = require("mongoose");
const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const validator = require("../validator/validator");

const createInterns = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({
                status: false,
                msg: "Invalid request parameters. Please provide Intern Details",
            });
        }

        const { name, mobile, email, collegeName, isDeleted } = requestBody;
        if (!validator.isValid(name)) {
            res.status(400).send({ status: false, msg: "College name is required" });
            return;
        }
        if (!validator.isValid(mobile)) {
            res.status(400).send({ status: false, msg: "Mobile Number is required" });
            return;
        }
        if (!/^[0-9]\d{9}$/gi.test(mobile)) {
            res
                .status(400)
                .send({
                    status: false,
                    message: `provide 10 digits Mobile Number`,
                });
            return;
        }
        const isMobileNumberAlreadyUsed = await internModel.findOne({ mobile });
        if (isMobileNumberAlreadyUsed) {
            res
                .status(400)
                .send({
                    status: false,
                    message: `${mobile} mobile number is already registered`,
                });
            return;
        }
        if (!validator.isValid(email)) {
            return res
              .status(400)
              .send({ status: false, message: "Intern email required" });
          }
          
          if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
            res
              .status(400)
              .send({
                status: false,
                message: `Email should be a valid email address`,
              });
            return;
          }
          const isEmailAlreadyUsed = await internModel.findOne({ email }); 
          if (isEmailAlreadyUsed) {
            res
              .status(400)
              .send({
                status: false,
                message: `${email} email address is already registered`,
              });
            return;
          }
          if(!validator.isValid(collegeName)){
            return res.status(400).send({status:false, message: " College Name is require"});
        }

        let iscollegeId = await collegeModel.findOne({name:requestBody.collegeName}).select({_id:1});
          if(!iscollegeId){
            return res.status(400).send({status: false, msg: "college name is not exist" });
          }
          let id=iscollegeId._id.toString()
          requestBody.collegeId=id
          delete requestBody.collegeName
          if (isDeleted == true) {
            res
              .status(400)
              .send({ status: false, msg: "Cannot input isDeleted as true while registering" });
            return;
          }
          const newIntern = await internModel.create(requestBody);
           res.status(201).send({status:true, msg : "New Intern Created successfully ", data: newIntern,});
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

module.exports.createInterns = createInterns;