const config = require("config")
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const tokenModel = require("../models/tokenModel")
const sequelize = require("../models/sequelize")

let checkPassOfCreateAdmin = (req, res, next)=>{
    let pass = req.params.password
    console.log(pass)
    console.log(config.get("seckey"))
    console.log(pass === config.get("seckey"))
    if(pass === config.get("seckey")) next()
    else return res.status(400).json({
        message: "this user can not be an admin :("
    })
}

/* let addAdmin = async(req, res)=>{
    try{
        let user = await userModel.findOne({where: {email: req.body.email}})
        if(user !== null) return res.status(400).json({
            message: "Email is actually exist :("
        })

        req.body.devicesNumber = parseInt(req.body.devicesNumber) || 5
        if (!req.body.phoneNumber) return res.status(400).json({
            message: "please enter phone number :("
        })

        req.body.admin = true
        user = await userModel.create(req.body)

        let token = jwt.sign({user_id: user.id, admin: user.admin}, config.get("seckey"))
        await tokenModel.create({token:token, UserId:user.id})
        
        return res.status(200).json({
            message: "Admin Created Successfully :)",
            token
        })
    }catch(err){
        return res.status(500).json({
            message: "Create Admin Error: " + err
        })
    }
} */

let addUser = async(req, res)=>{
    let token = req.header("x-auth-token")
    try{
        let user = await userModel.findOne({where: {email: req.body.email}})
        if(user !== null) return res.status(400).json({
            message: "Email is actually exist :(",
            token
        })

        req.body.devicesNumber = parseInt(req.body.devicesNumber) || 5
        if (!req.body.phoneNumber) return res.status(400).json({
            message: "please enter phone number :(",
            token
        })

        user = await userModel.create(req.body)
        
        return res.status(200).json({
            message: "User Created Successfully :)",
            token,
            user_id:user.id
        })
    }catch(err){
        return res.status(500).json({
            message: "Create User Error: " + err,
            token
        })
    }
}

let updateAdmin = async(req, res)=>{
    let token = req.header("x-auth-token")
    let user = req.user
    try{
        await sequelize.transaction(async (t) => {
            await userModel.update({admin: (user.admin)?false:true}, {where: {id: user.id}, transaction: t });
            await tokenModel.destroy({where:{UserId:user.id}, transaction: t });
        });

        return res.status(200).json({
            message: "Admin Updated Successfully :)",
            token
        })
    }catch(err){
        return res.status(500).json({
            message: "Update Admin Error: " + err,
            token
        })
    }
}

module.exports = {
    checkPassOfCreateAdmin,
    // addAdmin,
    updateAdmin,
    addUser
}