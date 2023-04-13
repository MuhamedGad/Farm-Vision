const postModel = require("../models/Post")
const postLikeModel = require("../models/PostLike")
const postDisLikeModel = require("../models/PostDisLike")
const postTagsModel = require("../models/PostTags")
const tagModel = require("../models/Tag")
const sequelize = require("../models/sequelize")
const { Op } = require("sequelize")

let getPostById = async (req, res) => {
    let post = req.post
    return res.status(200).json({
        message: "Post Found :)",
        data: post
    })
}

let getAllPosts = async (req, res) => {
    try {
        let posts = await postModel.findAndCountAll({order:[["points", "DESC"]]})
        if (posts.length !== 0) return res.status(200).json({
            message: "Found posts :)",
            length: posts.count,
            data: posts.rows
        })
        else return res.status(400).json({
            message: "Not found any posts :("
        })
    } catch (err) {
        return res.status(500).json({
            message: "Get All Posts Error: " + err
        })
    }
}

let getPostsForUser = async(req, res)=>{
    try {
        let user = req.user,
            posts = await postModel.findAndCountAll({
                where:{UserId:user.id},
                order:[["points", "DESC"]]
            })
        if (posts.length !== 0) return res.status(200).json({
            message: "Found posts :)",
            length: posts.count,
            data: posts.rows
        })
        else return res.status(400).json({
            message: "Not found any posts :("
        })
    } catch (err) {
        return res.status(500).json({
            message: "Get posts Error: " + err
        })
    }
}

let createPost = async(req, res)=>{
    let postData = {},
        token = req.token,
        tags = req.tags,
        post
    postData["content"] = req.body.content
    postData["UserId"] = token.UserId
    try{
        await sequelize.transaction(async (t) => {
            post = await postModel.create(postData, { transaction: t })
            for (let i = 0; i < tags.length; i++) {
                await postTagsModel.create({TagId: tags[i].id, PostId: post.id}, { transaction: t })
                await tagModel.update({numberOfPosts: tags[i].numberOfPosts + 1}, {where:{id: tags[i].id}, transaction: t})
            }
        })

        return res.status(200).json({
            message: "Post created successfully :)",
            id: post.id
        })
    }catch(err){
        return res.status(500).json({
            message: "Create Post Error: " + err
        })
    }
}

let updatePost = async(req, res)=>{
    let postData = {},
        post = req.post,
        tags = req.tags
    postData["content"] = req.body.content
    try{
        await sequelize.transaction(async (t) => {
            let postTags = await postTagsModel.findAll({where:{PostId: post.id}, transaction: t})
            for (let i = 0; i < postTags.length; i++) {
                let tag = await tagModel.findOne({where: {id: postTags[i].TagId}, transaction: t})
                await tagModel.update({numberOfPosts: tag.numberOfPosts - 1}, {where: {id: tag.id}, transaction: t})
            }
            await postTagsModel.destroy({ where: { PostId: post.id }, transaction: t })
            for (let i = 0; i < tags.length; i++) {
                let postTag = await postTagsModel.create({TagId: tags[i].id, PostId: post.id}, { transaction: t })
                let tag = await tagModel.findOne({where: {id: tags[i].id}, transaction: t})
                await tagModel.update({numberOfPosts: tag.numberOfPosts + 1}, {where:{id: tags[i].id}, transaction: t})
            }
            // console.log(postData)
            await postModel.update(postData, {where:{id:post.id}, transaction: t})
        })
        
        return res.status(200).json({
            message: "Post updated successfully :)"
        })
    }catch(err){
        return res.status(500).json({
            message: "Update Post Error: " + err
        })
    }
}

let deletePost = async(req, res)=>{
    try {
        let post = req.post
        await sequelize.transaction(async (t) => {
            let postTags = await postTagsModel.findAll({where:{PostId: post.id}, transaction: t})
            for (let i = 0; i < postTags.length; i++) {
                let tag = await tagModel.findOne({where: {id: postTags[i].TagId}, transaction: t})
                await tagModel.update({numberOfPosts: tag.numberOfPosts-1}, {where:{id:tag.id}, transaction: t})
            }
            await postModel.destroy({where: { id: post.id }, transaction: t})
        })
        return res.status(200).json({
            message: "Post Deleted Successfully :)"
        })
    } catch (err) {
        return res.status(500).json({
            message: "Delete Post Error: " + err
        })
    }
}

let like = async(req, res)=>{
    try {
        let token = req.token,
            post = req.post,
            liked
        await sequelize.transaction(async(t)=>{
            let likeInfo = await postLikeModel.findOne({where: {
                [Op.and]: [{UserId: token.UserId}, {PostId: post.id}]
            }})
            if(likeInfo) {
                await postLikeModel.destroy({where: {
                    [Op.and]: [{UserId: token.UserId}, {PostId: post.id}]
                }, transaction: t})
                await postModel.update({numberOfLikes: post.numberOfLikes-1, points: post.points-1}, {where:{id: post.id}, transaction: t})
                liked = false
            }else{
                let likeData = {}
                likeData["UserId"] = token.UserId
                likeData["PostId"] = post.id
                await postLikeModel.create(likeData, {transaction: t})
                await postModel.update({numberOfLikes: post.numberOfLikes+1, points: post.points+1}, {where:{id: post.id}, transaction: t})
                liked = true
            }
        })
        return res.status(200).json({
            message: (liked)?"Liked :)":"Unliked :(",
            liked
        })
    } catch (err) {
        return res.status(500).json({
            message: "Post like Error: " + err
        })
    }
}

let disLike = async(req, res)=>{
    try {
        let token = req.token,
            post = req.post,
            disLiked
        await sequelize.transaction(async(t)=>{
            let dislikeInfo = await postDisLikeModel.findOne({where: {
                [Op.and]: [{UserId: token.UserId}, {PostId: post.id}]
            }})
            if(dislikeInfo) {
                await postDisLikeModel.destroy({where: {
                    [Op.and]: [{UserId: token.UserId}, {PostId: post.id}]
                }, transaction: t})
                await postModel.update({numberOfDisLikes: post.numberOfDisLikes-1, points: post.points+1}, {where:{id: post.id}, transaction: t})
                disLiked = false
            }else{
                let disLikeData = {}
                disLikeData["UserId"] = token.UserId
                disLikeData["PostId"] = post.id
                await postDisLikeModel.create(disLikeData, {transaction: t})
                await postModel.update({numberOfDisLikes: post.numberOfDisLikes+1, points: post.points-1}, {where:{id: post.id}, transaction: t})
                disLiked = true
            }
        })
        return res.status(200).json({
            message: (disLiked)?"DisLiked :)":"UnDisLiked :(",
            disLiked
        })
    } catch (err) {
        return res.status(500).json({
            message: "Post dislike Error: " + err
        })
    }
}

module.exports = {
    getPostById,
    getAllPosts,
    getPostsForUser,
    createPost,
    updatePost,
    deletePost,
    like,
    disLike
}