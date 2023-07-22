const validator = require("../../util/createUserValidator")
module.exports = (req, res, next)=>{
    console.log(req.body)
    if(validator(req.body)){
        req.valid = 1
        next()
    }else return res.status(403).json({
        message: "forbidden command."
    })
}