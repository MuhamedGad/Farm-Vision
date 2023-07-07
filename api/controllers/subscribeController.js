const userModel = require("../models/User")
const featureModel = require("../models/Feature")
const userFeaturesModel = require("../models/UserFeatures")
const Secret_Key = 'sk_test_51N72caLzGzihVWNoN6t3MFV2eC2bjhdcxeNeUf8o1UnHhtOQo6zHXsijz3YFj28OdVM1JrUw0n36Ul4t3my2dNfh00xxEN6psM'
const stripe = require('stripe')(Secret_Key)

const calcTotalPrice = async(req, res, next)=>{
    try{
        const token = req.token
        const user = await userModel.findByPk(token.UserId)
        if(user.premium){
            return res.status(400).json({message: "This account already subscribed..!"})
        }else{
            const features = await userFeaturesModel.findAndCountAll({where: {UserId: user.id}})
            let totalPrice = 0
            for(let i = 0; i<features.count; i++){
                let feature = await featureModel.findByPk(features.rows[i].FeatureId)
                totalPrice += feature.price
            }
            req.totalPrice = totalPrice
            next()
        }
    }catch(err){
        return res.status(500).json({message: "Calculate Price Error: " + err})
    }
}

const gainMoney = (req, res)=>{
    let token = req.token
    // Moreover you can take more details from user
    // like Address, Name, etc from form
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Gourav Hammad',
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '452331',
            city: 'Indore',
            state: 'Madhya Pradesh',
            country: 'India',
        }
    })
    .then((customer) => {
        return stripe.charges.create({
            amount: 2500, // Charging Rs 25
            description: 'Web Development Product',
            currency: 'INR',
            customer: customer.id
        });
    })
    .then(async(charge) => {
        await userModel.update({premium: true, haveFreeTrial: false}, {where: {id: token.UserId}})
        return res.status(200).json({message: "Payment Success :)"})
    })
    .catch((err) => {
        return res.status(500).json({message: "Payment Error: " + err})
    });
}



module.exports = {
    calcTotalPrice,
    gainMoney
}