const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetCashflows(req, res, next) {
    PermissionHandler(req, next, 'cashflowscreen')
}

async function GetCashflowGraph(req, res, next) {
    PermissionHandler(req, next, 'cashflowscreen')
}

async function AddCashflow(req, res, next) {
    PermissionHandler(req, next, 'cashflowadd')
}


module.exports = {
    GetCashflows,
    GetCashflowGraph,
    AddCashflow
}