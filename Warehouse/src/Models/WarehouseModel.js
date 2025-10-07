const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('warehouseModel', {
    ...defaultTableColumns,
    Name: {
        type: Sequelize.STRING
    },
    Description: {
        type: Sequelize.STRING
    },
}, {
    tableName: 'warehouses',
    timestamps: false
});