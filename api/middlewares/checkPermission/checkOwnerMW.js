const jwt = require("jsonwebtoken")
const config = require("config")

module.exports = (req, res, next)=>{
    let token = req.token
    let thing = req.post || req.comment || req.report
    jwt.verify(token.token, config.get("seckey"), function(err, decoded) {
        if(err) return res.status(500).json({
            message: "JWT verify error: " + err
        })
        else if(decoded.user_id == thing.UserId) {
            req.token.role = decoded.role
            next()
        }
        else return res.status(401).json({
            message: "Access Denied."
        })
    });
}