const featuresModel = require("../../models/Feature")

module.exports = async(req, res, next)=>{
    let features = req.body.features,
        featuresIds = new Set()
    
    if(features && Array.isArray(features)){
        for(let i = 0; i < features.length; i++){
            let feature = await featuresModel.findOne({where:{feature: features[i]}})
            if (feature === null) return res.status(401).json({
                message: "Invalid Features :("
            })
            featuresIds.add(feature.id)
        }
        req.featuresValid = true
        req.featuresIds = [...featuresIds]
        next()
    }else return res.status(401).json({
        message: "Invalid Features :("
    })
}