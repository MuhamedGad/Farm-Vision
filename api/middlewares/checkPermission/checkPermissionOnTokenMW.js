const jwt = require("jsonwebtoken")
const config = require("config")

module.exports = (req, res, next)=>{
    let token = req.token,
        tokenFound = req.tokenFound
    jwt.verify(token.token, config.get("seckey"), (err, tokenDecoded)=>{
        if(err) return res.status(500).json({
            message: "JWT verify error: " + err
        })
        else{
            jwt.verify(tokenFound.token, config.get("seckey"), (err, tokenFoundDecoded)=>{
                if(err) return res.status(500).json({
                    message: "JWT verify error: " + err
                })
                else if(tokenDecoded.user_id == tokenFoundDecoded.user_id || (tokenDecoded.role === "admin" && (tokenFoundDecoded.role === "farmer" || tokenFoundDecoded.role === "engineer")) || (tokenDecoded.role === "superAdmin" && tokenFoundDecoded.role !== "superAdmin")) {
                    req.token.role = tokenDecoded.role
                    next()
                }
                else return res.status(401).json({
                    message: "Access Denied."
                })
            })
        }
    });
}