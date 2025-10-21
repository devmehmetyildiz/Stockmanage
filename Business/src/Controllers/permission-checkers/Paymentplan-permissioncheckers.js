const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPaymentplansCount(req, res, next) {
    PermissionHandler(req, next, 'paymentplanscreen')
}

async function GetPaymentplans(req, res, next) {
    PermissionHandler(req, next, 'paymentplanscreen')
}

async function GetPaymenttransactions(req, res, next) {
    PermissionHandler(req, next, 'paymentplanscreen')
}

async function GetPaymenttransactionCounts(req, res, next) {
    PermissionHandler(req, next, 'paymentplanscreen')
}

async function GetPaymentplan(req, res, next) {
    PermissionHandler(req, next, 'paymentplanscreen')
}

async function ApproveTransaction(req, res, next) {
    PermissionHandler(req, next, 'paymentplanupdate')
}

module.exports = {
    GetPaymentplansCount,
    GetPaymentplans,
    GetPaymentplan,
    GetPaymenttransactions,
    GetPaymenttransactionCounts,
    ApproveTransaction
}