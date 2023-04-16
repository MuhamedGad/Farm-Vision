const tagsModel = require("../../models/Tag")

module.exports = async(req, res, next)=>{
    let tags = req.body.tags,
        tagsData = new Set()
    
    if(tags){
        if(Array.isArray(tags)){
            for(let i = 0; i < tags.length; i++){
                let tag = await tagsModel.findOne({where:{tag: tags[i]}})
                if (tag === null) return res.status(400).json({
                    message: "Invalid Tags :("
                })
                tagsData.add(tag)
            }
        }else return res.status(401).json({
            message: "Please send tags in array format :("
        })
    }

    req.tagsValid = true
    req.tags = [...tagsData]
    next()
}