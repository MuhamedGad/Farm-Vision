const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const helmet = require("helmet")
const port = process.env.PORT || 8888
const cors = require("cors")

const ModelsImage = require("./models/ModelsImage")
const ModelsVideo = require("./models/ModelsVideo")

const user = require("./routes/User")
const token = require("./routes/Token")
const login = require("./routes/Login")
const logout = require("./routes/Logout")
const admin = require("./routes/Admin")
const password = require("./routes/Password")
const post = require("./routes/Post")
const comment = require("./routes/Comment")
const feature = require("./routes/Feature")
const tag = require("./routes/Tag")
const report = require("./routes/Report")
const subscribe = require("./routes/Subscribe")

app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(helmet())
app.use(express.static("./public"))
app.use(cors())

app.use("/api/user", user)
app.use("/api/token", token)
app.use("/api/login", login)
app.use("/api/logout", logout)
app.use("/api/admin", admin)
app.use("/api/password", password)
app.use("/api/post", post)
app.use("/api/comment", comment)
app.use("/api/feature", feature)
app.use("/api/tag", tag)
app.use("/api/report", report)
app.use("/api/subscribe", subscribe)

app.use((req, res) => { res.status(400).json({ message: "Not Found This endpoint :(" }) })

app.listen(port, () => console.log(`Server listening on URL: http://localhost:${port}!`));