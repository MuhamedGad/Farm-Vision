const bcrypt = require("bcrypt")
module.exports = (req, res, next)=>{
    let saltRounds = 10
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err) return res.status(500).json({
            message: "bcrypt generate salt error: " + err
        })
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            if(err) return res.status(500).json({
                message: "bcrypt hash error: " + err
            })
            req.body.password = hash
            next()
        });
    });
}