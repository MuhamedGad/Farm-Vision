const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const userModel = require("../models/User")
const tokenModel = require("../models/Token")
const loginValidator = require("../middlewares/validators/loginValidatorMW")
const jwt = require("jsonwebtoken")
const config = require("config")
const sequelize = require("../models/sequelize")
const deviceDetector = require("device-detector-js")

router.post("/", loginValidator, async (req, res) => {
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

            const detector = new deviceDetector();
            const device = detector.parse(req.header("user-agent"));

            tokenData["token"] = token
            tokenData["UserId"] = user.id
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
})

module.exports = router