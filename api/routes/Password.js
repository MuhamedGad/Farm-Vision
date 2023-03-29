const express = require("express")
const router = express.Router()
const authrization = require("../middlewares/authrizationMW")
const checkPermission = require("../middlewares/checkPermissionMW")
const validId = require("../middlewares/checkValidIDMW")
const checkUserFound = require("../middlewares/checkUserFoundMW")
const updatePasswordValidator = require("../middlewares/updatePasswordValidatorMW")
const encryptPassword = require("../middlewares/ecryptPasswordMW")
const confirmPassword = require("../middlewares/confirmPasswordMW")
const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")

router.put("/:id", validId, authrization, checkPermission, updatePasswordValidator, checkUserFound, confirmPassword, encryptPassword, async(req, res)=>{
    let token = req.header("x-auth-token")
    let user = req.user

    if (req.admin){
        try{
            await userModel.update({password: req.body.password}, {where: {id: user.id}})
            return res.status(200).json({
                message: "Password Updated Successfully :)",
                token
            })
        }catch(err){
            return res.status(500).json({
                message: "Update Password Error: " + err,
                token
            })
        }
    }else{
        bcrypt.compare(req.body.oldPassword, user.password, async(err, result)=>{
            if(err) return res.status(500).json({
                message: "bcrypt error: " + err
            })
    
            if(!result) return res.status(403).json({
                message: "Old password not correct :(",
                token
            })
    
            try{
                await userModel.update({password: req.body.password}, {where: {id: user.id}})
                return res.status(200).json({
                    message: "Password Updated Successfully :)",
                    token
                })
            }catch(err){
                return res.status(500).json({
                    message: "Update Password Error: " + err,
                    token
                })
            }
        })
    }
})

module.exports = router