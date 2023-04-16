const express = require("express")
const router = express.Router()
const loginValidator = require("../middlewares/validators/loginValidatorMW")
const userController = require("../controllers/userController")

router.post("/", loginValidator, userController.login)

module.exports = router