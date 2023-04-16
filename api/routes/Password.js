const express = require("express")
const router = express.Router()
const authrization = require("../middlewares/checkPermission/authrizationMW")
const checkPermission = require("../middlewares/checkPermission/checkPermissionOnUserMW")
const validId = require("../middlewares/validators/checkValidIDMW")
const checkUserFound = require("../middlewares/checkFound/checkUserFoundMW")
const updatePasswordValidator = require("../middlewares/validators/updatePasswordValidatorMW")
const encryptPassword = require("../middlewares/ecryptPasswordMW")
const confirmPassword = require("../middlewares/validators/confirmPasswordMW")
const userController = require("../controllers/userController")

router.put("/:id", validId, authrization, checkUserFound, checkPermission, updatePasswordValidator, confirmPassword, encryptPassword, userController.updatePassword)

module.exports = router