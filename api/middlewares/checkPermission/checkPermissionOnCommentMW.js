const jwt = require("jsonwebtoken")
const config = require("config")
const userModel = require("../../models/User")
const postModel = require("../../models/Post")

module.exports = (req, res, next)=>{
    let token = req.token,
        comment = req.comment
    jwt.verify(token.token, config.get("seckey"), async(err, Decoded)=>{
        if(err) return res.status(500).json({
            message: "JWT verify error: " + err
        })
        else{
            try{
                let commentUser = await userModel.findByPk(comment.UserId)
                let post = await postModel.findByPk(comment.PostId)
                let postUser = await userModel.findByPk(post.UserId)
                if(Decoded.user_id == commentUser.id || Decoded.user_id == postUser.id || (Decoded.role === "admin" && (postUser.role === "farmer" || postUser.role === "engineer") && (commentUser.role === "farmer" || commentUser.role === "engineer")) || (Decoded.role === "superAdmin" && postUser.role !== "superAdmin" && commentUser.role !== "superAdmin")) {
                    req.token.role = Decoded.role
                    next()
                }else return res.status(401).json({
                    message: "Access Denied :("
                })
            }catch(err){
                return res.status(500).json({
                    message: "Find Error: " + err
                })
            }
        }
    })
}