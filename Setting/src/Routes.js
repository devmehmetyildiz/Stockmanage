const Routes = [
    { method: 'get', path: '/Cases/Counts', controller: 'Case', action: 'GetCasesCount' },
    { method: 'get', path: '/Cases/:ID', controller: 'Case', action: 'GetCase' },
    { method: 'get', path: '/Cases', controller: 'Case', action: 'GetCases' },
    { method: 'post', path: '/Cases', controller: 'Case', action: 'AddCase' },
    { method: 'put', path: '/Cases', controller: 'Case', action: 'UpdateCase' },
    { method: 'delete', path: '/Cases/:ID', controller: 'Case', action: 'DeleteCase' },

    { method: 'get', path: '/Stockdefines/Counts', controller: 'Stockdefine', action: 'GetStockdefinesCount' },
    { method: 'get', path: '/Stockdefines/:ID', controller: 'Stockdefine', action: 'GetStockdefine' },
    { method: 'get', path: '/Stockdefines', controller: 'Stockdefine', action: 'GetStockdefines' },
    { method: 'post', path: '/Stockdefines', controller: 'Stockdefine', action: 'AddStockdefine' },
    { method: 'put', path: '/Stockdefines', controller: 'Stockdefine', action: 'UpdateStockdefine' },
    { method: 'delete', path: '/Stockdefines/:ID', controller: 'Stockdefine', action: 'DeleteStockdefine' },

    { method: 'get', path: '/Paymenttypes/Counts', controller: 'Paymenttype', action: 'GetPaymenttypesCount' },
    { method: 'get', path: '/Paymenttypes/:ID', controller: 'Paymenttype', action: 'GetPaymenttype' },
    { method: 'get', path: '/Paymenttypes', controller: 'Paymenttype', action: 'GetPaymenttypes' },
    { method: 'post', path: '/Paymenttypes', controller: 'Paymenttype', action: 'AddPaymenttype' },
    { method: 'put', path: '/Paymenttypes', controller: 'Paymenttype', action: 'UpdatePaymenttype' },
    { method: 'delete', path: '/Paymenttypes/:ID', controller: 'Paymenttype', action: 'DeletePaymenttype' },

    { method: 'get', path: '/Doctordefines/Counts', controller: 'Doctordefine', action: 'GetDoctordefinesCount' },
    { method: 'get', path: '/Doctordefines/:ID', controller: 'Doctordefine', action: 'GetDoctordefine' },
    { method: 'get', path: '/Doctordefines', controller: 'Doctordefine', action: 'GetDoctordefines' },
    { method: 'post', path: '/Doctordefines', controller: 'Doctordefine', action: 'AddDoctordefine' },
    { method: 'put', path: '/Doctordefines', controller: 'Doctordefine', action: 'UpdateDoctordefine' },
    { method: 'delete', path: '/Doctordefines/:ID', controller: 'Doctordefine', action: 'DeleteDoctordefine' },

    { method: 'get', path: '/Locations/Counts', controller: 'Location', action: 'GetLocationsCount' },
    { method: 'get', path: '/Locations/:ID', controller: 'Location', action: 'GetLocation' },
    { method: 'get', path: '/Locations', controller: 'Location', action: 'GetLocations' },
    { method: 'post', path: '/Locations', controller: 'Location', action: 'AddLocation' },
    { method: 'put', path: '/Locations', controller: 'Location', action: 'UpdateLocation' },
    { method: 'delete', path: '/Locations/:ID', controller: 'Location', action: 'DeleteLocation' },
]

module.exports = Routes