const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const upload = require("../middlewares/uploadImageMW")
const validID = require("../middlewares/validators/checkValidIDMW")
const authrization = require("../middlewares/checkPermission/authrizationMW")
const checkUserFound = require("../middlewares/checkFound/checkUserFoundMW")
const checkPermission = require("../middlewares/checkPermission/checkPermissionOnUserMW")

router.get("/:id", authrization, checkUserFound, userController.getLogo)
router.put("/:id", validID, authrization, checkUserFound, checkPermission, upload.single("image"), userController.updateLogo)

module.exports = router