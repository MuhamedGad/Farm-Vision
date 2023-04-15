const userModel = require("../../models/User")
const userFeaturesModel = require("../../models/UserFeatures")

module.exports = async (req, res, next) => {
    try {
        let user = await userModel.findByPk(req.params.id)
        if (user === null) return res.status(404).json({
            message: "User Not Found :("
        })
        else {
            req.user = user
            next()
        }
    } catch (err) {
        return res.status(500).json({
            message: "Find User Error: " + err
        })
    }
}