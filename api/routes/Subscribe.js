const express = require("express")
const router = express.Router()
const authrization = require("../middlewares/checkPermission/authrizationMW")
const Publishable_Key = 'pk_test_51N72caLzGzihVWNoSbs97CxSFoRMKkP1nJP2lJGyBOLYE6754wI5NE0GF3Hhq68aS1kcAAZL6ar971ycYWbMWM7Z009CQxhwRY'
const subscribeController = require("../controllers/subscribeController")

router.get("/", authrization, subscribeController.calcTotalPrice, (req, res)=>{return res.render('payment', {Publishable_Key, totalPrice: req.totalPrice})})
router.post("/", authrization, subscribeController.gainMoney)

module.exports = router