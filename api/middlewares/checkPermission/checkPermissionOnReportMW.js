const jwt = require("jsonwebtoken")
const config = require("config")
const userModel = require("../../models/User")

module.exports = (req, res, next)=>{
    let token = req.token,
        report = req.report
    jwt.verify(token.token, config.get("seckey"), async(err, Decoded)=>{
        if(err) return res.status(500).json({
            message: "JWT verify error: " + err
        })
        else{
            try{
                let reportUser = await userModel.findByPk(report.UserId)
                if(Decoded.user_id == reportUser.id || (Decoded.role === "admin" && (reportUser.role === "farmer" || reportUser.role === "engineer")) || (Decoded.role === "superAdmin" && reportUser.role !== "superAdmin")) {
                    req.token.role = Decoded.role
                    next()
                }else return res.status(401).json({
                    message: "Access Denied."
                })
            }catch(err){
                return res.status(500).json({
                    message: "Find Error: " + err
                })
            }
        }
    })
}