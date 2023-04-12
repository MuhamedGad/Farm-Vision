const express = require("express")
const router = express.Router()
const authrization = require("../middlewares/authrizationMW")
const validID = require("../middlewares/checkValidIDMW")
const checkAdmin = require("../middlewares/checkAdminMW")
const checkTagFound = require("../middlewares/checkTagFoundMW")
const tagController = require("../controllers/tagController")
const createTagValidator = require("../middlewares/createTagValidatorMW")
const updateTagValidator = require("../middlewares/updateTagValidatorMW")

router.get("/", authrization, tagController.getAllTags)
router.get("/:id", validID, authrization, checkTagFound, tagController.getTagById)
router.post("/", authrization, checkAdmin, createTagValidator, tagController.createTag)
router.put("/:id", validID, authrization, checkAdmin, checkTagFound, updateTagValidator, tagController.updateTag)
router.delete("/:id", validID, authrization, checkAdmin, checkTagFound, tagController.deleteTag)

module.exports = router