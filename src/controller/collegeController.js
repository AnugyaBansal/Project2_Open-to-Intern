const collegeModel = require('../models/collegeModel');

const isValid = function (value) {
  
    if( typeof value == 'string' && value.trim().length == 0 ) {
      // console.log("2") 
        return false
    }
    if ( typeof value == 'string' && value.length !== value.trim().length ) {
      // console.log("4")
        return false
    }
    if ( typeof value == 'number' ) {
      // console.log("5")
        return false
    }
    return true
  }
const createCollege = async function(req, res){
    let data = req.body
    const { name, fullName, logoLink } = data;
   
        if ( !isValid ( name ) ){return res.send({status:false, msg:"Enter valid Name."})} 
        if ( !isValid ( fullName ) ) {return res.send({status:false, msg:"Enter valid Full Name."})}
        if ( !isValid ( logoLink ) ) {return res.send({status:false, msg:"Enter valid LogoLink."})}
        
        
        if (Object.keys(data).length == 0) {
          return res.send({ status: false, msg: "Body should  be not Empty.. " })
      } 

    let saveData = await collegeModel.create(data)
    res.send({status:true, data: saveData})

}

module.exports.createCollege = createCollege