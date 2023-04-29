const userModel = require("../models/User")
const tokenModel = require("../models/Token")
const featureModel = require("../models/Feature")
const userFeaturesModel = require("../models/UserFeatures")
const fs = require("fs")
const jwt = require("jsonwebtoken")
const config = require("config")
const sequelize = require("../models/sequelize")
const { Op } = require("sequelize")
const deviceDetector = require("device-detector-js")
const detector = new deviceDetector()
const bcrypt = require("bcrypt")

let getUserByID = async (req, res) => {
    try {
        let user = req.user,
            userFeatures = await userFeaturesModel.findAndCountAll({where:{UserId: user.id}}),
            features = []
        for (let i = 0; i < userFeatures.count; i++) {
            const feature = userFeatures.rows[i];
            let featureData = await featureModel.findByPk(feature.FeatureId)
            features.push(featureData.feature)
        }
        return res.status(200).json({
            message: "User Found :)",
            data: {user, features}
        })
    } catch (err) {
        return res.status(500).json({
            message:"Get User Error: " + err
        })
    }
}

let getAllUsers = async (req, res) => {
    try {
        let users = await userModel.findAndCountAll(),
            usersData = []
        for (let i = 0; i < users.count; i++) {
            let user = users.rows[i],
                userFeatures = await userFeaturesModel.findAndCountAll({where:{UserId: user.id}}),
                features = []
            if(userFeatures){
                for (let j = 0; j < userFeatures.count; j++) {
                    let feature = userFeatures.rows[j],
                        featureData = await featureModel.findByPk(feature.FeatureId)
                    features.push(featureData.feature)
                }
            }
            usersData.push({user, features})
        }
        return res.status(200).json({
            message: "Found users :)",
            length: users.count,
            data: usersData
        })
    } catch (err) {
        return res.status(500).json({
            message:"Get All Users Error: " + err
        })
    }
}

let createUserData = (req)=>{
    let userData = {}
    userData["firstName"] = req.body.firstName || ""
    userData["lastName"] = req.body.lastName || ""
    userData["userName"] = req.body.userName
    userData["email"] = req.body.email
    userData["password"] = req.body.password
    userData["phoneNumber"] = req.body.phoneNumber
    userData["workField"] = req.body.workField || ""
    userData["usageTarget"] = req.body.usageTarget || ""
    userData["streetName"] = req.body.streetName || ""
    userData["city"] = req.body.city || ""
    userData["state"] = req.body.state || ""
    userData["country"] = req.body.country
    userData["postCode"] = req.body.postCode || ""
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
        
        if(req.body.role == "farmer" || req.body.role == "engineer"){
            userData["role"] = req.body.role
        }else return res.status(403).json({
            message: "forbidden command"
        })
        userData["loginDevices"] = 1
        userData["lastUpdatedUserName"] = req.body.userName

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

        let adminUser = await userModel.findByPk(token.UserId)
        userData["lastUpdatedUserName"] = adminUser.userName

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
            token = req.token,
            userData = {},
            featuresIds = req.featuresIds
            
        let testUser = await userModel.findOne({ where: {
            [Op.or]: [
                { email: req.body.email || user.email },
                { phoneNumber: req.body.phoneNumber || user.phoneNumber },
                { userName: req.body.userName || user.userName }
            ]
        }})

        if (testUser !== null && user.id !== testUser.id) return res.status(400).json({
            message: "Email, phoneNumber or userName is actually exist :(",
        })
        userData["firstName"] = (req.body.firstName)?req.body.firstName:user.firstName
        userData["lastName"] = (req.body.lastName)?req.body.lastName:user.lastName
        userData["userName"] = (req.body.userName)?req.body.userName:user.userName
        userData["email"] = (req.body.email)?req.body.email:user.email
        userData["role"] = (req.body.role)?req.body.role:user.role
        userData["phoneNumber"] = (req.body.phoneNumber)?req.body.phoneNumber:user.phoneNumber
        userData["workField"] = (req.body.workField)?req.body.workField:user.workField
        userData["usageTarget"] = (req.body.usageTarget)?req.body.usageTarget:user.usageTarget
        userData["streetName"] = (req.body.streetName)?req.body.streetName:user.streetName
        userData["city"] = (req.body.city)?req.body.city:user.city
        userData["state"] = (req.body.state)?req.body.state:user.state
        userData["country"] = (req.body.country)?req.body.country:user.country
        userData["postCode"] = (req.body.postCode)?req.body.postCode:user.postCode
        
        let tokenUser = await userModel.findByPk(token.UserId)
        userData["lastUpdatedUserName"] = tokenUser.userName

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
        return res.status(500).json({
            message:"Update User Error: " + err
        })
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
        return res.status(500).json({
            message:"Delete User Error: " + err
        })
    }
}

let updateRole = async (req, res) => {
    let token = req.token,
        user = req.user,
        role = req.body.role
        try {
        let tokenUser = await userModel.findByPk(token.UserId)
        if(role === "superAdmin"){
            if(token.role === "superAdmin") await sequelize.transaction(async (t) => {
                    await userModel.update({ role: role, lastUpdatedUserName: tokenUser.userName }, { where: { id: user.id }, transaction: t });
                    await tokenModel.destroy({ where: { UserId: user.id }, transaction: t });
                });
            else return res.status(401).json({
                message: "Access Denied :("
            })
        }else await sequelize.transaction(async (t) => {
            await userModel.update({ role: role, lastUpdatedUserName: tokenUser.userName }, { where: { id: user.id }, transaction: t });
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

let updatePassword = async (req, res) => {
    let token = req.token,
        user = req.user,
        tokenUser

    if(token.UserId === user.id){
        bcrypt.compare(req.body.oldPassword, user.password, async (err, result) => {
            if (err) return res.status(500).json({
                message: "bcrypt error: " + err
            })
    
            if (!result) return res.status(403).json({
                message: "Old password not correct :("
            })
    
            try {
                tokenUser = await userModel.findByPk(token.UserId)
                await userModel.update({ password: req.body.password, lastUpdatedUserName: tokenUser.userName }, { where: { id: user.id } })
                return res.status(200).json({
                    message: "Password Updated Successfully :)"
                })
            } catch (err) {
                return res.status(500).json({
                    message: "Update Password Error: " + err
                })
            }
        })
    }else{
        try {
            tokenUser = await userModel.findByPk(token.UserId)
            await userModel.update({ password: req.body.password, lastUpdatedUserName: tokenUser.userName }, { where: { id: user.id } })
            return res.status(200).json({
                message: "Password Updated Successfully :)"
            })
        } catch (err) {
            return res.status(500).json({
                message: "Update Password Error: " + err
            })
        }
    }
}

let login = async (req, res) => {
    try {
        let user = await userModel.findOne({ where: { email: req.body.email } }),
            tokenData = {}
        if (user === null) return res.status(404).json({
            message: "Invalid email or password..!"
        })

        bcrypt.compare(req.body.password, user.password, async (err, result) => {
            if (err) return res.status(500).json({
                message: "bcrypt error: " + err
            })

            if (!result) return res.status(404).json({
                message: "Invalid email or password..!"
            })

            let tokensOfUser = await tokenModel.findAndCountAll({ where: { UserId: user.id } })
            if (tokensOfUser.count >= user.devicesNumber) return res.status(400).json({
                message: "Sorry..! The allowed number of devices has been exceeded"
            })

            const token = jwt.sign({ user_id: user.id, role: user.role }, config.get("seckey"))

            tokenData = createTokenData(req)
            tokenData["token"] = token
            tokenData["UserId"] = user.id

            await sequelize.transaction(async (t) => {
                await tokenModel.create(tokenData, { transaction: t })
                await userModel.update({ loginDevices: user.loginDevices + 1 }, { where: { id: user.id }, transaction: t })
            });

            return res.status(200).json({
                message: "Login successfully..!",
                token,
                user_id: user.id,
                role: user.role
            })
        })
    } catch (err) {
        return res.status(500).json({
            message: "Login Error: " + err
        })
    }
}

let getLogo = (req, res) => {
    let options = {
            root: __dirname.replace("controllers", "public"),
        },
        fileName = "images/" + req.params.imagename
    return res.sendFile(fileName, options, function (err) {
        if (err) return res.status(500).json({
            message: "Send logo error: " + err
        })
    })
}

let updateLogo = async (req, res) => {
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
        let tokenUser = await userModel.findByPk(token.UserId)
        await userModel.update({ image: imgsrc, lastUpdatedUserName: tokenUser.userName }, { where: { id: user.id } })
        return res.status(200).json({
            message: "Image updated Successfully :)"
        })
    } catch (err) {
        return res.status(500).json({
            message: "Update Image Error: " + err
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
    addUserByAdmin,
    updatePassword,
    login,
    getLogo,
    updateLogo
}