const userModel = require("../models/User")
const userFeaturesModel = require("../models/UserFeatures")
const paymentModel = require("../models/Payment")
const sequelize = require("../models/sequelize")
const config = require("config")
const stripe = require("stripe")(config.get("stripeSecretKey"))
const nodeMail = require("../util/nodeMail")
const frontendAddress = "http://localhost:5173"

const getPublishabeKey = (req, res)=>{
    return res.status(200).json({key: config.get("stripePublishableKey")})
}

const unsubscribe = async(userId, features)=>{
    try{
        let user = await userModel.findByPk(userId)
        let message = `Hello ${user.firstName}, We would like to inform you that your subscription period finished and you should subscribe again to be able to user our features(${features})`,
            email = user.email,
            subject = "End subscribtion"

        nodeMail(email, subject, message)
        await sequelize.transaction(async t=>{
            await userFeaturesModel.destroy({where:{UserId:userId}, transaction: t})
            await userModel.update({premium: false}, {where:{id:userId}, transaction: t})
        })
    }catch(err){
        console.log(err)
    }
}

const warnningBefore5Days = async(userId, features)=>{
    try{
        let user = await userModel.findByPk(userId)
        let message = `Hello ${user.firstName}, We would like to inform you that you have only 5 of the 30 days of your subscribe to use our services(${features}). So, please, go to subscribe page and renew your subscribtion..!`,
            email = user.email,
            subject = "Warnning of end subscribtion"
    
        nodeMail(email, subject, message)
    }catch(err){
        console.log(err)
    }
}

const getAllPayments = async(req, res)=>{
    try{
        const payments = await paymentModel.findAndCountAll()
        return res.status(200).json({
            message: "Get payments successfully",
            data: payments.rows,
            length: payments.count
        })
    }catch(err){
        return res.status(500).json({
            message: "Get all payments error: " + err
        })
    }
}

const getPaymentById = async(req, res)=>{
    const payment = req.payment
    return res.status(200).json({
        message: "Get payment successfully",
        data: payment
    })
}

const getUserPayments = async(req, res)=>{
    try{
        const token = req.token
        const payments = await paymentModel.findAndCountAll({where:{UserId: token.UserId}})
        return res.status(200).json({
            message: "Get user payments successfully",
            data: payments.rows,
            length: payments.count
        })
    }catch(err){
        return res.status(500).json({
            message: "Get user payments error: " + err
        })
    }
}

const createPaymentData = (req, res, next)=>{
    const features = req.features
    let product = {}
    let featuresNames = []
    let price = 0
    for(let i = 0; i < features.length; i++){
        price += features[i].price
        featuresNames.push(features[i].feature)
    }
    product["name"] = "Subscribe in premium services"
    product["price"] = price
    product["quantity"] = 1
    product["describtion"] = "payment for " + featuresNames.join(", ") +" features"
    req.product = product
    next()
}

const createPaymentSession = async(req, res, next)=>{
    const product = req.product
    try{
        const session = await stripe.checkout.sessions.create({ 
            payment_method_types: ["card"], 
            line_items: [ 
                { 
                    price_data: { 
                        currency: "usd", 
                        product_data: {name: product.name,}, 
                        unit_amount: product.price * 100
                    }, 
                    quantity: product.quantity,
                }, 
            ], 
            mode: "payment", 
            success_url: frontendAddress+"/pricing/success", 
            cancel_url: frontendAddress+"/pricing/failed", 
        });
        req.sessionId = session.id
        next()
    }catch(err){
        return res.status(500).json({
            message: "Subscribe Session Error: " + err
        })
    }
}

const storePaymentDetails = async(req, res)=>{
    const token = req.token
    const product = req.product
    const features = req.features
    const sessionId = req.sessionId
    try{
        await sequelize.transaction(async (t) => {
            const user = await userModel.findByPk(token.UserId)
            for (let i = 0; i < features.length; i++) {
                await userFeaturesModel.create({FeatureId: features[i].id, UserId: token.UserId}, { transaction: t })
            }
            const payment = await paymentModel.create({
                price: product.price,
                describtion:product.describtion,
                UserId:token.UserId
            }, {transaction: t})

            setTimeout(warnningBefore5Days, 2160000000, token.userId, features.join(", "))
            setTimeout(unsubscribe, 2592000000, token.UserId, features.join(", "))

            if(!user.premium) await userModel.update({premium:true}, {where:{id:token.UserId}, transaction: t})

            return res.status(200).json({
                message: "Subscribtion completed",
                sessionId: sessionId,
            })
        })
    }catch(err){
        return res.status(500).json({
            message: "Subscribe DB Error: " + err
        })
    }
}

module.exports = {
    createPaymentData,
    createPaymentSession,
    storePaymentDetails,
    getAllPayments,
    getPaymentById,
    getUserPayments,
    getPublishabeKey
}