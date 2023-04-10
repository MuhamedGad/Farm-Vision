const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const tokenController = require("../controllers/tokenController")
const authrization = require("../middlewares/authrizationMW")
const checkAdmin = require("../middlewares/checkAdminMW")
const checkPermissionOnUser = require("../middlewares/checkPermissionOnUserMW")
const validId = require("../middlewares/checkValidIDMW")
const checkUserFound = require("../middlewares/checkUserFoundMW")
const createUserByAdminValidator = require("../middlewares/createUserByAdminValidatorMW")
const roleValidator = require("../middlewares/roleValidatorMW")
const encryptPassword = require("../middlewares/ecryptPasswordMW")
const confirmPassword = require("../middlewares/confirmPasswordMW")
const checkValidUserFeatures = require("../middlewares/userFeaturesValidatorMW.js")

// User routes
router.get("/user", authrization, checkAdmin, userController.getAllUsers)
router.post("/user", authrization, checkAdmin, createUserByAdminValidator, checkValidUserFeatures, confirmPassword, encryptPassword, userController.addUserByAdmin)
// router.post("/:password", adminController.checkPassOfCreateAdmin, createUserValidator, confirmPassword, encryptPassword, adminController.addAdmin)
router.put("/user/:id", validId, authrization, checkAdmin, checkUserFound, checkPermissionOnUser, roleValidator, userController.updateRole)

// Token routes
router.get("/token", authrization, checkAdmin, tokenController.getAllTokens)
router.get("/token/:id", validId, authrization, checkAdmin,
// to use the same function of normal user
(req, res, next)=>{
    req.token.UserId = req.params.id;next()
},
tokenController.getTokensForUser)

module.exports = router