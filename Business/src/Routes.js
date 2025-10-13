const Routes = [
    { method: 'get', path: '/Visits/Counts', controller: 'Visit', action: 'GetVisitCounts' },
    { method: 'get', path: '/Visits/:ID', controller: 'Visit', action: 'GetVisit' },
    { method: 'get', path: '/Visits', controller: 'Visit', action: 'GetVisits' },
    { method: 'post', path: '/Visits', controller: 'Visit', action: 'CreateVisit' },
    { method: 'put', path: '/Visits/UpdateVisitStocks', controller: 'Visit', action: 'UpdateVisitStocks' },
    { method: 'put', path: '/Visits/UpdateVisitDefines', controller: 'Visit', action: 'UpdateVisitDefines' },
]

module.exports = Routes