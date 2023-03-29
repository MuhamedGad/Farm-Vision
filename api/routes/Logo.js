const express = require("express")
const router = express.Router()
const userModel = require("../models/userModel")
const upload = require("../middlewares/uploadImageMW")
const validID = require("../middlewares/checkValidIDMW")
const fs = require("fs")
const authrization = require("../middlewares/authrizationMW")
const checkUserFound = require("../middlewares/checkUserFoundMW")
const checkPermission = require("../middlewares/checkPermissionMW")

router.get("/:id", validID, authrization, checkPermission, checkUserFound, (req, res)=>{
    let options = {
        root: __dirname.replace("routes", "public"),
    },
    fileName = "images/" + req.user.image
    return res.sendFile(fileName, options, function (err) {
        if (err) return res.status(500).json({
            message: "Send logo error: " + err
        })
    })
})

router.put("/:id", validID, authrization, checkPermission, checkUserFound, upload.single("image"), async(req, res)=>{
    let token = req.header("x-auth-token"),
        user = req.user
    
    if(!req.file) {
        return res.status(403).json({
            message: "No File Uploaded :(",
            token
        })
    }

    let imgsrc = req.file.filename
    if(user.image !== "logo.jpg"){
        let directoryPath = __dirname.replace("routes", "public/images/")
        fs.unlink(directoryPath + user.image, (err) => {
            if (err) return res.status(500).json({
                message: "Delete logo from server error: " + err
            })
        })
    }

    try{
        await userModel.update({image: imgsrc}, {where:{id: user.id}})
        return res.status(200).json({
            message: "Image updated Successfully :)",
            token
        })
    }catch(err){
        return res.status(500).json({
            message: "Update Image Error: " + err,
            token
        })
    }
})

module.exports = router