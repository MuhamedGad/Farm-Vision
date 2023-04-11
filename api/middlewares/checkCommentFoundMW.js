const commentModel = require("../models/Comment")

module.exports = async(req, res, next)=>{
    try {
        let comment = await commentModel.findByPk(req.params.id)
        if(comment === null) return res.status(404).json({
            message: "Comment Not Found :("
        })
        else {
            req.comment = comment
            next()
        }
    } catch (err) {
        return res.status(500).json({
            message: "Find Comment Error: " + err
        })
    }
}