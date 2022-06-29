const mongoose = require("mongoose");

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
  
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "Number" && value.trim().length === 0) return false;
    return true;
  };
  
  const isValidRequestBody = function (requestbody) {
    return Object.keys(requestbody).length > 1;
  };

  const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
  };

  module.exports = {isValid,isValidObjectId,isValidRequestBody}