const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('visitproductModel', {
    ...defaultTableColumns,
    VisitID: {
        type: Sequelize.STRING
    },
    StockID: {
        type: Sequelize.STRING
    },
    Amount: {
        type: Sequelize.INTEGER
    },
    Istaken: {
        type: Sequelize.BOOLEAN
    },
    IsReturned: {
        type: Sequelize.BOOLEAN
    },
    Description: {
        type: Sequelize.STRING
    },
}, {
    tableName: 'visitproducts',
    timestamps: false
});