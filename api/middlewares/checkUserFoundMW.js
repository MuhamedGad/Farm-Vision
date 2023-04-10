const userModel = require("../models/User")
const userFeaturesModel = require("../models/UserFeatures")

module.exports = async (req, res, next) => {
    try {
        let user = await userModel.findByPk(req.params.id)
        if (user === null) return res.status(404).json({
            message: "User Not Found :("
        })
        else {
            let features = await userFeaturesModel.findAll({where:{UserId: user.id}})
            let userFeatures = []
            // features = JSON.stringify(features, null, 2)
            // console.log(features)
            features.forEach(e=>{
                userFeatures.push(e.feature)
            })
            // console.log(userFeatures)
            user.features = userFeatures
            req.user = user
            // console.log(req.user.features)
            next()
        }
    } catch (err) {
        return res.status(500).json({
            message: "Found User Error: " + err
        })
    }
}