const express = require("express")
const router = express.Router()
const tokenController = require("../controllers/tokenController")
const authrization = require("../middlewares/authrizationMW")
const checkPermissionOnToken = require("../middlewares/checkPermissionOnTokenMW")
const checkTokenFound = require("../middlewares/checkTokenFoundMW")
const validID = require("../middlewares/checkValidIDMW")

router.get("/", authrization, tokenController.getTokensForUser)
router.get("/:id", validID, authrization, checkTokenFound, checkPermissionOnToken, tokenController.getTokenByID)
router.delete("/:id", validID, authrization, checkTokenFound, checkPermissionOnToken, tokenController.logoutFromOtherDevice)

module.exports = router