const express = require("express")
const router = express.Router()
const authrization = require("../middlewares/checkPermission/authrizationMW")
const subscribeController = require("../controllers/subscribeController")
const config = require("config")
const stripe = require("stripe")(config.get("stripeSecretKey"));
const userModel = require("../models/User")

router.post("/", authrization, async(req, res, next)=>{
    const token = req.token
    const features = req.body.features
    const user = await userModel.findByPk(token.UserId)
    
},async(req, res)=>{
    const { product } = req.body; 
    const session = await stripe.checkout.sessions.create({ 
        payment_method_types: ["card"], 
        line_items: [ 
            { 
                price_data: { 
                    currency: "inr", 
                    product_data: { 
                        name: product.name,
                    }, 
                    unit_amount: product.price * 100, 
                }, 
                quantity: product.quantity, 
            }, 
        ], 
        mode: "payment", 
        success_url: "http://localhost:3000/success", 
        cancel_url: "http://localhost:3000/cancel", 
    }); 
    return res.status(200).json({ id: session.id });
})

module.exports = router