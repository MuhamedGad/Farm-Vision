const express = require("express")
const router = express.Router()
const upload = require("../middlewares/uploadImageMW")
const controller = require("../controllers/aiModelController")

router.post("/", upload.single("image"), controller.runInsectsModel)
module.exports = router