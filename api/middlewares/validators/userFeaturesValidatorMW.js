const featuresModel = require("../../models/Feature")

module.exports = async(req, res, next)=>{
    let features = req.body.features,
        featuresData = new Set()
    try{
        if(features && Array.isArray(features)){
            for(let i = 0; i < features.length; i++){
                let feature = await featuresModel.findOne({where:{feature: features[i]}})
                if (feature === null) return res.status(401).json({
                    message: "Invalid Features :("
                })
                featuresData.add(feature)
            }
            req.features = [...featuresData]
            next()
        }else return res.status(401).json({
            message: "Invalid Features :("
        })
    }catch(err){
        return res.status(500).json({
            message: "Validate Features Error: " + err
        })
    }
}