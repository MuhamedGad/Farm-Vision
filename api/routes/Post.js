const express = require("express")
const router = express.Router()
const postController = require("../controllers/postController")
const authrization = require("../middlewares/authrizationMW")
const checkPermissionOnPost = require("../middlewares/checkPermissionOnPostMW")
const checkPostFound = require("../middlewares/checkPostFoundMW")
const checkUserFound = require("../middlewares/checkUserFoundMW")
const createPostValidator = require("../middlewares/createPostValidatorMW")
const validID = require("../middlewares/checkValidIDMW")

router.get("/userposts/:id", authrization, checkUserFound, postController.getPostsForUser)
router.post("/like/:id", validID, authrization, checkPostFound, postController.like)

router.get("/", authrization, postController.getAllPosts)
router.get("/:id", validID, authrization, checkPostFound, postController.getPostByID)
router.post("/", authrization, createPostValidator, postController.createPost)
router.put("/:id", validID, authrization, checkPostFound, checkPermissionOnPost, createPostValidator, postController.updatePost)
router.delete("/:id", validID, authrization, checkPostFound, checkPermissionOnPost, postController.deletePost)


module.exports = router