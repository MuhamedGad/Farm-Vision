const paymentModel = require("../../models/Payment")

module.exports = async(req, res, next)=>{
    try {
        let payment = await paymentModel.findByPk(req.params.id)
        if(payment === null) return res.status(404).json({
            message: "Payment Not Found :("
        })
        else {
            req.payment = payment
            next()
        }
    } catch (err) {
        return res.status(500).json({
            message: "Find payment error: " + err
        })
    }
}