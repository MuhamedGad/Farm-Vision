const express = require("express")
const router = express.Router()
const postController = require("../controllers/postController")
const authrization = require("../middlewares/checkPermission/authrizationMW")
const checkPermissionOnPost = require("../middlewares/checkPermission/checkPermissionOnPostMW")
const checkPostFound = require("../middlewares/checkFound/checkPostFoundMW")
const checkUserFound = require("../middlewares/checkFound/checkUserFoundMW")
const createPostValidator = require("../middlewares/validators/createPostValidatorMW")
const postTagsValidator = require("../middlewares/validators/postTagsValidatorMW")
const validID = require("../middlewares/validators/checkValidIDMW")

router.get("/userposts/:id", authrization, checkUserFound, postController.getPostsForUser)
router.post("/like/:id", validID, authrization, checkPostFound, postController.like)
router.post("/dislike/:id", validID, authrization, checkPostFound, postController.disLike)

router.get("/", authrization, postController.getAllPosts)
router.get("/:id", validID, authrization, checkPostFound, postController.getPostById)
router.post("/", authrization, createPostValidator, postTagsValidator, postController.createPost)
router.put("/:id", validID, authrization, checkPostFound, checkPermissionOnPost, createPostValidator, postTagsValidator, postController.updatePost)
router.delete("/:id", validID, authrization, checkPostFound, checkPermissionOnPost, postController.deletePost)


module.exports = router