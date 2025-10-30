const PermissionHandler = require("../../Utilities/PermissionHandler")

async function SaleReportByDoctor(req, res, next) {
    PermissionHandler(req, next, 'paymentplanscreen')
}

async function SaleReportByLocation(req, res, next) {
    PermissionHandler(req, next, 'paymentplanscreen')
}

async function VisitProductReport(req, res, next) {
    PermissionHandler(req, next, 'paymentplanscreen')
}

async function UserSaleReport(req, res, next) {
    PermissionHandler(req, next, 'paymentplanscreen')
}

async function DailySalesReport(req, res, next) {
    PermissionHandler(req, next, 'paymentplanscreen')
}

async function MonthlySalesReport(req, res, next) {
    PermissionHandler(req, next, 'paymentplanscreen')
}

module.exports = {
    SaleReportByDoctor,
    SaleReportByLocation,
    VisitProductReport,
    UserSaleReport,
    DailySalesReport,
    MonthlySalesReport
}