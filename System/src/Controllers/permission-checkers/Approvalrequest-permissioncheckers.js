const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetApprovalrequests(req, res, next) {
    PermissionHandler(req, next, 'approvalrequestscreen')
}

async function GetApprovalrequestCounts(req, res, next) {
    PermissionHandler(req, next, 'approvalrequestscreen')
}

async function ApproveApprovalrequests(req, res, next) {
    PermissionHandler(req, next, 'approvalrequestupdate')
}

async function RejectApprovalrequests(req, res, next) {
    PermissionHandler(req, next, 'approvalrequestupdate')
}

module.exports = {
    GetApprovalrequestCounts,
    GetApprovalrequests,
    ApproveApprovalrequests,
    RejectApprovalrequests,
};
