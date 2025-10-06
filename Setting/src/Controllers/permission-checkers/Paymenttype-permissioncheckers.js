const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPaymenttypes(req, res, next) {
    PermissionHandler(req, next, 'paymenttypescreen')
}

async function GetPaymenttypesCount(req, res, next) {
    PermissionHandler(req, next, 'paymenttypescreen')
}

async function GetPaymenttype(req, res, next) {
    PermissionHandler(req, next, 'paymenttypescreen')
}

async function AddPaymenttype(req, res, next) {
    PermissionHandler(req, next, 'paymenttypeadd')
}

async function UpdatePaymenttype(req, res, next) {
    PermissionHandler(req, next, 'paymenttypeupdate')
}

async function DeletePaymenttype(req, res, next) {
    PermissionHandler(req, next, 'paymenttypedelete')
}


module.exports = {
    GetPaymenttype,
    GetPaymenttypes,
    GetPaymenttypesCount,
    AddPaymenttype,
    UpdatePaymenttype,
    DeletePaymenttype
}