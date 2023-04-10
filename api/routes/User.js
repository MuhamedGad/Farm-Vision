const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController.js")
const validID = require("../middlewares/checkValidIDMW")
const createUserValidator = require("../middlewares/createUserValidatorMW")
const updateUserValidator = require("../middlewares/updateUserValidatorMW")
const encryptPassword = require("../middlewares/ecryptPasswordMW")
const authrization = require("../middlewares/authrizationMW")
const checkUserFound = require("../middlewares/checkUserFoundMW")
const checkPermission = require("../middlewares/checkPermissionOnUserMW")
const confirmPassword = require("../middlewares/confirmPasswordMW")
const checkValidUserFeatures = require("../middlewares/userFeaturesValidatorMW.js")

router.get("/:id", validID, authrization, checkUserFound, checkPermission, userController.getUserByID)
router.post("/", createUserValidator, checkValidUserFeatures, confirmPassword, encryptPassword, userController.createUser)
router.put("/:id", validID, authrization, checkUserFound, checkPermission, updateUserValidator, checkValidUserFeatures, userController.updateUser)
router.delete("/:id", validID, authrization, checkUserFound, checkPermission, userController.deleteUser)

module.exports = router