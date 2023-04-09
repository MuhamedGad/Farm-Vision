const tokenModel = require("../models/Token")

module.exports = async(req, res, next)=>{
    try {
        let tokenFound = await tokenModel.findByPk(req.params.id)
        if(tokenFound === null) return res.status(404).json({
            message: "Token Not Found :("
        })
        else {
            req.tokenFound = tokenFound
            next()
        }
    } catch (err) {
        return res.status(500).json({
            message: "Found Token Error: " + err
        })
    }
}