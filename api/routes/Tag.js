const express = require("express")
const router = express.Router()
const tagController = require("../controllers/tagController")
const authrization = require("../middlewares/checkPermission/authrizationMW")
const validID = require("../middlewares/validators/checkValidIDMW")
const checkAdmin = require("../middlewares/checkPermission/checkAdminMW")
const checkTagFound = require("../middlewares/checkFound/checkTagFoundMW")
const createTagValidator = require("../middlewares/validators/createTagValidatorMW")
const updateTagValidator = require("../middlewares/validators/updateTagValidatorMW")

router.post("/addTagRequest", authrization, createTagValidator, tagController.addTagRequest)
router.get("/", authrization, tagController.getAllTags)
router.get("/:id", validID, authrization, checkTagFound, tagController.getTagById)
router.post("/", authrization, checkAdmin, createTagValidator, tagController.createTag)
router.put("/:id", validID, authrization, checkAdmin, checkTagFound, updateTagValidator, tagController.updateTag)
router.delete("/:id", validID, authrization, checkAdmin, checkTagFound, tagController.deleteTag)

module.exports = router