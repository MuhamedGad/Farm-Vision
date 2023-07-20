const userModel = require("../models/User")
const postModel = require("../models/Post")
const tagModel = require("../models/Tag")
const postLikeModel = require("../models/PostLike")
const postDisLikeModel = require("../models/PostDisLike")
const postTagsModel = require("../models/PostTags")
const postImageModel = require("../models/PostImage")
const fs = require("fs")
const sequelize = require("../models/sequelize")
const { Op } = require("sequelize")

const checkUserLike = async(userId, postId) => {
    try {
        let userLike = await postLikeModel.findOne({ where: {
            [Op.and]: [{UserId: userId}, {PostId: postId}]
        } })
        if (userLike) {
            return true
        }
        return false
    } catch (err) {
        return false
    }
}

const checkUserDisLike = async(userId, postId) => {
    try {
        let userDisLike = await postDisLikeModel.findOne({ where: {
            [Op.and]: [{UserId: userId}, {PostId: postId}]
        } })
        if (userDisLike) {
            return true
        }
        return false
    } catch (err) {
        return false
    }
}

const getPostById = async (req, res) => {
    try {
        let token = req.token,
            post = req.post,
            user = await userModel.findByPk(post.UserId),
            postTags = await postTagsModel.findAndCountAll({where:{PostId: post.id}}),
            postImages = await postImageModel.findAndCountAll({where:{PostId: post.id}}),
            images = [],
            tags = []
        
        for(let i = 0; i < postImages.count; i++){
            let image = (postImages.rows[i].image)?Buffer.from(postImages.rows[i].image).toString('base64'):postImages.rows[i].image
            images.push(image)
        }
        for (let i = 0; i < postTags.count; i++) {
            let tagData = await tagModel.findByPk(postTags.rows[i].TagId)
            tags.push(tagData.tag)
        }

        let userLike = await checkUserLike(token.UserId, post.id)
        let userDisLike = await checkUserDisLike(token.UserId, post.id)

        return res.status(200).json({
            message: "Post Found :)",
            data: {post, images, tags, user: {userName: user.userName, firstName: user.firstName, lastName: user.lastName, role: user.role},userLike, userDisLike}
        })
    } catch (err) {
        return res.status(500).json({
            message: "Get post Error: " + err
        })
    }
}

const getAllPosts = async (req, res) => {
    try {
        let token = req.token,
            posts = await postModel.findAndCountAll({order:[["points", "DESC"]]}),
            postsData = []
        for (let i = 0; i < posts.count; i++) {
            let post = posts.rows[i],
                user = await userModel.findByPk(post.UserId),
                postImages = await postImageModel.findAndCountAll({where:{PostId: post.id}}),
                postTags = await postTagsModel.findAndCountAll({where:{PostId: post.id}}),
                images = [],
                tags = []
            for (let j = 0; j < postImages.count; j++) {
                let image = (postImages.rows[j].image)?Buffer.from(postImages.rows[j].image).toString('base64'):postImages.rows[j].image
                images.push(image)
            }
            for (let k = 0; k < postTags.count; k++) {
                let postTag = postTags.rows[k],
                    tag = await tagModel.findByPk(postTag.TagId)
                tags.push(tag.tag)
            }
            let userLike = await checkUserLike(token.UserId, post.id)
            let userDisLike = await checkUserDisLike(token.UserId, post.id)
            postsData.push({post, images, tags, user: {userName: user.userName, firstName: user.firstName, lastName: user.lastName, role: user.role}, userLike, userDisLike})
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
            token = req.token,
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
                let image = (postImages.rows[j].image)?Buffer.from(postImages.rows[j].image).toString('base64'):postImages.rows[j].image
                images.push(image)
            }
            for (let k = 0; k < postTags.count; k++) {
                let postTag = postTags.rows[k],
                    tag = await tagModel.findByPk(postTag.TagId)
                tags.push(tag.tag)
            }
            let userLike = await checkUserLike(token.UserId, post.id)
            let userDisLike = await checkUserDisLike(token.UserId, post.id)
            postsData.push({post, images, tags, userLike, userDisLike})
        }
        return res.status(200).json({
            message: "Found posts :)",
            length: posts.count,
            data: postsData,
            user:{userName:user.userName, firstName:user.firstName, lastName:user.lastName, role: user.role}
        })
    } catch (err) {
        return res.status(500).json({
            message: "Get posts Error: " + err
        })
    }
}

const getPostsForTag = async(req, res)=>{
    try {
        let token = req.token,
            tag = req.tag,
            postTags = await postTagsModel.findAndCountAll({attributes:['PostId']}, {where:{TagId: tag.id}}),
            posts = [],
            postsData = []

        for (let i = 0; i < postTags.count; i++) {
            let e = postTags.rows[i]
            let post = await postModel.findByPk(e.PostId)
            posts.push(post)
        }

        for (let i = 0; i < posts.length; i++) {
            let post = posts[i],
                user = await userModel.findByPk(post.UserId),
                postImages = await postImageModel.findAndCountAll({where:{PostId: post.id}}),
                postTags = await postTagsModel.findAndCountAll({where:{PostId: post.id}}),
                images = [],
                tags = []
            for (let j = 0; j < postImages.count; j++) {
                let image = (postImages.rows[j].image)?Buffer.from(postImages.rows[j].image).toString('base64'):postImages.rows[j].image
                images.push(image)
            }
            for (let k = 0; k < postTags.count; k++) {
                let postTag = postTags.rows[k],
                    tag = await tagModel.findByPk(postTag.TagId)
                tags.push(tag.tag)
            }
            let userLike = await checkUserLike(token.UserId, post.id)
            let userDisLike = await checkUserDisLike(token.UserId, post.id)
            postsData.push({post, images, tags, user: {userName: user.userName, firstName: user.firstName, lastName: user.lastName, role: user.role}, userLike, userDisLike})
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
                let imgsrc = filesnames[j]
                let directoryPath = __dirname.replace("controllers", "public/images/")
                let imageData = fs.readFileSync(directoryPath+imgsrc)
                await postImageModel.create({image: imageData, PostId: post.id}, {transaction: t})
                fs.unlink(directoryPath + imgsrc, (err) => {
                    if (err) return res.status(500).json({
                        message: "Delete logo from server error: " + err
                    })
                })
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

            await postImageModel.destroy({where:{PostId: post.id}, transaction: t})

            filesnames.forEach(async e=>{
                let imgsrc = e
                let directoryPath = __dirname.replace("controllers", "public/images/")
                let imageData = fs.readFileSync(directoryPath+imgsrc)
                fs.unlink(directoryPath + imgsrc, (err) => {
                    if (err) return res.status(500).json({
                        message: "Delete logo from server error: " + err
                    })
                })
                await postImageModel.create({image: imageData, PostId: post.id}, {transaction: t})
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
        
        let userDisLike = await checkUserDisLike(token.UserId, post.id)
        if(userDisLike) {
            await sequelize.transaction(async(t)=>{
                await postDisLikeModel.destroy({where: {
                    [Op.and]: [{UserId: token.UserId}, {PostId: post.id}]
                }, transaction: t})
                await postModel.update({numberOfDisLikes: post.numberOfDisLikes-1, points: post.points+1}, {where:{id: post.id}, transaction: t})
            })
        }

        await sequelize.transaction(async(t)=>{
            let likeInfo = await checkUserLike(token.UserId, post.id)
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

        let userLike = await checkUserLike(token.UserId, post.id)
        if(userLike) {
            await sequelize.transaction(async(t)=>{
                await postLikeModel.destroy({where: {
                    [Op.and]: [{UserId: token.UserId}, {PostId: post.id}]
                }, transaction: t})
                await postModel.update({numberOfLikes: post.numberOfLikes-1, points: post.points-1}, {where:{id: post.id}, transaction: t})
            })
        }

        await sequelize.transaction(async(t)=>{
            let dislikeInfo = await checkUserDisLike(token.UserId, post.id)
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