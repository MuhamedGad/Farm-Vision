const userModel = require("../models/User")
const tokenModel = require("../models/Token")
const userFeaturesModel = require("../models/UserFeatures")
const fs = require("fs")
const jwt = require("jsonwebtoken")
const config = require("config")
const sequelize = require("../models/sequelize")
const { Op } = require("sequelize")
const deviceDetector = require("device-detector-js")
const detector = new deviceDetector()

let catchFunc = (res, type, err) => {
    return res.status(500).json({
        message: type + " User Error: " + err
    })
}

let getUserByID = async (req, res) => {
    let user = req.user
    return res.status(200).json({
        message: "User Found :)",
        data: {user, features: user.features}
    })
}

let getAllUsers = async (req, res) => {
    try {
        let users = await userModel.findAndCountAll()
        if (users.length !== 0) return res.status(200).json({
            message: "Found users :)",
            length: users.count,
            data: users.rows
        })
        else return res.status(400).json({
            message: "Not found any users :("
        })
    } catch (err) {
        catchFunc(res, "Get All", err)
    }
}

let createUserData = (req)=>{
    let userData = {}
    userData["firstName"] = req.body.firstName
    userData["lastName"] = req.body.lastName
    userData["userName"] = req.body.userName
    userData["email"] = req.body.email
    userData["password"] = req.body.password
    userData["phoneNumber"] = req.body.phoneNumber
    userData["workField"] = req.body.workField
    userData["usageTarget"] = req.body.usageTarget
    userData["streetName"] = req.body.streetName
    userData["city"] = req.body.city
    userData["state"] = req.body.state
    userData["country"] = req.body.country
    userData["postCode"] = req.body.postCode
    return userData
}

let createTokenData = (req)=>{
    const device = detector.parse(req.header("user-agent"))
    let tokenData = {}
    tokenData["clientName"] = (device.client)?device.client.name:device.client
    tokenData["clientType"] = (device.client)?device.client.type:device.client
    tokenData["clientVersion"] = (device.client)?device.client.version:device.client
    tokenData["clientEngine"] = (device.client)?device.client.engine:device.client
    tokenData["clientEngineVersion"] = (device.client)?device.client.engineVersion:device.client
    tokenData["osName"] = (device.os)?device.os.name:device.os
    tokenData["osVersion"] = (device.os)?device.os.version:device.os
    tokenData["osPlatform"] = (device.os)?device.os.platform:device.os
    tokenData["deviceType"] = (device.device)?device.device.type:device.device
    tokenData["deviceBrand"] = (device.device)?device.device.brand:device.device
    tokenData["deviceModel"] = (device.device)?device.device.model:device.device
    tokenData["bot"] = device.bot
    return tokenData
}

let createUser = async (req, res) => {
    try {
        let user = await userModel.findOne({ where: {
                [Op.or]: [
                    { email: req.body.email },
                    { phoneNumber: req.body.phoneNumber },
                    { userName: req.body.userName }
                ]
            }}),
            token,
            userData = createUserData(req),
            tokenData = createTokenData(req),
            featuresIds = req.featuresIds

        if (user !== null) return res.status(400).json({
            message: "Email, phoneNumber or userName is actually exist :("
        })

        userData["role"] = req.body.role
        userData["loginDevices"] = 1

        await sequelize.transaction(async (t) => {
            user = await userModel.create(userData, { transaction: t })
            if(req.featuresValid){
                for (let i = 0; i < featuresIds.length; i++) {
                    await userFeaturesModel.create({FeatureId: featuresIds[i], UserId: user.id}, { transaction: t })
                }
            }
            token = jwt.sign({ user_id: user.id, role: user.role }, config.get("seckey"))
            tokenData["token"] = token
            tokenData["UserId"] = user.id
            await tokenModel.create(tokenData, { transaction: t })
        })

        return res.status(200).json({
            message: "User Created Successfully :)",
            token,
            id: user.id,
            role: user.role
        })
    } catch (err) {
        return res.status(500).json({
            message: "Create User Error: " + err
        })
    }
}

let addUserByAdmin = async (req, res) => {
    try {
        let user = await userModel.findOne({ where: {
                [Op.or]: [
                    { email: req.body.email },
                    { phoneNumber: req.body.phoneNumber },
                    { userName: req.body.userName }
                ]
            }}),
            userData = createUserData(req),
            featuresIds = req.featuresIds,
            token = req.token

        if (user !== null) return res.status(400).json({
            message: "Email, phoneNumber or userName is actually exist :("
        })
        
        if(token.role === "admin" && req.body.role === "superAdmin") return res.status(401).json({
            message: "Access Denied :("
        })
        else userData["role"] = req.body.role

        await sequelize.transaction(async (t) => {
            user = await userModel.create(userData, { transaction: t })
            if(req.featuresValid){
                for (let i = 0; i < featuresIds.length; i++) {
                    await userFeaturesModel.create({FeatureId: featuresIds[i], UserId: user.id}, { transaction: t })
                }
            }
        })

        return res.status(200).json({
            message: "User Created Successfully :)",
            id: user.id
        })
    } catch (err) {
        return res.status(500).json({
            message: "Create User Error: " + err
        })
    }
}

let updateUser = async (req, res) => {
    try {
        let user = req.user,
            userData = {},
            featuresIds = req.featuresIds
            
        let testUser = await userModel.findOne({ where: {
            [Op.or]: [
                { email: req.body.email },
                { phoneNumber: req.body.phoneNumber },
                { userName: req.body.userName }
            ]
        }})

        if (testUser !== null && user.id !== testUser.id) return res.status(400).json({
            message: "Email, phoneNumber or userName is actually exist :(",
        })

        userData["firstName"] = req.body.firstName || user.firstName
        userData["lastName"] = req.body.lastName || user.lastName
        userData["userName"] = req.body.userName || user.userName
        userData["email"] = req.body.email || user.email
        userData["role"] = req.body.role || user.role
        userData["phoneNumber"] = req.body.phoneNumber || user.phoneNumber
        userData["workField"] = req.body.workField || user.workField
        userData["usageTarget"] = req.body.usageTarget || user.usageTarget
        userData["streetName"] = req.body.streetName || user.streetName
        userData["city"] = req.body.city || user.city
        userData["state"] = req.body.state || user.state
        userData["country"] = req.body.country || user.country
        userData["postCode"] = req.body.postCode || user.postCode

        await sequelize.transaction(async (t) => {
            if(req.featuresValid){
                await userFeaturesModel.destroy({ where: { UserId: user.id }, transaction: t })
                for (let i = 0; i < featuresIds.length; i++) {
                    await userFeaturesModel.create({FeatureId: featuresIds[i], UserId: user.id}, { transaction: t })
                }
            }
            await userModel.update(userData, { where: { id: user.id }, transaction: t })
        })


        return res.status(200).json({
            message: "User Updated Successfully :)"
        })
    } catch (err) {
        return catchFunc(res, "Update", err)
    }
}

let deleteUser = async (req, res) => {
    try {
        let user = req.user

        await userModel.destroy({where: { id: user.id }})
        if (user.image !== "logo.jpg") {
            let directoryPath = __dirname.replace("controllers", "public/images/")
            fs.unlink(directoryPath + user.image, (err) => {
                if (err) return res.status(500).json({
                    message: "Delete logo from server error: " + err
                })
            })
        }

        return res.status(200).json({
            message: "User Deleted Successfully :)"
        })

    } catch (err) {
        return catchFunc(res, "Delete", err)
    }
}

let updateRole = async (req, res) => {
    let token = req.token,
        user = req.user,
        role = req.body.role
    try {
        if(role === "superAdmin"){
            if(token.role === "superAdmin") await sequelize.transaction(async (t) => {
                    await userModel.update({ role: role }, { where: { id: user.id }, transaction: t });
                    await tokenModel.destroy({ where: { UserId: user.id }, transaction: t });
                });
            else return res.status(401).json({
                message: "Access Denied :("
            })
        }else await sequelize.transaction(async (t) => {
            await userModel.update({ role: role }, { where: { id: user.id }, transaction: t });
            await tokenModel.destroy({ where: { UserId: user.id }, transaction: t });
        });

        return res.status(200).json({
            message: "Role Updated Successfully :)"
        })
    } catch (err) {
        return res.status(500).json({
            message: "Update Role Error: " + err
        })
    }
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUserByID,
    getAllUsers,
    updateRole,
    addUserByAdmin
}