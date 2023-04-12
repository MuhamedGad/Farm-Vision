const tagModel = require("../models/Tag")

module.exports = async (req, res, next) => {
    try {
        let tag = await tagModel.findByPk(req.params.id)
        if (tag === null) return res.status(404).json({
            message: "Tag Not Found :("
        })
        else {
            req.tag = tag
            next()
        }
    } catch (err) {
        return res.status(500).json({
            message: "Find Tag Error: " + err
        })
    }
}