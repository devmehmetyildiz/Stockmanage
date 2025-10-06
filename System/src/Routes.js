const Routes = [
    { method: 'get', path: '/Mailsettings/GetActiveMailsetting', controller: 'Mailsetting', action: 'GetActiveMailsetting' },
    { method: 'get', path: '/Mailsettings/:mailsettingId', controller: 'Mailsetting', action: 'GetMailsetting' },
    { method: 'get', path: '/Mailsettings', controller: 'Mailsetting', action: 'GetMailsettings' },
    { method: 'post', path: '/Mailsettings', controller: 'Mailsetting', action: 'AddMailsetting' },
    { method: 'put', path: '/Mailsettings', controller: 'Mailsetting', action: 'UpdateMailsetting' },
    { method: 'delete', path: '/Mailsettings/:mailsettingId', controller: 'Mailsetting', action: 'DeleteMailsetting' },

    { method: 'get', path: '/Rules/Getrulelogs/:ruleId', controller: 'Rule', action: 'GetRulelogs' },
    { method: 'get', path: '/Rules/:ruleId', controller: 'Rule', action: 'GetRule' },
    { method: 'get', path: '/Rules', controller: 'Rule', action: 'GetRules' },
    { method: 'post', path: '/Rules', controller: 'Rule', action: 'AddRule' },
    { method: 'put', path: '/Rules', controller: 'Rule', action: 'UpdateRule' },
    { method: 'delete', path: '/Rules/StopRule/:ruleId', controller: 'Rule', action: 'StopRule' },
    { method: 'delete', path: '/Rules/Clearrulelogs/:ruleId', controller: 'Rule', action: 'ClearRulelogs' },
    { method: 'delete', path: '/Rules/:ruleId', controller: 'Rule', action: 'DeleteRule' },

    { method: 'get', path: '/Approvalrequests/Counts', controller: 'Approvalrequest', action: 'GetApprovalrequestCounts' },
    { method: 'get', path: '/Approvalrequests', controller: 'Approvalrequest', action: 'GetApprovalrequests' },
    { method: 'put', path: '/Approvalrequests/Approve', controller: 'Approvalrequest', action: 'ApproveApprovalrequests' },
    { method: 'put', path: '/Approvalrequests/Reject', controller: 'Approvalrequest', action: 'RejectApprovalrequests' },
]

module.exports = Routes