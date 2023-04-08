const express = require("express")
const router = express.Router()
const tokenModel = require("../models/Token")
const userModel = require("../models/User")
const authrization = require("../middlewares/authrizationMW")
const sequelize = require("../models/Sequelize")

router.post("/", authrization, async (req, res) => {
    let token = req.header("x-auth-token"),
        user
    try {
        await sequelize.transaction(async (t) => {
            await tokenModel.destroy({ where: { token }, transaction: t })
            user = await userModel.findOne({ where: { id: req.token.UserId }, transaction: t })
            await userModel.update({ loginDevices: user.loginDevices - 1 }, { where: { id: user.id }, transaction: t })
        });

        return res.status(200).json({
            message: "Logout Successfully..!"
        })
    } catch (err) {
        return res.status(500).json({
            message: "Logout Error: " + err,
            token
        })
    }
})

module.exports = router