const userModel = require("../models/User")
const tokenModel = require("../models/Token")
const fs = require("fs")
const jwt = require("jsonwebtoken")
const config = require("config")
const sequelize = require("../models/sequelize")
const { op } = require("sequelize")
const deviceDetector = require("device-detector-js")

let catchFunc = (type, err) => {
    return res.status(500).json({
        message: type + " User Error: " + err
    })
}

let getUserByID = async (req, res) => {
    let user = req.user
    return res.status(200).json({
        message: "User Found :)",
        data: user
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
        catchFunc("Get All", err)
    }
}

let createUser = async (req, res) => {
    try {
        let user = await userModel.findOne({ where: {
            [op.or]: [
                { email: req.body.email },
                { phoneNumber: req.body.phoneNumber }
            ]
        }}),
            token,
            userData = {},
            tokenData = {}

        if (user !== null) return res.status(400).json({
            message: "Email or phone number is actually exist :("
        })

        if (!req.body.phoneNumber) return res.status(400).json({
            message: "please enter phone number :("
        })

        userData["firstName"] = req.body.firstName
        userData["lastName"] = req.body.lastName
        userData["email"] = req.body.email
        userData["password"] = req.body.password
        userData["role"] = req.body.role
        userData["devicesNumber"] = parseInt(req.body.devicesNumber) || 5
        userData["phoneNumber"] = req.body.phoneNumber
        userData["loginDevices"] = 1
        userData["workField"] = req.body.workField
        userData["usageTarget"] = req.body.usageTarget
        userData["streetName"] = req.body.streetName
        userData["city"] = req.body.city
        userData["state"] = req.body.state
        userData["country"] = req.body.country
        userData["postCode"] = req.body.postCode

        const detector = new deviceDetector();
        const device = detector.parse(req.header("user-agent"));

        tokenData["clientName"] = device.client.name
        tokenData["clientType"] = device.client.type
        tokenData["clientVersion"] = device.client.version
        tokenData["clientEngine"] = device.client.engine
        tokenData["clientEngineVersion"] = device.client.engineVersion
        tokenData["osName"] = device.os.name
        tokenData["osVersion"] = device.os.version
        tokenData["osPlatform"] = device.os.platform
        tokenData["deviceType"] = device.device.type
        tokenData["deviceBrand"] = device.device.brand
        tokenData["deviceModel"] = device.device.model
        tokenData["bot"] = device.bot

        await sequelize.transaction(async (t) => {
            user = await userModel.create(userData, { transaction: t })

            token = jwt.sign({ user_id: user.id, role: user.role }, config.get("seckey"))
            tokenData["token"] = token
            tokenData["UserId"] = user.id

            await tokenModel.create(tokenData, { transaction: t })
        })

        return res.status(200).json({
            message: "User Created Successfully :)",
            token,
            user_id: user.id,
            role: user.role
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
            userData = {}

        let testUser = await userModel.findOne({ where: {
            [op.or]: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }]
        }})

        if (testUser !== null) return res.status(400).json({
            message: "Email or phone number is actually exist :(",
        })

        userData["firstName"] = req.body.firstName || user.firstName
        userData["lastName"] = req.body.lastName || user.lastName
        userData["email"] = req.body.email || user.email
        userData["role"] = req.body.role || user.role
        userData["devicesNumber"] = parseInt(req.body.devicesNumber) || user.devicesNumber
        userData["phoneNumber"] = req.body.phoneNumber || user.firstName
        userData["workField"] = req.body.workField || user.firstName
        userData["usageTarget"] = req.body.usageTarget || user.firstName
        userData["streetName"] = req.body.streetName || user.firstName
        userData["city"] = req.body.city || user.firstName
        userData["state"] = req.body.state || user.firstName
        userData["country"] = req.body.country || user.firstName
        userData["postCode"] = req.body.postCode || user.firstName

        await userModel.update(userData, { where: { id: user.id } })

        return res.status(200).json({
            message: "User Updated Successfully :)"
        })
    } catch (err) {
        return catchFunc("Update", err)
    }
}

let deleteUser = async (req, res) => {
    try {
        let user = req.user
        await sequelize.transaction(async (t) => {
            await userModel.destroy({ where: { id: user.id }, transaction: t })
            await tokenModel.destroy({ where: { UserId: user.id }, transaction: t })
            if (user.image !== "logo.jpg") {
                let directoryPath = __dirname.replace("controllers", "public/images/")
                fs.unlink(directoryPath + user.image, (err) => {
                    if (err) return res.status(500).json({
                        message: "Delete logo from server error: " + err
                    })
                })
            }
        })

        return res.status(200).json({
            message: "User Deleted Successfully :)"
        })

    } catch (err) {
        return catchFunc("Delete", err)
    }
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUserByID,
    getAllUsers
}