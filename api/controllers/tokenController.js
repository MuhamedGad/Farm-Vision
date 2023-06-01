const userModel = require("../models/User")
const tokenModel = require("../models/Token")
const sequelize = require("../models/sequelize")

const getAllTokens = async(req, res)=>{
    try {
        let tokens = await tokenModel.findAndCountAll()
        return res.status(200).json({
            message: "Found tokens :)",
            length: tokens.count,
            data: tokens.rows
        })
    } catch (err) {
        return res.status(500).json({
            message: "Get all tokens Error: " + err
        })
    }
}

const getTokenByID = async(req, res)=>{
    let token = req.tokenFound
    return res.status(200).json({
        message: "User Found :)",
        data: token
    })
}

const getTokensForUser = async(req, res)=>{
    try {
        let token = req.token,
            tokens = await tokenModel.findAndCountAll({where:{UserId:token.UserId}})
        return res.status(200).json({
            message: "Found tokens :)",
            length: tokens.count,
            data: tokens.rows
        })
        
    } catch (err) {
        return res.status(500).json({
            message: "Get tokens Error: " + err
        })
    }

}

const deleteToken = async(token, res)=>{
    try {
        let user
        await sequelize.transaction(async (t) => {
            await tokenModel.destroy({ where: {id:token.id}, transaction: t })
            user = await userModel.findOne({ where: { id: token.UserId }, transaction: t })
            await userModel.update({ loginDevices: user.loginDevices - 1 }, { where: { id: user.id }, transaction: t })
        });

        return res.status(200).json({
            message: "Logout Successfully :)"
        })
    } catch (err) {
        return res.status(500).json({
            message: "Logout Error: " + err
        })
    }
}

const logout = (req, res)=>{
    deleteToken(req.token, res)
}

const logoutFromOtherDevice = async(req, res)=>{
    deleteToken(req.tokenFound, res)
}

module.exports = {
    getTokenByID,
    logoutFromOtherDevice,
    logout,
    getTokensForUser,
    getAllTokens
}