const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const userModel = require("../models/User")
const tokenModel = require("../models/Token")
const loginValidator = require("../middlewares/loginValidatorMW")
const jwt = require("jsonwebtoken")
const config = require("config")
const sequelize = require("../models/sequelize")

router.post("/", loginValidator, async (req, res) => {
    try {
        let user = await userModel.findOne({ where: { email: req.body.email } })
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

            const token = jwt.sign({ user_id: user.id, admin: user.admin }, config.get("seckey"))

            await sequelize.transaction(async (t) => {
                await tokenModel.create({ token: token, UserId: user.id }, { transaction: t })
                await userModel.update({ loginDevices: user.loginDevices + 1 }, { where: { id: user.id }, transaction: t })
            });

            return res.status(200).json({
                message: "Login successfully..!",
                token,
                user_id: user.id,
                admin: user.admin
            })
        })
    } catch (err) {
        return res.status(500).json({
            message: "Login Error: " + err
        })
    }
})

module.exports = router