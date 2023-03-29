const userModel = require("../models/userModel")
const tokenModel = require("../models/tokenModel")
const fs = require("fs")
const jwt = require("jsonwebtoken")
const config = require("config")
const sequelize = require("../models/sequelize")

let catchFunc = (type, err, token)=>{
    return res.status(500).json({
        message: type + " User Error: " + err,
        token
    })
}

let getUserByID = async(req, res)=>{
    let token = req.header("x-auth-token"),
        user = req.user
    return res.status(200).json({
        message: "User Found :)",
        token,
        data: user
    })
}

let getAllUsers = async(req, res)=>{
    let token = req.header("x-auth-token")
    try {
        let users = await userModel.findAndCountAll()
        if(users.length !== 0) return res.status(200).json({
            message: "Found users :)",
            token,
            length: users.count,
            data: users.rows
        })
        else return res.status(400).json({
            message: "Not found any users :(",
            token
        })
    }catch(err){
        catchFunc("Get All", err, token)
    }
}

let createUser = async(req, res)=>{
    try{
        let user = await userModel.findOne({where: {email: req.body.email}}),
            token
        if(user !== null) return res.status(400).json({
            message: "Email is actually exist :("
        })

        req.body.devicesNumber = parseInt(req.body.devicesNumber) || 5
        if (!req.body.phoneNumber) return res.status(400).json({
            message: "please enter phone number :("
        })
        delete req.body.updatedAt
        delete req.body.createdAt
        delete req.body.admin
        delete req.body.image
        req.body.loginDevices = 1
        await sequelize.transaction(async (t) => {
            user = await userModel.create(req.body, { transaction: t })
            token = jwt.sign({user_id: user.id, admin: user.admin}, config.get("seckey"))
            await tokenModel.create({token:token, UserId:user.id}, { transaction: t })
        })

        return res.status(200).json({
            message: "User Created Successfully :)",
            token,
            user_id:user.id,
            admin: user.admin
        })
    }catch(err){
        return res.status(500).json({
            message: "Create User Error: " + err
        })
    }
}

let updateUser = async(req, res)=>{
    let token = req.header("x-auth-token")
    try{
        let user = req.user
        delete req.body.password
        delete req.body.image
        delete req.body.updatedAt
        delete req.body.createdAt
        delete req.body.admin
        delete req.body.loginDevices
        req.body.devicesNumber = parseInt(req.body.devicesNumber) || user.devicesNumber
        
        await userModel.update(req.body, {where: {id: user.id}})

        return res.status(200).json({
            message: "User Updated Successfully :)",
            token
        })
    }catch(err){
        return catchFunc("Update", err, token)
    }
}

let deleteUser = async(req, res)=>{
    let token = req.header("x-auth-token")
    try{
        let user = req.user
        await sequelize.transaction(async (t) => {
            await userModel.destroy({where: {id:user.id}, transaction: t })
            await tokenModel.destroy({where:{UserId:user.id}, transaction: t })
        })

        if(user.image !== "logo.jpg"){
            let directoryPath = __dirname.replace("controllers", "public/images/")
            fs.unlink(directoryPath + user.image, (err) => {
                if(err) return res.status(500).json({
                    message: "Delete logo from server error: " + err
                })
            })
        }
        return res.status(200).json({
            message: "User Deleted Successfully :)"
        })
    }catch(err){
        return catchFunc("Delete", err, token)
    }
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUserByID,
    getAllUsers
}