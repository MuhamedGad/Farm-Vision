const jwt = require("jsonwebtoken")
const config = require("config")
const userModel = require("../models/User")

module.exports = (req, res, next)=>{
    let token = req.token,
        post = req.post
    jwt.verify(token.token, config.get("seckey"), async(err, Decoded)=>{
        if(err) return res.status(500).json({
            message: "JWT verify error: " + err
        })
        else{
            try{
                let user = await userModel.findByPk(post.UserId)
                if(Decoded.user_id == user.id || (Decoded.role === "admin" && (user.role === "farmer" || user.role === "engineer")) || (Decoded.role === "superAdmin" && user.role !== "superAdmin")) {
                    req.token.role = Decoded.role
                    next()
                }else return res.status(401).json({
                    message: "Access Denied :("
                })
            }catch(err){
                return res.status(500).json({
                    message: "Find User Error: " + err
                })
            }
        }
    })
}