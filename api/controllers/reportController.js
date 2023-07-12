const userModel = require('../models/User');
const reportModel = require('../models/Report');

const getAllReports = async (req, res) => {
    try {
        const reports = await reportModel.findAndCountAll();
        const reportsData = [];
        for (let i = 0; i < reports.count; i++) {
            const user = await userModel.findByPk(reports.rows[i].UserId);
            reportsData.push({
                id: reports.rows[i].id,
                title: reports.rows[i].title,
                describtion: reports.rows[i].describtion,
                type: reports.rows[i].type,
                user: {userName: user.userName, firstName: user.firstName, lastName: user.lastName, role: user.role}
            });
        }
        return res.status(200).json({
            message: "found reports",
            length: reports.count,
            data: reportsData,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Get all reports Error: " + error,
        });
    }
}

const getReport = async (req, res) => {
    const report = req.report;
    const user = await userModel.findByPk(report.UserId);
    const reportData = {
        id: report.id,
        title: report.title,
        describtion: report.describtion,
        type: report.type,
        user: {userName: user.userName, firstName: user.firstName, lastName: user.lastName, role: user.role}
    }
    return res.status(200).json({
        message: "found report",
        data: reportData
    });
}

const getMyReports = async (req, res) => {
    try {
        const   token = req.token,
                reports = await reportModel.findAndCountAll({where: {UserId: token.UserId}})
        return res.status(200).json({
            message: "found reports",
            length: reports.count,
            data: reports.rows,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Get My reports Error: " + error,
        });
    }
}

const createReport = async (req, res) => {
    try {
        const   token = req.token,
                reportData = {}

        reportData["title"] = req.body.title
        reportData["describtion"] = req.body.describtion
        reportData["type"] = req.body.type
        reportData["UserId"] = token.UserId

        const report = await reportModel.create(reportData)

        return res.status(200).json({
            message: "report created successfully",
            id: report.id
        });
    } catch (error) {
        return res.status(500).json({
            message: "Create report Error: " + error,
        });
    }
}

const updateReport = async (req, res) => {
    try {
        const   report = req.report,
                reportData = {}

        reportData["title"] = req.body.title || report.title
        reportData["describtion"] = req.body.describtion || report.describtion
        reportData["type"] = req.body.type || report.type

        await reportModel.update(reportData, {where: {id: report.id}})

        return res.status(200).json({
            message: "report updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Update report Error: " + error,
        });
    }
}

const deleteReport = async (req, res) => {
    try {
        const report = req.report;
        await reportModel.destroy({where: {id: report.id}})
        return res.status(200).json({
            message: "report deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Delete report Error: " + error,
        })
    }
}

const reportRepair = async (req, res) => {
    try {
        const report = req.report;
        await reportModel.update({status: "repaired"}, {where: {id: report.id}})
        return res.status(200).json({
            message: "report repaired successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Repair report Error: " + error,
        });
    }
}

module.exports = {
    getAllReports,
    getReport,
    getMyReports,
    createReport,
    updateReport,
    deleteReport,
    reportRepair
}


