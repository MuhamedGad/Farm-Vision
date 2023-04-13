const postModel = require("../../models/Post")

module.exports = async(req, res, next)=>{
    try {
        let post = await postModel.findByPk(req.params.id)
        if(post === null) return res.status(404).json({
            message: "Post Not Found :("
        })
        else {
            req.post = post
            next()
        }
    } catch (err) {
        return res.status(500).json({
            message: "Find Post Error: " + err
        })
    }
}