const featureModel = require("../../models/Feature")

module.exports = async (req, res, next) => {
    try {
        let feature = await featureModel.findByPk(req.params.id)
        if (feature === null) return res.status(404).json({
            message: "Feature Not Found."
        })
        else {
            req.feature = feature
            next()
        }
    } catch (err) {
        return res.status(500).json({
            message: "Find Feature Error: " + err
        })
    }
}