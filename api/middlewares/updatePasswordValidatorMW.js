const updateValidator = require("../util/updatePasswordValidator")
const resetValidator = require("../util/resetPasswordValidator")
module.exports = (req, res, next)=>{
    let token = req.token,
        user = req.user

    if(token.UserId === user.id){
        if(updateValidator(req.body)){
            req.valid = 1
            next()
        }else return res.status(403).json({
            message: "forbidden command",
        })
    }else{
        if(resetValidator(req.body)){
            req.valid = 1
            next()
        }else return res.status(403).json({
            message: "forbidden command",
        })
    }
}