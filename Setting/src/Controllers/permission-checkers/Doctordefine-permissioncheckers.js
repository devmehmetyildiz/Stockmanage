const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetDoctordefines(req, res, next) {
    PermissionHandler(req, next, 'doctordefinescreen')
}

async function GetDoctordefinesCount(req, res, next) {
    PermissionHandler(req, next, 'doctordefinescreen')
}

async function GetDoctordefine(req, res, next) {
    PermissionHandler(req, next, 'doctordefinescreen')
}

async function AddDoctordefine(req, res, next) {
    PermissionHandler(req, next, 'doctordefineadd')
}

async function UpdateDoctordefine(req, res, next) {
    PermissionHandler(req, next, 'doctordefineupdate')
}

async function DeleteDoctordefine(req, res, next) {
    PermissionHandler(req, next, 'doctordefinedelete')
}


module.exports = {
    GetDoctordefine,
    GetDoctordefines,
    GetDoctordefinesCount,
    AddDoctordefine,
    UpdateDoctordefine,
    DeleteDoctordefine
}