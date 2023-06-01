const postModel = require("../models/Post")
const commentModel = require("../models/Comment")
const tagModel = require("../models/Tag")
const postLikeModel = require("../models/PostLike")
const postDisLikeModel = require("../models/PostDisLike")
const postTagsModel = require("../models/PostTags")
const postImageModel = require("../models/PostImage")
const commentImageModel = require("../models/CommentImage")
const fs = require("fs")
const sequelize = require("../models/sequelize")
const { Op } = require("sequelize")

const getPostById = async (req, res) => {
    try {
        let post = req.post,
            postTags = await postTagsModel.findAndCountAll({where:{PostId: post.id}}),
            postImages = await postImageModel.findAndCountAll({where:{PostId: post.id}}),
            images = [],
            tags = []
        postImages.rows.forEach(e=>{
            images.push(e.image)
        })
        for (let i = 0; i < postTags.count; i++) {
            let tagData = await tagModel.findByPk(postTags.rows[i].TagId)
            tags.push(tagData.tag)
        }

        return res.status(200).json({
            message: "Post Found :)",
            data: {post, images, tags}
        })
    } catch (err) {
        return res.status(500).json({
            message: "Get post Error: " + err
        })
    }
}

const getAllPosts = async (req, res) => {
    try {
        let posts = await postModel.findAndCountAll({order:[["points", "DESC"]]}),
            postsData = []
        for (let i = 0; i < posts.count; i++) {
            let post = posts.rows[i],
                postImages = await postImageModel.findAndCountAll({where:{PostId: post.id}}),
                postTags = await postTagsModel.findAndCountAll({where:{PostId: post.id}}),
                images = [],
                tags = []
            for (let j = 0; j < postImages.count; j++) {
                images.push(postImages.rows[j].image)
            }
            for (let k = 0; k < postTags.count; k++) {
                let postTag = postTags.rows[k],
                    tag = await tagModel.findByPk(postTag.TagId)
                tags.push(tag.tag)
            }
            postsData.push({post, images, tags})
        }
        return res.status(200).json({
            message: "Found posts :)",
            length: posts.count,
            data: postsData
        })
    } catch (err) {
        return res.status(500).json({
            message: "Get All Posts Error: " + err
        })
    }
}

const getPostsForUser = async(req, res)=>{
    try {
        let user = req.user,
            posts = await postModel.findAndCountAll({
                where:{UserId:user.id},
                order:[["points", "DESC"]]
            }),
            postsData = []
        
        for (let i = 0; i < posts.count; i++) {
            let post = posts.rows[i],
                postImages = await postImageModel.findAndCountAll({where:{PostId: post.id}}),
                postTags = await postTagsModel.findAndCountAll({where:{PostId: post.id}}),
                images = [],
                tags = []
            for (let j = 0; j < postImages.count; j++) {
                images.push(postImages.rows[j].image)
            }
            for (let k = 0; k < postTags.count; k++) {
                let postTag = postTags.rows[k],
                    tag = await tagModel.findByPk(postTag.TagId)
                tags.push(tag.tag)
            }
            postsData.push({post, images, tags})
        }
        return res.status(200).json({
            message: "Found posts :)",
            length: posts.count,
            data: postsData
        })
    } catch (err) {
        return res.status(500).json({
            message: "Get posts Error: " + err
        })
    }
}

const getPostsForTag = async(req, res)=>{
    try {
        let tag = req.tag,
            postTags = await postTagsModel.findAndCountAll({attributes:['PostId']}, {where:{TagId: tag.id}}),
            posts = [],
            postsData = []

        for (let i = 0; i < postTags.count; i++) {
            let e = postTags.rows[i]
            let post = await postModel.findByPk(e.PostId)
            posts.push(post)
        }
        console.log(posts[0].id)

        for (let i = 0; i < posts.length; i++) {
            let post = posts[i],
                postImages = await postImageModel.findAndCountAll({where:{PostId: post.id}}),
                postTags = await postTagsModel.findAndCountAll({where:{PostId: post.id}}),
                images = [],
                tags = []
            for (let j = 0; j < postImages.count; j++) {
                images.push(postImages.rows[j].image)
            }
            for (let k = 0; k < postTags.count; k++) {
                let postTag = postTags.rows[k],
                    tag = await tagModel.findByPk(postTag.TagId)
                tags.push(tag.tag)
            }
            postsData.push({post, images, tags})
        }
        return res.status(200).json({
            message: "Found posts :)",
            length: posts.length,
            data: postsData
        })
    } catch (err) {
        return res.status(500).json({
            message: "Get posts Error: " + err
        })
    }
}

const createPost = async(req, res)=>{
    let postData = {},
        token = req.token,
        tags = req.tags,
        files = req.files,
        filesnames = [],
        post

    postData["content"] = req.body.content
    postData["UserId"] = token.UserId
    if(files){
        files.forEach(e => {
            filesnames.push(e.filename)
        })
    }

    try{
        await sequelize.transaction(async (t) => {
            post = await postModel.create(postData, { transaction: t })
            for (let i = 0; i < tags.length; i++) {
                await postTagsModel.create({TagId: tags[i].id, PostId: post.id}, { transaction: t })
                await tagModel.update({numberOfPosts: tags[i].numberOfPosts + 1}, {where:{id: tags[i].id}, transaction: t})
            }
            for (let j = 0; j < filesnames.length; j++) {
                await postImageModel.create({image: filesnames[j], PostId: post.id})
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

const updatePost = async(req, res)=>{
    let postData = {},
        post = req.post,
        tags = req.tags,
        files = req.files,
        filesnames = []

    postData["content"] = req.body.content
    if(files){
        files.forEach(e => {
            filesnames.push(e.filename)
        })
    }

    try{
        await sequelize.transaction(async (t) => {
            let postTags = await postTagsModel.findAll({where:{PostId: post.id}, transaction: t})
            for (let i = 0; i < postTags.length; i++) {
                let tag = await tagModel.findOne({where: {id: postTags[i].TagId}, transaction: t})
                await tagModel.update({numberOfPosts: tag.numberOfPosts - 1}, {where: {id: tag.id}, transaction: t})
            }
            await postTagsModel.destroy({ where: { PostId: post.id }, transaction: t })

            for (let i = 0; i < tags.length; i++) {
                await postTagsModel.create({TagId: tags[i].id, PostId: post.id}, { transaction: t })
                let tag = await tagModel.findOne({where: {id: tags[i].id}, transaction: t})
                await tagModel.update({numberOfPosts: tag.numberOfPosts + 1}, {where:{id: tags[i].id}, transaction: t})
            }

            let oldFiles = await  postImageModel.findAndCountAll({where:{PostId: post.id}, transaction: t})
            for (let i = 0; i < oldFiles.count; i++) {
                let directoryPath = __dirname.replace("controllers", "public/images/")
                fs.unlink(directoryPath + oldFiles.rows[i].image, (err) => {
                    if (err) return res.status(500).json({
                        message: "Delete logo from server error: " + err
                    })
                })
            }
            await postImageModel.destroy({where:{PostId: post.id}, transaction: t})

            filesnames.forEach(async e=>{
                await postImageModel.create({image: e, PostId: post.id}, {transaction: t})
            })
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

const deletePost = async(req, res)=>{
    try {
        let post = req.post
        await sequelize.transaction(async (t) => {
            let postTags = await postTagsModel.findAll({where:{PostId: post.id}, transaction: t})
            for (let i = 0; i < postTags.length; i++) {
                let tag = await tagModel.findOne({where: {id: postTags[i].TagId}, transaction: t})
                await tagModel.update({numberOfPosts: tag.numberOfPosts-1}, {where:{id:tag.id}, transaction: t})
            }

            let oldFilesOfPost = await postImageModel.findAndCountAll({where:{PostId: post.id}, transaction: t})
            let comments = await  commentModel.findAndCountAll({where:{PostId: post.id}, transaction: t}),
                oldFilesOfComment = []
            for (let i = 0; i < comments.count; i++) {
                let comment = comments.rows[i]
                let commentImages = await  commentImageModel.findAndCountAll({where:{CommentId: comment.id}, transaction: t})
                oldFilesOfComment.push(...commentImages.rows)
            }
            let oldFiles = [...oldFilesOfPost.rows, ...oldFilesOfComment]
            for (let i = 0; i < oldFiles.length; i++) {
                let directoryPath = __dirname.replace("controllers", "public/images/")
                fs.unlink(directoryPath + oldFiles[i].image, (err) => {
                    if (err) return res.status(500).json({
                        message: "Delete logo from server error: " + err
                    })
                })
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

const like = async(req, res)=>{
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

const disLike = async(req, res)=>{
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
    getPostsForTag,
    createPost,
    updatePost,
    deletePost,
    like,
    disLike
}