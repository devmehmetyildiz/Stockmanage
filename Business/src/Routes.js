const Routes = [
    { method: 'get', path: '/Visits/Counts', controller: 'Visit', action: 'GetVisitCounts' },
    { method: 'get', path: '/Visits/:ID', controller: 'Visit', action: 'GetVisit' },
    { method: 'get', path: '/Visits', controller: 'Visit', action: 'GetVisits' },
    { method: 'post', path: '/Visits', controller: 'Visit', action: 'CreateVisit' },
    { method: 'put', path: '/Visits/UpdateVisitStocks', controller: 'Visit', action: 'UpdateVisitStocks' },
    { method: 'put', path: '/Visits/UpdateVisitDefines', controller: 'Visit', action: 'UpdateVisitDefines' },
    { method: 'put', path: '/Visits/UpdateVisitPaymentDefines', controller: 'Visit', action: 'UpdateVisitPaymentDefines' },
    { method: 'put', path: '/Visits/SendApprove', controller: 'Visit', action: 'SendApproveVisit' },
    { method: 'put', path: '/Visits/Complete', controller: 'Visit', action: 'CompleteVisit' },
    { method: 'put', path: '/Visits/Work', controller: 'Visit', action: 'WorkVisit' },
    { method: 'delete', path: '/Visits/:ID', controller: 'Visit', action: 'DeleteVisit' },

    { method: 'get', path: '/Paymentplans/Counts', controller: 'Paymentplan', action: 'GetPaymentplansCount' },
    { method: 'get', path: '/Paymentplans/Transactions', controller: 'Paymentplan', action: 'GetPaymenttransactions' },
    { method: 'get', path: '/Paymentplans/TransactionsCounts', controller: 'Paymentplan', action: 'GetPaymenttransactionCounts' },
    { method: 'get', path: '/Paymentplans/:ID', controller: 'Paymentplan', action: 'GetPaymentplan' },
    { method: 'get', path: '/Paymentplans', controller: 'Paymentplan', action: 'GetPaymentplans' },
    { method: 'put', path: '/Paymentplans/ApproveTransaction', controller: 'Paymentplan', action: 'ApproveTransaction' },

    { method: 'post', path: '/Reports/SaleReportByDoctor', controller: 'Report', action: 'SaleReportByDoctor' },
    { method: 'post', path: '/Reports/SaleReportByLocation', controller: 'Report', action: 'SaleReportByLocation' },
    { method: 'post', path: '/Reports/VisitProductReport', controller: 'Report', action: 'VisitProductReport' },
    { method: 'post', path: '/Reports/UserSaleReport', controller: 'Report', action: 'UserSaleReport' },
    { method: 'post', path: '/Reports/DailySalesReport', controller: 'Report', action: 'DailySalesReport' },
    { method: 'post', path: '/Reports/MonthlySalesReport', controller: 'Report', action: 'MonthlySalesReport' },
]

module.exports = Routes