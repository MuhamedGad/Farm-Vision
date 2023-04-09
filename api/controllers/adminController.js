const config = require("config")
const jwt = require("jsonwebtoken")
const userModel = require("../models/User")
const tokenModel = require("../models/Token")
const userFeaturesModel = require("../models/UserFeatures")
const sequelize = require("../models/sequelize")

/* let checkPassOfCreateAdmin = (req, res, next) => {
    let pass = req.params.password
    console.log(pass)
    console.log(config.get("seckey"))
    console.log(pass === config.get("seckey"))
    if (pass === config.get("seckey")) next()
    else return res.status(400).json({
        message: "this user can not be an admin :("
    })
} */

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

let addUser = async (req, res) => {
    try {
        let user = await userModel.findOne({ where: {
                [op.or]: [
                    { email: req.body.email },
                    { phoneNumber: req.body.phoneNumber }
                ]
            }}),
            userData = {},
            features = req.body.features

        if (user !== null) return res.status(400).json({
            message: "Email is or phone number actually exist :("
        })
        
        if (!req.body.phoneNumber) return res.status(400).json({
            message: "please enter phone number :(",
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

        await sequelize.transaction(async (t) => {
            if(req.featuresValid){
                features.forEach(async e => {
                    await userFeaturesModel.create({feature: e, UserId: user.id}, { transaction: t })
                })
            }
            user = await userModel.create(userData, { transaction: t })
        })


        return res.status(200).json({
            message: "User Created Successfully :)",
            user_id: user.id
        })
    } catch (err) {
        return res.status(500).json({
            message: "Create User Error: " + err
        })
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
            message: "Admin Updated Successfully :)",
            token
        })
    } catch (err) {
        return res.status(500).json({
            message: "Update Admin Error: " + err,
            token
        })
    }
}

module.exports = {
    // checkPassOfCreateAdmin,
    // addAdmin,
    updateRole,
    addUser
}