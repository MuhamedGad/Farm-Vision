const reportModel = require("../../models/Report")

module.exports = async(req, res, next)=>{
    try {
        let report = await reportModel.findByPk(req.params.id)
        if(report === null) return res.status(404).json({
            message: "Report Not Found :("
        })
        else {
            req.report = report
            next()
        }
    } catch (err) {
        return res.status(500).json({
            message: "Find Report Error: " + err
        })
    }
}