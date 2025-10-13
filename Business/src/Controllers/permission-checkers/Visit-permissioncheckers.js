const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetVisitCounts(req, res, next) {
    PermissionHandler(req, next, 'visitscreen')
}

async function GetVisits(req, res, next) {
    PermissionHandler(req, next, 'visitscreen')
}

async function GetVisit(req, res, next) {
    PermissionHandler(req, next, 'visitscreen')
}

async function CreateVisit(req, res, next) {
    PermissionHandler(req, next, 'visitadd')
}

async function UpdateVisitStocks(req, res, next) {
    PermissionHandler(req, next, 'visitupdate')
}

async function UpdateVisitDefines(req, res, next) {
    PermissionHandler(req, next, 'visitupdate')
}

module.exports = {
    GetVisitCounts,
    GetVisits,
    GetVisit,
    CreateVisit,
    UpdateVisitStocks,
    UpdateVisitDefines
}