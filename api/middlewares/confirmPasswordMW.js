module.exports = (req, res, next)=>{
    if(req.body.password === req.body.confirmPassword) next()
    else {
        let token = req.header("x-auth-token")
        return res.status(400).json({
            message: "password not equal confirm password :(",
            token
        })
    }
}