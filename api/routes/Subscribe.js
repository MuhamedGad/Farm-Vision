const express = require("express")
const router = express.Router()
const authrization = require("../middlewares/checkPermission/authrizationMW")
const paymentController = require("../controllers/subscribeController")
const checkValidUserFeatures = require("../middlewares/validators/userFeaturesValidatorMW.js")
const checkAdmin = require("../middlewares/checkPermission/checkAdminMW")
const checkPaymentFound = require("../middlewares/checkFound/checkPaymentFoundMW")
const checkPermission = require("../middlewares/checkPermission/checkPermissionOnPaymentMW")

router.get("/getMyPayments", authrization, paymentController.getUserPayments)

router.get("/", authrization, checkAdmin, paymentController.getAllPayments)
router.get("/:id", authrization, checkPaymentFound, checkPermission, paymentController.getPaymentById)
router.post("/", authrization, checkValidUserFeatures, paymentController.createPaymentData, paymentController.createPaymentSession, paymentController.storePaymentDetails)

module.exports = router