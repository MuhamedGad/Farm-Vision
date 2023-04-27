const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/files')
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

module.exports = multer({storage})