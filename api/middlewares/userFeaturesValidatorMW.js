const prjectFeatures = require("../models/ProjectFeatures")

module.exports = (req, res, next)=>{
    let valid = true
    let features = req.body.features
    if(Array.isArray(features)){
        if(features.length > prjectFeatures.length) valid = false
        else{
            for (let i = 0; i < features.length; i++) {
                if(!prjectFeatures.includes(features[i])) {
                    valid = false
                    break
                }
            }
        }
    }else valid = false

    req.featuresValid = valid
    next()
}