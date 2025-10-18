const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPaymentplansCount(req, res, next) {
    PermissionHandler(req, next, 'paymentplanscreen')
}

async function GetPaymentplans(req, res, next) {
    PermissionHandler(req, next, 'paymentplanscreen')
}

async function GetPaymentplan(req, res, next) {
    PermissionHandler(req, next, 'paymentplanscreen')
}

module.exports = {
    GetPaymentplansCount,
    GetPaymentplans,
    GetPaymentplan,
}