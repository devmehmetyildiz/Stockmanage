const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('stockModel', {
    ...defaultTableColumns,
    WarehouseID: {
        type: Sequelize.STRING
    },
    StokdefineID: {
        type: Sequelize.STRING
    },
    Sourcetype: {
        type: Sequelize.INTEGER
    },
    SourceID: {
        type: Sequelize.STRING
    },
}, {
    tableName: 'stocks',
    timestamps: false
});