const jwt = require("jsonwebtoken")
const config = require("config")

module.exports = (req, res, next)=>{
    let token = req.header("x-auth-token")
    jwt.verify(token, config.get("seckey"), function(err, decoded) {
        if(err) return res.status(500).json({
            message: "JWT verify error: " + err
        })
        else if(decoded.user_id == req.params.id || decoded.admin === true) {
            if(decoded.admin === true) req.admin = true
            next()
        }
        else return res.status(401).json({
            message: "Access Denied :(",
            token
        })
    });
}