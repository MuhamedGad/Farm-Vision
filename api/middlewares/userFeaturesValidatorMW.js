const featuresModel = require("../models/Feature")

module.exports = async(req, res, next)=>{
    let valid = true,
        features = req.body.features,
        feature,
        featuresIds = new Set()
    
    if(features){
        if(Array.isArray(features)){
            for(let i = 0; i < features.length; i++){
                feature = await featuresModel.findOne({where:{feature: features[i]}})
                if (feature === null) return res.status(400).json({
                    message: "Invalid Features :("
                })
                featuresIds.add(feature.id)
            }
        }else return res.status(401).json({
            message: "Invalid Features :("
        })
    }else valid = false

    req.featuresValid = valid
    req.featuresIds = [...featuresIds]
    next()
}