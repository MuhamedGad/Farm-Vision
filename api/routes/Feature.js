const express = require("express")
const router = express.Router()
const authrization = require("../middlewares/authrizationMW")
const validID = require("../middlewares/checkValidIDMW")
const checkAdmin = require("../middlewares/checkAdminMW")
const checkFeatureFound = require("../middlewares/checkFeatureFoundMW")
const featureController = require("../controllers/featureController")
const createFeatureValidator = require("../middlewares/createFeatureValidatorMW")
const updateFeatureValidator = require("../middlewares/updateFeatureValidatorMW")

router.get("/", featureController.getAllFeatures)
router.get("/:id", validID, checkFeatureFound, featureController.getFeatureById)
router.post("/", authrization, checkAdmin, createFeatureValidator, featureController.createFeature)
router.put("/:id", validID, authrization, checkAdmin, checkFeatureFound, updateFeatureValidator, featureController.updateFeature)
router.delete("/:id", validID, authrization, checkAdmin, checkFeatureFound, featureController.deleteFeature)

module.exports = router