const tagModel = require("../models/Tag")
const { Op } = require("sequelize")

const getTagById = (req, res)=>{
    let tag = req.tag
    return res.status(200).json({
        message: "Tag Found :)",
        data: tag
    })
}

const getAllTags = async (req, res) => {
    try {
        let tags = await tagModel.findAndCountAll({where:{isAccepted: true}, order:[["numberOfPosts", "DESC"]]})
        return res.status(200).json({
            message: "Found tags :)",
            length: tags.count,
            data: tags.rows
        })
    } catch (err) {
        return res.status(500).json({
            message: "Get All Tags Error: " + err
        })
    }
}

const createTag = async(req, res)=>{
    let tagData = {},
        token = req.token

    tagData["UserId"] = token.UserId
    tagData["tag"] = req.body.tag
    tagData["describtion"] = req.body.describtion
    tagData["isAccepted"] = true

    try{
        let checkTag = await tagModel.findOne({where:{tag:tagData.tag}})
        if(checkTag) return res.status(400).json({message: "Tag already exists :("})

        let tag = await tagModel.create(tagData)
        return res.status(200).json({
            message: "Tag created successfully :)",
            id: tag.id
        })
    }catch(err){
        return res.status(500).json({
            message: "Create Tag Error: " + err
        })
    }
}

const updateTag = async(req, res)=>{
    let tagData = {}
        tag = req.tag

    tagData["tag"] = req.body.tag || tag.tag
    tagData["describtion"] = req.body.describtion || tag.describtion

    try{
        let checkTag = await tagModel.findOne({where:{
            [Op.and]: [{tag: tagData.tag}, {id: {[Op.not]: tag.id}}]
        }})
        if(checkTag) return res.status(400).json({message: "Tag already exists :("})
        
        await tagModel.update(tagData, {where:{id:tag.id}})
        return res.status(200).json({
            message: "Tag updated successfully :)"
        })
    }catch(err){
        return res.status(500).json({
            message: "Update Tag Error: " + err
        })
    }
}

const deleteTag = async(req, res)=>{
    try {
        let tag = req.tag
        await tagModel.destroy({where: { id: tag.id }})
        return res.status(200).json({
            message: "Tag Deleted Successfully :)"
        })
    } catch (err) {
        return res.status(500).json({
            message: "Delete Tag Error: " + err
        })
    }
}

const addTagRequest = async(req, res)=>{
    let tagData = {},
        token = req.token

    tagData["UserId"] = token.UserId
    tagData["tag"] = req.body.tag
    tagData["describtion"] = req.body.describtion
    tagData["isAccepted"] = false

    try{
        let tag = await tagModel.create(tagData)
        return res.status(200).json({
            message: "Tag requested successfully :)",
            id: tag.id
        })
    }catch(err){
        return res.status(500).json({
            message: "Request Tag Error: " + err
        })
    }
}

const getTagRequests = async(req, res)=>{
    try {
        let tags = await tagModel.findAndCountAll({where:{isAccepted:false}})
        return res.status(200).json({
            message: "Found tag requests :)",
            length: tags.count,
            data: tags.rows
        })
    } catch (err) {
        return res.status(500).json({
            message: "Get Tag Requests Error: " + err
        })
    }
}

const acceptTagRequest = async(req, res)=>{
    let tagData = {},
        tag = req.tag

    tagData["isAccepted"] = true

    try{
        await tagModel.update(tagData, {where:{id:tag.id}})
        return res.status(200).json({
            message: "Tag accepted successfully :)"
        })
    }catch(err){
        return res.status(500).json({
            message: "Accept Tag Error: " + err
        })
    }
}

const rejectTagRequest = async(req, res)=>{
    try {
        let tag = req.tag
        await tagModel.destroy({where: { id: tag.id }})
        return res.status(200).json({
            message: "Tag request rejected successfully :)"
        })
    } catch (err) {
        return res.status(500).json({
            message: "Reject Tag Error: " + err
        })
    }
}

module.exports = {
    getTagById,
    getAllTags,
    createTag,
    updateTag,
    deleteTag,
    addTagRequest,
    getTagRequests,
    acceptTagRequest,
    rejectTagRequest
}