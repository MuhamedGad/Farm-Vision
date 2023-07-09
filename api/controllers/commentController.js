const userModel = require("../models/User")
const postModel = require("../models/Post")
const commentModel = require("../models/Comment")
const commentLikeModel = require("../models/CommentLike")
const commentDisLikeModel = require("../models/CommentDisLike")
const commentImageModel = require("../models/CommentImage")
const fs = require("fs")
const sequelize = require("../models/sequelize")
const { Op } = require("sequelize")

const checkUserLike = async(userId, commentId) => {
    try {
        let userLike = await commentLikeModel.findOne({ where: {
            [Op.and]: [{UserId: userId}, {CommentId: commentId}]
        } })
        if (userLike) {
            return true
        }
        return false
    } catch (err) {
        return false
    }
}

const checkUserDisLike = async(userId, commentId) => {
    try {
        let userDisLike = await commentDisLikeModel.findOne({ where: {
            [Op.and]: [{UserId: userId}, {CommentId: commentId}]
        } })
        if (userDisLike) {
            return true
        }
        return false
    } catch (err) {
        return false
    }
}

const getCommentById = async(req, res)=>{
    try {
        let comment = req.comment,
            token = req.token,
            user = await userModel.findByPk(comment.UserId),
            commentImages = await commentImageModel.findAndCountAll({where:{CommentId: comment.id}}),
            images = []
        for (let j = 0; j < commentImages.count; j++) {
            let image = (commentImages.rows[j].image)?Buffer.from(commentImages.rows[j].image).toString('base64'):commentImages.rows[j].image
            images.push(image)
        }
        let userLike = await checkUserLike(token.UserId, comment.id)
        let userDisLike = await checkUserDisLike(token.UserId, comment.id)
        return res.status(200).json({
            message: "Comment Found :)",
            data: {comment, images},
            user: {userName: user.userName, firstName: user.firstName, lastName: user.lastName},
            userLike,
            userDisLike
        })
    } catch (err) {
        return res.status(500).json({
            message: "Get comment Error: " + err
        })
    }
}

const getCommentsOfPost = async(req, res)=>{
    try{
        let post = req.post,
            token = req.token,
            comments = await commentModel.findAndCountAll({
                where:{PostId:post.id},
                order:[["createdAt", "DESC"]]
            }),
            commentsData = []
        for (let i = 0; i < comments.count; i++) {
            let comment = comments.rows[i],
                user = await userModel.findByPk(comment.UserId),
                commentImages = await commentImageModel.findAndCountAll({where:{CommentId: comment.id}}),
                images = []
            for (let j = 0; j < commentImages.count; j++) {
                let image = (commentImages.rows[j].image)?Buffer.from(commentImages.rows[j].image).toString('base64'):commentImages.rows[j].image
                images.push(image)
            }
            let userLike = await checkUserLike(token.UserId, comment.id)
            let userDisLike = await checkUserDisLike(token.UserId, comment.id)
            commentsData.push({comment, images, user: {userName: user.userName, firstName: user.firstName, lastName: user.lastName}, userLike, userDisLike})
        }
        return res.status(200).json({
            message: "Found Comments :)",
            length: comments.count,
            data: commentsData
        })
    } catch (err) {
        return res.status(500).json({
            message: "Get comments Error: " + err
        })
    }
}

const creatComment = async(req, res)=>{
    try{
        let commentData = {},
            token = req.token,
            parent = (!req.comment)?req.post:req.comment,
            comment,
            files = req.files,
            filesnames = []
        commentData["content"] = req.body.content
        commentData["CommentId"] = (req.post)?null:parent.id
        commentData["PostId"] = (req.post)?parent.id:parent.PostId
        commentData["UserId"] = token.UserId

        if(files){
            files.forEach(e => {
                filesnames.push(e.filename)
            })
        }

        if(req.post) await sequelize.transaction(async (t) => {
            comment = await commentModel.create(commentData, {transaction: t})
            
            await postModel.update({numberOfComments: parent.numberOfComments + 1}, {where: {id: comment.PostId}, transaction: t})

            filesnames.forEach(async e=>{
                let imgsrc = e
                let directoryPath = __dirname.replace("controllers", "public/images/")
                let imageData = fs.readFileSync(directoryPath+imgsrc)
                fs.unlink(directoryPath + imgsrc, (err) => {
                    if (err) return res.status(500).json({
                        message: "Delete logo from server error: " + err
                    })
                })
                await commentImageModel.create({image: imageData, CommentId: comment.id})
            })
        })

        else await sequelize.transaction(async (t) => {
            comment = await commentModel.create(commentData, {transaction: t})

            await commentModel.update({numberOfComments: parent.numberOfComments + 1}, {where: {id: parent.id}, transaction: t})

            let post = await postModel.findByPk(comment.PostId, {transaction: t})
            await postModel.update({numberOfComments: post.numberOfComments + 1}, {where: {id: post.id}, transaction: t})
            filesnames.forEach(async e=>{
                await commentImageModel.create({image: e, CommentId: comment.id})
            })
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

const updateComment = async(req, res)=>{
    let commentData = {},
        comment = req.comment,
        files = req.files,
        filesnames = []
        
    commentData["content"] = req.body.content

    if(files){
        files.forEach(e => {
            filesnames.push(e.filename)
        })
    }

    try{
        await sequelize.transaction(async (t) => {
            // let oldFiles = await  commentImageModel.findAndCountAll({where:{CommentId: comment.id}, transaction: t})
            // for (let i = 0; i < oldFiles.count; i++) {
            //     let directoryPath = __dirname.replace("controllers", "public/images/")
            //     fs.unlink(directoryPath + oldFiles.rows[i].image, (err) => {
            //         if (err) return res.status(500).json({
            //             message: "Delete logo from server error: " + err
            //         })
            //     })
            // }
            await commentImageModel.destroy({where:{CommentId: comment.id}, transaction: t})
            filesnames.forEach(async e=>{
                let imgsrc = e
                let directoryPath = __dirname.replace("controllers", "public/images/")
                let imageData = fs.readFileSync(directoryPath+imgsrc)
                fs.unlink(directoryPath + imgsrc, (err) => {
                    if (err) return res.status(500).json({
                        message: "Delete logo from server error: " + err
                    })
                })
                await commentImageModel.create({image: imageData, CommentId: comment.id}, {transaction: t})
            })
            await commentModel.update(commentData, {where:{id: comment.id}})
        })

        return res.status(200).json({
            message: "Comment updated successfully :)"
        })
    }catch(err){
        return res.status(500).json({
            message: "Update Comment Error: " + err
        })
    }
}

const deleteComment = async(req, res)=>{
    try {
        let comment = req.comment

        if(comment.CommentId) await sequelize.transaction(async (t) => {
            // let oldFiles = await  commentImageModel.findAndCountAll({where:{CommentId: comment.id}, transaction: t})
            // for (let i = 0; i < oldFiles.count; i++) {
            //     let directoryPath = __dirname.replace("controllers", "public/images/")
            //     fs.unlink(directoryPath + oldFiles.rows[i].image, (err) => {
            //         if (err) return res.status(500).json({
            //             message: "Delete logo from server error: " + err
            //         })
            //     })
            // }
            await commentModel.destroy({where: {
                [Op.or]: [{id: comment.id}, {CommentId: comment.id}]
            }, transaction: t})

            let parentComment = await commentModel.findByPk(comment.CommentId, {transaction: t})
            await commentModel.update({numberOfComments: parentComment.numberOfComments - (1*(comment.numberOfComments+1))}, {where: {id: parentComment.id}, transaction: t})

            let post = await postModel.findByPk(comment.PostId)
            await postModel.update({numberOfComments: post.numberOfComments - (1*(comment.numberOfComments+1))}, {where: {id: post.id}, transaction: t})
        })

        else await sequelize.transaction(async (t) => {
            // let oldFiles = await  commentImageModel.findAndCountAll({where:{CommentId: comment.id}, transaction: t})
            // for (let i = 0; i < oldFiles.count; i++) {
            //     let directoryPath = __dirname.replace("controllers", "public/images/")
            //     fs.unlink(directoryPath + oldFiles.rows[i].image, (err) => {
            //         if (err) return res.status(500).json({
            //             message: "Delete logo from server error: " + err
            //         })
            //     })
            // }
            await commentModel.destroy({where: {
                [Op.or]: [{id: comment.id}, {CommentId: comment.id}]
            }, transaction: t})

            let post = await postModel.findByPk(comment.PostId)
            await postModel.update({numberOfComments: post.numberOfComments - (1*(comment.numberOfComments+1))}, {where: {id: post.id}, transaction: t})
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

const like = async(req, res)=>{
    try {
        let token = req.token,
            comment = req.comment,
            liked

            let userDisLike = await checkUserDisLike(token.UserId, comment.id)
            if(userDisLike) {
                await sequelize.transaction(async(t)=>{
                    await commentDisLikeModel.destroy({where: {
                        [Op.and]: [{UserId: token.UserId}, {CommentId: comment.id}]
                    }, transaction: t})
                    await commentModel.update({numberOfDisLikes: comment.numberOfDisLikes-1, points: comment.points+1}, {where:{id: comment.id}, transaction: t})
                })
            }

        await sequelize.transaction(async(t)=>{
            let likeInfo = await commentLikeModel.findOne({where: {
                [Op.and]: [{UserId: token.UserId}, {CommentId: comment.id}]
            }})
            if(likeInfo) {
                await commentLikeModel.destroy({where: {
                    [Op.and]: [{UserId: token.UserId}, {CommentId: comment.id}]
                }, transaction: t})
                await commentModel.update({numberOfLikes: comment.numberOfLikes-1, points: comment.points-1}, {where:{id: comment.id}, transaction: t})
                liked = false
            }else{
                let likeData = {}
                likeData["UserId"] = token.UserId
                likeData["CommentId"] = comment.id
                await commentLikeModel.create(likeData, {transaction: t})
                await commentModel.update({numberOfLikes: comment.numberOfLikes+1, points: comment.points+1}, {where:{id: comment.id}, transaction: t})
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

const disLike = async(req, res)=>{
    try {
        let token = req.token,
            comment = req.comment,
            disLiked

        let userLike = await checkUserLike(token.UserId, comment.id)
        if(userLike) {
            await sequelize.transaction(async(t)=>{
                await commentLikeModel.destroy({where: {
                    [Op.and]: [{UserId: token.UserId}, {CommentId: comment.id}]
                }, transaction: t})
                await commentModel.update({numberOfDisLikes: comment.numberOfDisLikes-1, points: comment.points+1}, {where:{id: comment.id}, transaction: t})
            })
        }
        
        await sequelize.transaction(async(t)=>{
            let disLikeInfo = await commentDisLikeModel.findOne({where: {
                [Op.and]: [{UserId: token.UserId}, {CommentId: comment.id}]
            }})
            if(disLikeInfo) {
                await commentDisLikeModel.destroy({where: {
                    [Op.and]: [{UserId: token.UserId}, {CommentId: comment.id}]
                }, transaction: t})
                await commentModel.update({numberOfDisLikes: comment.numberOfDisLikes-1, points: comment.points+1}, {where:{id: comment.id}, transaction: t})
                disLiked = false
            }else{
                let likeData = {}
                likeData["UserId"] = token.UserId
                likeData["CommentId"] = comment.id
                await commentDisLikeModel.create(likeData, {transaction: t})
                await commentModel.update({numberOfDisLikes: comment.numberOfDisLikes+1, points: comment.points-1}, {where:{id: comment.id}, transaction: t})
                disLiked = true
            }
        })
        return res.status(200).json({
            message: (disLiked)?"disLiked :)":"UndisLiked :(",
            disLiked
        })
    } catch (err) {
        return res.status(500).json({
            message: "Comment disLike Error: " + err
        })
    }
}

module.exports = {
    getCommentById,
    getCommentsOfPost,
    creatComment,
    updateComment,
    deleteComment,
    like,
    disLike
}