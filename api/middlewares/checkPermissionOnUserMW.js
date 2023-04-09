const jwt = require("jsonwebtoken")
const config = require("config")

module.exports = (req, res, next)=>{
    let token = req.token,
        user = req.user
    jwt.verify(token.token, config.get("seckey"), function(err, decoded) {
        if(err) return res.status(500).json({
            message: "JWT verify error: " + err
        })
        else if(decoded.user_id == user.id || (decoded.role === "admin" && (user.role === "farmer" || user.role === "engineer")) || (decoded.role === "superAdmin" && user.role !== "superAdmin")) {
            req.token.role = decoded.role
            next()
        }
        else return res.status(401).json({
            message: "Access Denied :("
        })
    });
}