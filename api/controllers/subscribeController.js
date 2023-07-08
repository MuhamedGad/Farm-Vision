const userModel = require("../models/User")
const userFeaturesModel = require("../models/UserFeatures")
const paymentModel = require("../models/Payment")
const sequelize = require("../models/sequelize")
const config = require("config")
const stripe = require("stripe")(config.get("stripeSecretKey"))

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

const CreatePaymentSession = async(req, res, next)=>{
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
            success_url: "http://localhost:3000/success", 
            cancel_url: "http://localhost:3000/cancel", 
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
            await userFeaturesModel.destroy({where:{UserId: token.UserId}, transaction: t})
            for (let i = 0; i < features.length; i++) {
                await userFeaturesModel.create({FeatureId: features[i].id, UserId: token.UserId}, { transaction: t })
            }
            await userModel.update({premium:true}, {where:{id:token.UserId}, transaction: t})
            const payment = await paymentModel.create({
                name:product.name,
                price: product.price,
                describtion:product.describtion,
                UserId:token.UserId
            }, {transaction: t})
    
            return res.status(200).json({
                message: "Subscribtion completed",
                sessionId: sessionId,
            });
        })
    }catch(err){
        return res.status(500).json({
            message: "Subscribe DB Error: " + err
        })
    }
}

module.exports = {
    createPaymentData,
    CreatePaymentSession,
    storePaymentDetails
}