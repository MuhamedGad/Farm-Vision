const express = require("express")
const router = express.Router()
const adminController = require("../controllers/adminController")
const authrization = require("../middlewares/authrizationMW")
const checkAdmin = require("../middlewares/checkAdminMW")
const checkPermission = require("../middlewares/checkPermissionOnUserMW")
const validId = require("../middlewares/checkValidIDMW")
const checkUserFound = require("../middlewares/checkUserFoundMW")
const createUserValidator = require("../middlewares/createUserValidatorMW")
const roleValidator = require("../middlewares/roleValidatorMW")
const encryptPassword = require("../middlewares/ecryptPasswordMW")
const confirmPassword = require("../middlewares/confirmPasswordMW")
const checkValidUserFeatures = require("../middlewares/userFeaturesValidatorMW.js")

router.post("/", authrization, checkAdmin, createUserValidator, checkValidUserFeatures, confirmPassword, encryptPassword, adminController.addUser)
// router.post("/:password", adminController.checkPassOfCreateAdmin, createUserValidator, confirmPassword, encryptPassword, adminController.addAdmin)
router.put("/:id", validId, authrization, checkAdmin, checkUserFound, checkPermission, roleValidator, adminController.updateRole)

module.exports = router