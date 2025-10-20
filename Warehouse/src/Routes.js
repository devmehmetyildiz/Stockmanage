const Routes = [
  { method: 'get', path: '/Warehouses/Counts', controller: 'Warehouse', action: 'GetWarehousesCount' },
  { method: 'get', path: '/Warehouses/:ID', controller: 'Warehouse', action: 'GetWarehouse' },
  { method: 'get', path: '/Warehouses', controller: 'Warehouse', action: 'GetWarehouses' },
  { method: 'post', path: '/Warehouses', controller: 'Warehouse', action: 'AddWarehouse' },
  { method: 'put', path: '/Warehouses', controller: 'Warehouse', action: 'UpdateWarehouse' },
  { method: 'delete', path: '/Warehouses/:ID', controller: 'Warehouse', action: 'DeleteWarehouse' },
  
  { method: 'get', path: '/Stocks/GetStocks', controller: 'Stock', action: 'GetStocks' },
  { method: 'get', path: '/Stocks/GetMovements', controller: 'Stock', action: 'GetStockmovements' },
  { method: 'get', path: '/Stocks/GetLast5MovementsByWarehouse/:ID', controller: 'Stock', action: 'GetLast5MovementsByWarehouse' },
  { method: 'post', path: '/Stocks/CreateStock', controller: 'Stock', action: 'CreateStock' },
  { method: 'put', path: '/Stocks/UseStockList', controller: 'Stock', action: 'UseStockList' },
  { method: 'put', path: '/Stocks/UseStock', controller: 'Stock', action: 'UseStock' },
  { method: 'put', path: '/Stocks/InsertStock', controller: 'Stock', action: 'InsertStock' },
  { method: 'put', path: '/Stocks/InsertStockList', controller: 'Stock', action: 'InsertStockList' },
  { method: 'delete', path: '/Stocks/DeleteStock/:ID', controller: 'Stock', action: 'DeleteStock' },
  { method: 'delete', path: '/Stocks/DeleteMovement/:ID', controller: 'Stock', action: 'DeleteStockmovement' },
]

module.exports = Routes