const jwt = require("jsonwebtoken")
const config = require("config")

module.exports = (req, res, next)=>{
    let token = req.token
    jwt.verify(token.token, config.get("seckey"), function(err, decoded) {
        if(err) return res.status(500).json({
            message: "JWT verify error: " + err
        })
        else if(decoded.role == "admin" || decoded.role == "superAdmin") {
            req.token.role = decoded.role
            next()
        }
        else return res.status(401).json({
            message: "Access Denied :("
        })
    });
}