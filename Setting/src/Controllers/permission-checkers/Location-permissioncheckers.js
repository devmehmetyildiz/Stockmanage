const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetLocations(req, res, next) {
    PermissionHandler(req, next, 'locationscreen')
}

async function GetLocationsCount(req, res, next) {
    PermissionHandler(req, next, 'locationscreen')
}

async function GetLocation(req, res, next) {
    PermissionHandler(req, next, 'locationscreen')
}

async function AddLocation(req, res, next) {
    PermissionHandler(req, next, 'locationadd')
}

async function UpdateLocation(req, res, next) {
    PermissionHandler(req, next, 'locationupdate')
}

async function DeleteLocation(req, res, next) {
    PermissionHandler(req, next, 'locationdelete')
}


module.exports = {
    GetLocation,
    GetLocations,
    GetLocationsCount,
    AddLocation,
    UpdateLocation,
    DeleteLocation
}