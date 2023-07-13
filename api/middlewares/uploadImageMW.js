const multer = require("multer")
const path = require("path")

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb("Please upload only images.", false)
    }
}

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images')     // './public/images/' directory name where save the images
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

module.exports = multer({ storage: storage/* , fileFilter: imageFilter  */})