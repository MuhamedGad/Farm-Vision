const express = require("express")
const router = express.Router()
const authrization = require("../middlewares/authrizationMW")
const tokenController = require("../controllers/tokenController")

router.post("/", authrization, tokenController.logout)

module.exports = router