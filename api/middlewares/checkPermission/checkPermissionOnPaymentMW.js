const jwt = require("jsonwebtoken")
const config = require("config")
const userModel = require("../../models/User")

module.exports = (req, res, next)=>{
    let token = req.token,
        payment = req.payment
    jwt.verify(token.token, config.get("seckey"), async(err, Decoded)=>{
        if(err) return res.status(500).json({
            message: "JWT verify error: " + err
        })
        else{
            try{
                let paymentUser = await userModel.findByPk(payment.UserId)
                if(Decoded.user_id == paymentUser.id || (Decoded.role === "admin" && (paymentUser.role === "farmer" || paymentUser.role === "engineer")) || (Decoded.role === "superAdmin" && paymentUser.role !== "superAdmin")) {
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