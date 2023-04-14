const express = require("express")
const router = express.Router()
const userModel = require("../models/User")
const upload = require("../middlewares/uploadImageMW")
const validID = require("../middlewares/validators/checkValidIDMW")
const fs = require("fs")
const authrization = require("../middlewares/checkPermission/authrizationMW")
const checkUserFound = require("../middlewares/checkFound/checkUserFoundMW")
const checkPermission = require("../middlewares/checkPermission/checkPermissionOnUserMW")

router.get("/:imagename", authrization, (req, res) => {
    let options = {
        root: __dirname.replace("routes", "public"),
    },
        fileName = "images/" + req.params.imagename
    return res.sendFile(fileName, options, function (err) {
        if (err) return res.status(500).json({
            message: "Send logo error: " + err
        })
    })
})

router.put("/:id", validID, authrization, checkUserFound, checkPermission, upload.single("image"), async (req, res) => {
    let user = req.user

    if (!req.file) {
        return res.status(403).json({
            message: "No File Uploaded :("
        })
    }

    
    try {
        let imgsrc = req.file.filename
    
        if (user.image !== "logo.jpg") {
            let directoryPath = __dirname.replace("routes", "public/images/")
            fs.unlink(directoryPath + user.image, (err) => {
                if (err) return res.status(500).json({
                    message: "Delete logo from server error: " + err
                })
            })
        }

        await userModel.update({ image: imgsrc }, { where: { id: user.id } })
        return res.status(200).json({
            message: "Image updated Successfully :)"
        })
    } catch (err) {
        return res.status(500).json({
            message: "Update Image Error: " + err
        })
    }
})

module.exports = router