const validator = require("../util/updatePasswordValidator")
const adminvalidator = require("../util/updatePasswordForAdminValidator")
module.exports = (req, res, next)=>{
    if(req.admin){
        if(adminvalidator(req.body)){
            req.valid = 1
            next()
        }else return res.status(403).json({
            message: "forbidden command",
            token: req.header("x-auth-token"),
        })
    }else{
        if(validator(req.body)){
            req.valid = 1
            next()
        }else return res.status(403).json({
            message: "forbidden command",
            token: req.header("x-auth-token"),
        })
    }
}