const postModel = require("../models/Post")

let getPostByID = async (req, res) => {
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
        token = req.token
    postData["content"] = req.body.content
    postData["UserId"] = token.UserId
    try{
        let post = await postModel.create(postData)
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
        post = req.post
    postData["content"] = req.body.content
    try{
        await postModel.update(postData, {where:{id:post.id}})
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
        await postModel.destroy({where: { id: post.id }})
        return res.status(200).json({
            message: "Post Deleted Successfully :)"
        })
    } catch (err) {
        return res.status(500).json({
            message: "Delete Post Error: " + err
        })
    }
}

module.exports = {
    getPostByID,
    getAllPosts,
    getPostsForUser,
    createPost,
    updatePost,
    deletePost
}