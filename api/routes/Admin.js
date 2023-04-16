const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const tokenController = require("../controllers/tokenController")
const authrization = require("../middlewares/checkPermission/authrizationMW")
const checkAdmin = require("../middlewares/checkPermission/checkAdminMW")
const checkPermissionOnUser = require("../middlewares/checkPermission/checkPermissionOnUserMW")
const validId = require("../middlewares/validators/checkValidIDMW")
const checkUserFound = require("../middlewares/checkFound/checkUserFoundMW")
const createUserValidator = require("../middlewares/validators/createUserValidatorMW")
const roleValidator = require("../middlewares/validators/roleValidatorMW")
const encryptPassword = require("../middlewares/ecryptPasswordMW")
const confirmPassword = require("../middlewares/validators/confirmPasswordMW")
const checkValidUserFeatures = require("../middlewares/validators/userFeaturesValidatorMW")

router.get("/user", authrization, checkAdmin, userController.getAllUsers)
router.post("/user", authrization, checkAdmin, createUserValidator, checkValidUserFeatures, confirmPassword, encryptPassword, userController.addUserByAdmin)
router.put("/user/:id", validId, authrization, checkAdmin, checkUserFound, checkPermissionOnUser, roleValidator, userController.updateRole)
// router.post("/:password", adminController.checkPassOfCreateAdmin, createUserValidator, confirmPassword, encryptPassword, adminController.addAdmin)

router.get("/token", authrization, checkAdmin, tokenController.getAllTokens)
router.get("/token/:id", validId, authrization, checkAdmin, (req, res, next)=>{req.token.UserId = req.params.id;next()}, tokenController.getTokensForUser)

module.exports = router