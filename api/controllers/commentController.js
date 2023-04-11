const commentModel = require("../models/Comment")
const postModel = require("../models/Post")
const commentLikeModel = require("../models/CommentLike")
const sequelize = require("../models/sequelize")
const { Op } = require("sequelize")

let getCommentById = (req, res)=>{
    let comment = req.comment
    return res.status(200).json({
        message: "Comment Found :)",
        data: comment
    })
}

let getCommentsOfPost = async(req, res)=>{
    try{
        let post = req.post,
            comments = await commentModel.findAndCountAll({
                where:{PostId:post.id},
                order:[["createdAt", "DESC"]]
            })
        if (comments.length !== 0) return res.status(200).json({
            message: "Found Comments :)",
            length: comments.count,
            data: comments.rows
        })
        else return res.status(400).json({
            message: "Not found any comments :("
        })
    } catch (err) {
        return res.status(500).json({
            message: "Get comments Error: " + err
        })
    }
}

let creatComment = async(req, res)=>{
    try{
        let commentData = {},
            token = req.token,
            parent = (req.post)?req.post:req.comment,
            comment

        commentData["content"] = req.body.content
        commentData["CommentId"] = (req.post)?null:parent.id
        commentData["PostId"] = (req.post)?parent.id:parent.PostId
        commentData["UserId"] = token.UserId

        if(req.post) await sequelize.transaction(async (t) => {
            comment = await commentModel.create(commentData, {transaction: t})
            
            await postModel.update({numberOfComments: parent.numberOfComments + 1, points: parent.points + 5}, {where: {id: comment.PostId}, transaction: t})
        })

        else await sequelize.transaction(async (t) => {
            comment = await commentModel.create(commentData, {transaction: t})

            await commentModel.update({numberOfComments: parent.numberOfComments + 1}, {where: {id: parent.id}, transaction: t})

            let post = await postModel.findByPk(comment.PostId, {transaction: t})
            await postModel.update({numberOfComments: post.numberOfComments + 1, points: post.points + 5}, {where: {id: post.id}, transaction: t})
        })

        return res.status(200).json({
            message: "Comment created successfully :)",
            id: comment.id
        })
    }catch(err){
        return res.status(500).json({
            message: "Create Comment Error: " + err
        })
    }
}

let updateComment = async(req, res)=>{
    let commentData = {},
        comment = req.comment
    
    commentData["content"] = req.body.content
    try{
        await commentModel.update(commentData, {where:{id: comment.id}})
        return res.status(200).json({
            message: "Comment updated successfully :)"
        })
    }catch(err){
        return res.status(500).json({
            message: "Update Comment Error: " + err
        })
    }
}

let deleteComment = async(req, res)=>{
    try {
        let comment = req.comment

        if(comment.CommentId) await sequelize.transaction(async (t) => {
            await commentModel.destroy({where: {
                [Op.or]: [{id: comment.id}, {CommentId: comment.id}]
            }, transaction: t})

            let parentComment = await commentModel.findByPk(comment.CommentId, {transaction: t})
            await commentModel.update({numberOfComments: parentComment.numberOfComments - (1*(comment.numberOfComments+1))}, {where: {id: parentComment.id}, transaction: t})

            let post = await postModel.findByPk(comment.PostId)
            await postModel.update({numberOfComments: post.numberOfComments - (1*(comment.numberOfComments+1)), points: post.points - (5*(comment.numberOfComments+1))}, {where: {id: post.id}, transaction: t})
        })

        else await sequelize.transaction(async (t) => {
            await commentModel.destroy({where: {
                [Op.or]: [{id: comment.id}, {CommentId: comment.id}]
            }, transaction: t})

            let post = await postModel.findByPk(comment.PostId)
            await postModel.update({numberOfComments: post.numberOfComments - (1*(comment.numberOfComments+1)), points: post.points - (5*(comment.numberOfComments+1))}, {where: {id: post.id}, transaction: t})
        })
        
        return res.status(200).json({
            message: "Comment Deleted Successfully :)"
        })
    } catch (err) {
        return res.status(500).json({
            message: "Delete Comment Error: " + err
        })
    }
}

let like = async(req, res)=>{
    try {
        let token = req.token,
            comment = req.comment,
            liked
        await sequelize.transaction(async(t)=>{
            let likeInfo = await commentLikeModel.findOne({where: {
                [Op.and]: [{UserId: token.UserId}, {CommentId: comment.id}]
            }})
            if(likeInfo) {
                await commentLikeModel.destroy({where: {
                    [Op.and]: [{UserId: token.UserId}, {CommentId: comment.id}]
                }, transaction: t})
                await commentModel.update({numberOfLikes: comment.numberOfLikes-1}, {where:{id: comment.id}, transaction: t})
                liked = false
            }else{
                let likeData = {}
                likeData["UserId"] = token.UserId
                likeData["CommentId"] = comment.id
                await commentLikeModel.create(likeData, {transaction: t})
                await commentModel.update({numberOfLikes: comment.numberOfLikes+1}, {where:{id: comment.id}, transaction: t})
                liked = true
            }
        })
        return res.status(200).json({
            message: (liked)?"Liked :)":"Unliked :(",
            liked
        })
    } catch (err) {
        return res.status(500).json({
            message: "Comment like Error: " + err
        })
    }
}

module.exports = {
    getCommentById,
    getCommentsOfPost,
    creatComment,
    updateComment,
    deleteComment,
    like
}