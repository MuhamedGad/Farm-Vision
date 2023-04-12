const featureModel = require("../models/Feature")

let getFeatureById = (req, res)=>{
    let feature = req.feature
    return res.status(200).json({
        message: "Feature Found :)",
        data: feature
    })
}

let getAllFeatures = async (req, res) => {
    try {
        let features = await featureModel.findAndCountAll()
        if (features.length !== 0) return res.status(200).json({
            message: "Found features :)",
            length: features.count,
            data: features.rows
        })
        else return res.status(400).json({
            message: "Not found any features :("
        })
    } catch (err) {
        return res.status(500).json({
            message: "Get All Features Error: " + err
        })
    }
}

let createFeature = async(req, res)=>{
    let featureData = {},
        token = req.token

    featureData["UserId"] = token.UserId
    featureData["feature"] = req.body.feature
    featureData["describtion"] = req.body.describtion
    featureData["price"] = parseInt(req.body.describtion)

    try{
        let checkFeatureFound = await featureModel.findOne({where:{feature:featureData.feature}})
        if (checkFeatureFound !== null) return res.status(400).json({
            message: "Feature is actually exist :("
        })
        
        let feature = await featureModel.create(featureData)
        return res.status(200).json({
            message: "Feature created successfully :)",
            id: feature.id
        })
    }catch(err){
        return res.status(500).json({
            message: "Create Feature Error: " + err
        })
    }
}

let updateFeature = async(req, res)=>{
    let featureData = {}
        feature = req.feature

    featureData["feature"] = req.body.feature || feature.feature
    featureData["describtion"] = req.body.describtion || feature.describtion
    featureData["price"] = parseInt(req.body.price) || feature.price

    try{
        await featureModel.update(featureData, {where:{id:feature.id}})
        return res.status(200).json({
            message: "Feature updated successfully :)"
        })
    }catch(err){
        return res.status(500).json({
            message: "Update Feature Error: " + err
        })
    }
}

let deleteFeature = async(req, res)=>{
    try {
        let feature = req.feature
        await featureModel.destroy({where: { id: feature.id }})
        return res.status(200).json({
            message: "Feature Deleted Successfully :)"
        })
    } catch (err) {
        return res.status(500).json({
            message: "Delete Feature Error: " + err
        })
    }
}

module.exports = {
    getFeatureById,
    getAllFeatures,
    createFeature,
    updateFeature,
    deleteFeature
}