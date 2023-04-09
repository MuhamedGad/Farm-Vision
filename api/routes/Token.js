const express = require("express")
const router = express.Router()
const controller = require("../controllers/tokenController")
const authrization = require("../middlewares/authrizationMW")
const checkPermission = require("../middlewares/checkPermissionOnTokenMW")
const checkTokenFound = require("../middlewares/checkTokenFoundMW")
const validID = require("../middlewares/checkValidIDMW")

router.get("/", authrization, controller.getTokensForUser)
router.get("/:id", validID, authrization, checkTokenFound, checkPermission, controller.getTokenByID)
router.delete("/:id", validID, authrization, checkTokenFound, checkPermission, controller.logoutFromOtherDevice)

module.exports = router