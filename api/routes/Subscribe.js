const express = require("express")
const router = express.Router()
const stripe = require("stripe")
const authrization = require("../middlewares/checkPermission/authrizationMW")
const Publishable_Key = 'pk_test_51N72caLzGzihVWNoSbs97CxSFoRMKkP1nJP2lJGyBOLYE6754wI5NE0GF3Hhq68aS1kcAAZL6ar971ycYWbMWM7Z009CQxhwRY'
const subscribeController = require("../controllers/subscribeController")

// router.get("/", authrization, subscribeController.calcTotalPrice, (req, res)=>{return res.render('payment', {Publishable_Key, totalPrice: req.totalPrice})})
router.get("/", authrization, (req, res)=>{return res.render('index')})
// router.post("/", authrization, subscribeController.gainMoney)

router.post("/", /* authrization, */ (req, res) => {
    try {
        console.log(1)
        console.log(req.body.stripeToken)
        stripe.customers.create({
            name: "Mohamed",
            email: "mohamed@mo.com",
            source: req.body.stripeToken
        })
        .then(customer => {
            console.log(2)
            stripe.charges.create({
                amount: 100,
                currency: "usd",
                customer: customer.id
            })
        })
        .then(() => {
            console.log(3)
            res.render("completed")
        })
        .catch(err => console.log(err));
    } catch (err) {
        res.send(err);
    }
});

module.exports = router