const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('stockModel', {
    ...defaultTableColumns,
    WarehouseID: {
        type: Sequelize.STRING
    },
    StockdefineID: {
        type: Sequelize.STRING
    },
}, {
    tableName: 'stocks',
    timestamps: false
});