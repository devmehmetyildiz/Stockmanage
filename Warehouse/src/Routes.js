const Routes = [
  { method: 'get', path: '/Warehouses/Counts', controller: 'Warehouse', action: 'GetWarehousesCount' },
  { method: 'get', path: '/Warehouses/:ID', controller: 'Warehouse', action: 'GetWarehouse' },
  { method: 'get', path: '/Warehouses', controller: 'Warehouse', action: 'GetWarehouses' },
  { method: 'post', path: '/Warehouses', controller: 'Warehouse', action: 'AddWarehouse' },
  { method: 'put', path: '/Warehouses', controller: 'Warehouse', action: 'UpdateWarehouse' },
  { method: 'delete', path: '/Warehouses/:ID', controller: 'Warehouse', action: 'DeleteWarehouse' },
]

module.exports = Routes