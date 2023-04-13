const express = require("express")
const router = express.Router()
const authrization = require("../middlewares/checkPermission/authrizationMW")
const validID = require("../middlewares/validators/checkValidIDMW")
const checkAdmin = require("../middlewares/checkPermission/checkAdminMW")
const checkFeatureFound = require("../middlewares/checkFound/checkFeatureFoundMW")
const featureController = require("../controllers/featureController")
const createFeatureValidator = require("../middlewares/validators/createFeatureValidatorMW")
const updateFeatureValidator = require("../middlewares/validators/updateFeatureValidatorMW")

router.get("/", featureController.getAllFeatures)
router.get("/:id", validID, checkFeatureFound, featureController.getFeatureById)
router.post("/", authrization, checkAdmin, createFeatureValidator, featureController.createFeature)
router.put("/:id", validID, authrization, checkAdmin, checkFeatureFound, updateFeatureValidator, featureController.updateFeature)
router.delete("/:id", validID, authrization, checkAdmin, checkFeatureFound, featureController.deleteFeature)

module.exports = router