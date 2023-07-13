const userModel = require("../models/User")
const featureModel = require("../models/Feature")
const userFeatureModel = require("../models/UserFeatures")
const {Op} = require("sequelize")

const getFeatureById = (req, res)=>{
    let feature = req.feature
    return res.status(200).json({
        message: "Feature Found :)",
        data: feature
    })
}

const getAllFeatures = async (req, res) => {
    try {
        let features = await featureModel.findAndCountAll()
        return res.status(200).json({
            message: "Found features :)",
            length: features.count,
            data: features.rows
        })
    } catch (err) {
        return res.status(500).json({
            message: "Get All Features Error: " + err
        })
    }
}

const getUserFeatures = async(req, res)=>{
    try{
        const token = req.token
        const user = await userModel.findByPk(token.UserId)
        if(user.haveFreeTrial == true) {
            const features = await featureModel.findAndCountAll()
            return res.status(200).json({
                message: "Found features :)",
                length: features.count,
                data: features.rows
            })
        }else{
            const userFeatures = await userFeatureModel.findAndCountAll({where:{UserId: token.UserId}})
            let features = []
            for (let i = 0; i < userFeatures.count; i++) {
                const e = userFeatures.rows[i];
                let feature = await featureModel.findByPk(e['FeatureId'])
                features.push(feature)
            }
            return res.status(200).json({
                message: "Found features :)",
                length: features.length,
                data: features
            })
        }
    }catch(err){
        return res.status(500).json({
            message: "Get User Features Error: " + err
        })
    }
}

const getUnsubscribedFeatures = async(req, res)=>{
    try{
        const token = req.token
        const user = await userModel.findByPk(token.UserId)
        if(user.haveFreeTrial == true) {
            return res.status(200).json({
                message: "Found features :)",
                length: 0,
                data: []
            })
        }else{
            const userFeatures = await userFeatureModel.findAndCountAll({where:{UserId: token.UserId}})
            let features = []
            for (let i = 0; i < userFeatures.count; i++) {
                const e = userFeatures.rows[i];
                let feature = await featureModel.findByPk(e['FeatureId'])
                features.push(feature.feature)
            }
            const unsubscribedFeatures = await featureModel.findAndCountAll({where:{feature:{[Op.notIn]:features}}})
            return res.status(200).json({
                message: "Found features :)",
                length: unsubscribedFeatures.count,
                data: unsubscribedFeatures.rows
            })
        }
    }catch(err){
        return res.status(500).json({
            message: "Get Unsubscribed Features Error: " + err
        })
    }
}

const createFeature = async(req, res)=>{
    let featureData = {},
        token = req.token

    featureData["UserId"] = token.UserId
    featureData["feature"] = req.body.feature
    featureData["describtion"] = req.body.describtion
    featureData["price"] = parseInt(req.body.price)
    featureData["type"] = req.body.type

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

const updateFeature = async(req, res)=>{
    let featureData = {}
        feature = req.feature

    featureData["feature"] = req.body.feature || feature.feature
    featureData["describtion"] = req.body.describtion || feature.describtion
    featureData["price"] = parseInt(req.body.price) || feature.price
    featureData["type"] = req.body.type || feature.type

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

const deleteFeature = async(req, res)=>{
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

const deleteUserFeature = async(req, res)=>{
    const token = req.token
    const id = req.params.id
    try{
        const userFeature = await userFeatureModel.findOne({where:{
            [Op.and]:[
                {UserId: token.UserId},
                {FeatureId: id}
            ]
        }})
        
        if(userFeature == null) return res.status(404).json({
            message: "invalid feature id or permission denied"
        })
        await userFeatureModel.destroy({where:{id: userFeature.id}})

        return res.status(200).json({
            message: "User feature deleted successfully"
        })
    }catch(err){
        return res.status(500).json({
            message: "Delete user feature error: " + err
        })
    }

}

module.exports = {
    getFeatureById,
    getAllFeatures,
    createFeature,
    updateFeature,
    deleteFeature,
    getUserFeatures,
    deleteUserFeature,
    getUnsubscribedFeatures
}