const express = require('express');
const router = express.Router();
const reportConstroller = require('../controllers/reportController');
const createReportValidatorMW = require('../middlewares/validators/createReportValidatorMW');
const updateReportValidatorMW = require('../middlewares/validators/updateReportValidatorMW');
const authrization = require("../middlewares/checkPermission/authrizationMW")
const validID = require("../middlewares/validators/checkValidIDMW")
const checkAdmin = require("../middlewares/checkPermission/checkAdminMW")
const checkOwner = require("../middlewares/checkPermission/checkOwnerMW")
const checkPermission = require("../middlewares/checkPermission/checkPermissionOnReportMW")
const checkReportFound = require("../middlewares/checkFound/checkReportFoundMW")

router.get("/getMyReports", authrization, reportConstroller.getMyReports)
router.put("/reportRepaired/:id", validID, authrization, checkAdmin, checkReportFound, reportConstroller.reportRepair)

router.get('/', authrization, checkAdmin, reportConstroller.getAllReports);
router.get('/:id', validID, authrization, checkReportFound, checkPermission, reportConstroller.getReport);
router.post('/', authrization, createReportValidatorMW, reportConstroller.createReport);
router.put('/:id', validID, authrization, checkReportFound, checkOwner, updateReportValidatorMW, reportConstroller.updateReport);
router.delete('/:id', validID, authrization, checkReportFound, checkPermission, reportConstroller.deleteReport);

module.exports = router;