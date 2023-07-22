const tagsModel = require("../../models/Tag")

module.exports = async(req, res, next)=>{
    let tags = req.body.tags,
        tagsData = new Set()
    
    if(tags){
        tags = tags.split(",")
        if(Array.isArray(tags)){
            for(let i = 0; i < tags.length; i++){
                let tag = await tagsModel.findOne({where:{tag: tags[i]}})
                if (tag === null || tag["isAccepted"] === false) return res.status(400).json({
                    message: "Invalid Tags."
                })
                tagsData.add(tag)
            }
        }else {
            tagsData = []
        }
    }

    req.tagsValid = true
    req.tags = [...tagsData]
    next()
}