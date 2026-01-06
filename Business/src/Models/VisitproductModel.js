const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('visitproductModel', {
    ...defaultTableColumns,
    VisitID: {
        type: Sequelize.STRING
    },
    WarehouseID: {
        type: Sequelize.STRING
    },
    StockID: {
        type: Sequelize.STRING
    },
    Amount: {
        type: Sequelize.INTEGER
    },
    Returnedamount: {
        type: Sequelize.INTEGER
    },
    Istaken: {
        type: Sequelize.BOOLEAN
    },
    IsReturned: {
        type: Sequelize.BOOLEAN
    },
    Returndescription: {
        type: Sequelize.STRING
    },
    Description: {
        type: Sequelize.STRING
    },
}, {
    tableName: 'visitproducts',
    timestamps: false
});