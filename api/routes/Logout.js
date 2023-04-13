const express = require("express")
const router = express.Router()
const tokenController = require("../controllers/tokenController")
const authrization = require("../middlewares/checkPermission/authrizationMW")

router.post("/", authrization, tokenController.logout)

module.exports = router