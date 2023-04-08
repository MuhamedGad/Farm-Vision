const userModel = require("../models/User")

module.exports = async (req, res, next) => {
    let token = req.header("x-auth-token")
    try {
        let user = await userModel.findByPk(req.params.id)
        if (user === null) return res.status(404).json({
            message: "User Not Found :(",
            token
        })
        else {
            req.user = user
            next()
        }
    } catch (err) {
        return res.status(500).json({
            message: "Found User Error: " + err,
            token
        })
    }
}