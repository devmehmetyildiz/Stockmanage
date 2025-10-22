const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetUserSalesReport(req, res, next) {
    PermissionHandler(req, next, 'paymentplanscreen')
}

module.exports = {
    GetUserSalesReport,
}