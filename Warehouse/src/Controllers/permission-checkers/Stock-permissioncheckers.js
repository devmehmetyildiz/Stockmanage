const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetStocks(req, res, next) {
    PermissionHandler(req, next, 'stockscreen')
}

async function GetStockmovements(req, res, next) {
    PermissionHandler(req, next, 'stockscreen')
}

async function CreateStock(req, res, next) {
    PermissionHandler(req, next, 'stockadd')
}

async function InsertStock(req, res, next) {
    PermissionHandler(req, next, 'stockadd')
}

async function InsertStockList(req, res, next) {
    PermissionHandler(req, next, 'stockadd')
}

async function UseStock(req, res, next) {
    PermissionHandler(req, next, 'stockupdate')
}

async function UseStockList(req, res, next) {
    PermissionHandler(req, next, 'stockupdate')
}

async function DeleteStock(req, res, next) {
    PermissionHandler(req, next, 'stockdelete')
}

async function DeleteStockmovement(req, res, next) {
    PermissionHandler(req, next, 'stockdelete')
}


module.exports = {
    GetStocks,
    GetStockmovements,
    CreateStock,
    UseStock,
    UseStockList,
    InsertStock,
    DeleteStock,
    DeleteStockmovement,
    InsertStockList
}