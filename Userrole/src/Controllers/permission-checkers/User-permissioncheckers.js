const PermissionHandler = require("../../Utilities/PermissionHandler")

async function Register(req, res, next) {
    next()
}

async function GetUsersList(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function GetUsersCounts(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function GetUsers(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function GetUser(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function AddUser(req, res, next) {
    PermissionHandler(req, next, 'useradd')
}

async function UpdateUser(req, res, next) {
    PermissionHandler(req, next, 'userupdate')
}

async function RemoveUsers(req, res, next) {
    PermissionHandler(req, next, 'userremove')
}

async function UpdateUsercase(req, res, next) {
    PermissionHandler(req, next, 'userupdatecase')
}

async function UpdateUsermovement(req, res, next) {
    PermissionHandler(req, next, 'userupdatemovement')
}

async function DeleteUsermovement(req, res, next) {
    PermissionHandler(req, next, 'userdeletemovement')
}

async function DeleteUser(req, res, next) {
    PermissionHandler(req, next, 'userdelete')
}

async function GetUsersforshift(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function GetUserMovements(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function GetUserIncomeOutcome(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

async function GetUserOutcome(req, res, next) {
    PermissionHandler(req, next, 'userscreen')
}

module.exports = {
    GetUsersList,
    GetUsersCounts,
    GetUsers,
    GetUser,
    AddUser,
    UpdateUser,
    DeleteUser,
    Register,
    GetUsersforshift,
    UpdateUsercase,
    UpdateUsermovement,
    DeleteUsermovement,
    RemoveUsers,
    GetUserMovements,
    GetUserIncomeOutcome,
    GetUserOutcome
}