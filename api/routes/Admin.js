const express = require("express")
const router = express.Router()
const adminController = require("../controllers/adminController")
const authrization = require("../middlewares/authrizationMW")
const checkAdmin = require("../middlewares/checkAdminMW")
const validId = require("../middlewares/checkValidIDMW")
const checkUserFound = require("../middlewares/checkUserFoundMW")
const createUserValidator = require("../middlewares/createUserValidatorMW")
const encryptPassword = require("../middlewares/ecryptPasswordMW")
const confirmPassword = require("../middlewares/confirmPasswordMW")

router.post("/", authrization, checkAdmin, createUserValidator, confirmPassword, encryptPassword, adminController.addUser)
// router.post("/:password", adminController.checkPassOfCreateAdmin, createUserValidator, confirmPassword, encryptPassword, adminController.addAdmin)
router.put("/:id", validId, authrization, checkAdmin, checkUserFound, adminController.updateAdmin)

module.exports = router