const userModel = require("../models/User")
const tokenModel = require("../models/Token")
const featureModel = require("../models/Feature")
const userFeaturesModel = require("../models/UserFeatures")
const emailsDeletedModel = require("../models/EmailsDeleted")
const verifiedEmailTokenModel = require("../models/VerifiedEmailToken")
const fs = require("fs")
const jwt = require("jsonwebtoken")
const config = require("config")
const sequelize = require("../models/sequelize")
const { Op } = require("sequelize")
const deviceDetector = require("device-detector-js")
const detector = new deviceDetector()
const bcrypt = require("bcrypt")
const nodeMail = require("../util/nodeMail")
const subscribeFormLink = "http://google.com"
const verifiedEmailLink = "http://localhost:8888/api/user/verifyemail"

const endFreeTrialEmail = async(userId)=>{
    try{
        let user = await userModel.findByPk(userId)
        if(!user.premium){
            let message = `Hello ${user.firstName}, We would like to inform you that you have completed seven of the seven days of your free trial to use our site. So, unfortunately, you can't still use our features.`,
                email = user.email,
                subject = "End free trial",
                link = {
                    url: subscribeFormLink,
                    describtion: "Subscribe"
                }
            await userModel.update({haveFreeTrial:false}, {where:{id:user.id}})
            nodeMail(email, subject, message, link)
        }
    }catch(err){
        console.log("After 7 days Error: "+err)
    }
}

const after5DaysEmail = async(userId)=>{
    try{
        let user = await userModel.findByPk(userId)
        if(!user.premium){
            let date = new Date(user.createdAt)
            date.setDate(date.getDate() + 7)
    
            let day = date.getDate(),
                month = date.getMonth()+1,
                year = date.getFullYear()
                
            day = ("0" + day).slice(-2);
            month = ("0" + month).slice(-2);

            let message = `Hello ${user.firstName}, We would like to inform you that you have completed five of the seven days of your free trial to use our site. So, please subscribe before (${year}-${month}-${day}) to can still use our features.`,
                email = user.email,
                subject = "End five days of free trial",
                link = {
                    url: subscribeFormLink,
                    describtion: "Subscribe"
                }
    
            nodeMail(email, subject, message, link)
            // 172800000ms for 2 day
            // 120000ms for 2 min
            setTimeout(endFreeTrialEmail, 120000, user.id)
        }
    }catch(err){
        console.log("After 5 days Error: " + err)
    }
}

const getUserByID = async (req, res) => {
    try {
        const   user = req.user,
                features = []
        if(user.haveFreeTrial){
            const features = await featureModel.findAndCountAll()
            for (let i = 0; i < features.count; i++) {
                const feature = features.rows[i];
                features.push(feature.feature)
            }
        }else{
            const userFeatures = await userFeaturesModel.findAndCountAll({where:{UserId: user.id}})
            for (let i = 0; i < userFeatures.count; i++) {
                let feature = userFeatures.rows[i];
                const featureData = await featureModel.findByPk(feature.FeatureId)
                features.push(featureData.feature)
            }
        }

        user.image = (user.image)?Buffer.from(user.image).toString('base64'):user.image

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

const getAllUsers = async (req, res) => {
    try {
        let users = await userModel.findAndCountAll(),
            usersData = []
        for (let i = 0; i < users.count; i++) {
            let user = users.rows[i],
                features = []
            if(user.haveFreeTrial){
                const features = await featureModel.findAndCountAll()
                for (let i = 0; i < features.count; i++) {
                    const feature = features.rows[i];
                    features.push(feature.feature)
                }
            }else{
                let userFeatures = await userFeaturesModel.findAndCountAll({where:{UserId: user.id}})
                for (let j = 0; j < userFeatures.count; j++) {
                    let feature = userFeatures.rows[j],
                        featureData = await featureModel.findByPk(feature.FeatureId)
                    features.push(featureData.feature)
                }
            }
            user.image = (user.image)?Buffer.from(user.image).toString('base64'):user.image;
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

const createUserData = (req)=>{
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

const createTokenData = (req)=>{
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

const createUser = async (req, res) => {
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
            deletedEmail = await emailsDeletedModel.findOne({where:{email: req.body.email}})

        if (user !== null) return res.status(400).json({
            message: "Email, phoneNumber or userName is actually exist :("
        })

        if(deletedEmail !== null){
            userData["haveFreeTrial"] = false
            await emailsDeletedModel.destroy({where:{email: req.body.email}})
        }

        if(req.body.role == "farmer" || req.body.role == "engineer"){
            userData["role"] = req.body.role
        }else return res.status(403).json({
            message: "forbidden command"
        })

        userData["loginDevices"] = 1
        userData["lastUpdatedUserName"] = req.body.userName

        if (!req.file) {
            userData["image"] = null
        }else{
            let imgsrc = req.file.filename
            let directoryPath = __dirname.replace("controllers", "public/images/")
            let imageData = fs.readFileSync(directoryPath+imgsrc)
            userData["image"] = imageData
            fs.unlink(directoryPath + imgsrc, (err) => {
                if (err) return res.status(500).json({
                    message: "Delete logo from server error: " + err
                })
            })
        }

        await sequelize.transaction(async (t) => {
            user = await userModel.create(userData, { transaction: t })

            token = jwt.sign({ user_id: user.id, role: user.role }, config.get("seckey"))
            tokenData["token"] = token
            tokenData["UserId"] = user.id
            await tokenModel.create(tokenData, { transaction: t })

            /* // ---------- Verification Email ----------------
            let verificationEmailToken = crypto.createHash('sha256').update(crypto.randomBytes(32).toString('hex')).digest('hex');
            await verifiedEmailTokenModel.create({UserId:user.id, token: verificationEmailToken}, { transaction: t })
            let to = user.email,
                subject = "Verification Email",
                message = `Hello ${user.firstName}, Verify your email address so we know it's really you, and so we can send you important information about your Farm Vision account.`,
                link = {
                    url: verifiedEmailLink + `/${user.id}/${verificationEmailToken}`,
                    describtion: "Verify email address"
                }
            await nodeMail(to, subject, message, link)
            // ---------------------------------------------- */
        })

        return res.status(200).json({
            message: "User Created Successfully :)",
            token,
            id: user.id,
            role: user.role
        })
        // return res.status(200).json({
        //     message: "Please check your email to verify."
        // })
    } catch (err) {
        return res.status(500).json({
            message: "Create User Error: " + err
        })
    }
}

const verifyEmail = async(req, res)=>{
    try{
        let userId = req.params.id,
            user,
            emailToken = req.params.token,
            verifiedEmailToken = await verifiedEmailTokenModel.findOne({ where: {
                [Op.and]: [
                    { UserId: userId },
                    { token: emailToken }
                ]
            }})
    
        if (verifiedEmailToken !== null) {
            await sequelize.transaction(async (t) => {
                user = await userModel.findByPk(userId)
                await verifiedEmailTokenModel.destroy({where: {id: verifiedEmailToken.id}, transaction: t})
                await userModel.update({verified: true}, {where:{id: user.id}, transaction: t})
            })

            // 432000000ms for 5 days
            // 300000ms for 5 min
            if(user.haveFreeTrial){
                console.log("start timer")
                setTimeout(after5DaysEmail, 300000, user.id)
            }

            return res.status(200).json({
                message: "User Created Successfully you can login now :)"
            })
        }else return res.status(400).json({
            message: "soory..! Not found verify token to this email :("
        })
    } catch (err) {
        return res.status(500).json({
            message: "Verify Email Error: " + err
        })
    }
}

const addUserByAdmin = async (req, res) => {
    try {
        let user = await userModel.findOne({ where: {
                [Op.or]: [
                    { email: req.body.email },
                    { phoneNumber: req.body.phoneNumber },
                    { userName: req.body.userName }
                ]
            }}),
            userData = createUserData(req),
            token = req.token,
            deletedEmail = emailsDeletedModel.findOne({where:{email: req.body.email}})

        if (user !== null) return res.status(400).json({
            message: "Email, phoneNumber or userName is actually exist :("
        })

        if(deletedEmail !== null){
            userData["haveFreeTrial"] = false
            await emailsDeletedModel.destroy({where:{email: req.body.email}})
        }

        if(token.role === "admin" && req.body.role === "superAdmin") return res.status(401).json({
            message: "Access Denied :("
        })
        else userData["role"] = req.body.role

        let adminUser = await userModel.findByPk(token.UserId)
        userData["lastUpdatedUserName"] = adminUser.userName

        if (!req.file) {
            userData["image"] = null
        }else{
            let imgsrc = req.file.filename
            let directoryPath = __dirname.replace("controllers", "public/images/")
            let imageData = fs.readFileSync(directoryPath+imgsrc)
            userData["image"] = imageData
            fs.unlink(directoryPath + imgsrc, (err) => {
                if (err) return res.status(500).json({
                    message: "Delete logo from server error: " + err
                })
            })
        }

        await sequelize.transaction(async (t) => {
            user = await userModel.create(userData, { transaction: t })
            /* // ---------- Verification Email ----------------
            let verificationEmailToken = crypto.createHash('sha256').update(crypto.randomBytes(32).toString('hex')).digest('hex');
            await verifiedEmailTokenModel.create({UserId:user.id, token: verificationEmailToken}, { transaction: t })
            let to = user.email,
                subject = "Verification Email",
                message = `Hello ${user.firstName}, Verify your email address so we know it's really you, and so we can send you important information about your Farm Vision account.`,
                link = {
                    url: verifiedEmailLink + `/${user.id}/${verificationEmailToken}`,
                    describtion: "Verify email address"
                }
            await nodeMail(to, subject, message, link)
            // ---------------------------------------------- */
        })

        return res.status(200).json({
            message: "User Created Successfully :)",
            id: user.id
        })
        // return res.status(200).json({
        //     message: "User Created Successfully but not verified so please check this emails to verify then he can login :)",
        //     id: user.id
        // })
    } catch (err) {
        return res.status(500).json({
            message: "Create User Error: " + err
        })
    }
}

const updateUser = async (req, res) => {
    try {
        let user = req.user,
            token = req.token,
            userData = {}
            
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
        
        if (!req.file) {
            userData["image"] = user.image
        }else{
            let imgsrc = req.file.filename
            let directoryPath = __dirname.replace("controllers", "public/images/")
            let imageData = fs.readFileSync(directoryPath+imgsrc)
            userData["image"] = imageData
            fs.unlink(directoryPath + imgsrc, (err) => {
                if (err) return res.status(500).json({
                    message: "Delete logo from server error: " + err
                })
            })
        }

        await userModel.update(userData, {where: { id: user.id }})

        return res.status(200).json({
            message: "User Updated Successfully :)"
        })
    } catch (err) {
        return res.status(500).json({
            message:"Update User Error: " + err
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        let user = req.user

        await sequelize.transaction(async (t) => {
            await emailsDeletedModel.create({email:user.email}, {transaction: t})
            await userModel.destroy({where: { id: user.id }, transaction: t})
        })

        return res.status(200).json({
            message: "User Deleted Successfully :)"
        })

    } catch (err) {
        return res.status(500).json({
            message:"Delete User Error: " + err
        })
    }
}

const updateRole = async (req, res) => {
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

const updatePassword = async (req, res) => {
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

const login = async (req, res) => {
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

            // if(!user.verified) return res.status(401).json({
            //     message: "Please check your email to verify email first..!"
            // })

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
    verifyEmail
}