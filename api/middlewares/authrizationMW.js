const tokenModel = require("../models/Token")

module.exports = async (req, res, next) => {
    let token = req.header("x-auth-token")
    if (!token) return res.status(401).json({
        message: "Please signin or register..!"
    })

    try {
        let tokenFromDataBase = await tokenModel.findOne({ where: { token: token } })
        if (tokenFromDataBase === null) return res.status(404).json({
            message: "Invalid Token :("
        })
        else {
            req.token = tokenFromDataBase
            next()
        }
    } catch (err) {
        return res.status(500).json({
            message: "Authrization error: " + err
        })
    }
}