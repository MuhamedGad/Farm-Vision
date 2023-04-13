const express = require("express")
const router = express.Router()
const tokenController = require("../controllers/tokenController")
const authrization = require("../middlewares/checkPermission/authrizationMW")
const checkPermissionOnToken = require("../middlewares/checkPermission/checkPermissionOnTokenMW")
const checkTokenFound = require("../middlewares/checkFound/checkTokenFoundMW")
const validID = require("../middlewares/validators/checkValidIDMW")

router.get("/", authrization, tokenController.getTokensForUser)
router.get("/:id", validID, authrization, checkTokenFound, checkPermissionOnToken, tokenController.getTokenByID)
router.delete("/:id", validID, authrization, checkTokenFound, checkPermissionOnToken, tokenController.logoutFromOtherDevice)

module.exports = router