const express = require("express")
const router = express.Router()
const postController = require("../controllers/postController")
const authrization = require("../middlewares/checkPermission/authrizationMW")
const checkPermissionOnPost = require("../middlewares/checkPermission/checkPermissionOnPostMW")
const checkOwner = require("../middlewares/checkPermission/checkOwnerMW")
const checkPostFound = require("../middlewares/checkFound/checkPostFoundMW")
const checkUserFound = require("../middlewares/checkFound/checkUserFoundMW")
const checkTagFound = require("../middlewares/checkFound/checkTagFoundMW")
const createPostValidator = require("../middlewares/validators/createPostValidatorMW")
const postTagsValidator = require("../middlewares/validators/postTagsValidatorMW")
const validID = require("../middlewares/validators/checkValidIDMW")
const upload = require("../middlewares/uploadImageMW")

router.get("/userposts/:id", validID, authrization, checkUserFound, postController.getPostsForUser)
router.get("/tagposts/:id", validID, authrization, checkTagFound, postController.getPostsForTag)
router.post("/like/:id", validID, authrization, checkPostFound, postController.like)
router.post("/dislike/:id", validID, authrization, checkPostFound, postController.disLike)

router.get("/", authrization, postController.getAllPosts)
router.get("/:id", validID, authrization, checkPostFound, postController.getPostById)
router.post("/", authrization, upload.array("images"), createPostValidator, postTagsValidator, postController.createPost)
router.put("/:id", validID, authrization, upload.array("images"), checkPostFound, checkOwner, createPostValidator, postTagsValidator, postController.updatePost)
router.delete("/:id", validID, authrization, checkPostFound, checkPermissionOnPost, postController.deletePost)


module.exports = router