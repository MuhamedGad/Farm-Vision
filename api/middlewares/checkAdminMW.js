const jwt = require("jsonwebtoken")
const config = require("config")

module.exports = (req, res, next)=>{
    let token = req.header("x-auth-token")
    jwt.verify(token, config.get("seckey"), function(err, decoded) {
        if(err) return res.status(500).json({
            message: "JWT verify error: " + err
        })
        else if(decoded.admin == 1) next()
        else return res.status(401).json({
            message: "Access Denied :(",
            token
        })
    });
}