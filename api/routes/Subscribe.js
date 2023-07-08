const express = require("express")
const router = express.Router()
const authrization = require("../middlewares/checkPermission/authrizationMW")
const { createPaymentData, CreatePaymentSession, storePaymentDetails } = require("../controllers/subscribeController")
const checkValidUserFeatures = require("../middlewares/validators/userFeaturesValidatorMW.js")

router.post("/", authrization, checkValidUserFeatures, createPaymentData, CreatePaymentSession, storePaymentDetails)

module.exports = router