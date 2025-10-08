const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('stockmovementModel', {
    ...defaultTableColumns,
    StockID: {
        type: Sequelize.STRING
    },
    Type: {
        type: Sequelize.INTEGER
    },
    Amount: {
        type: Sequelize.INTEGER
    },
    Movementtype: {
        type: Sequelize.INTEGER
    },
    Movementdate: {
        type: Sequelize.DATE
    },
    Sourcetype: {
        type: Sequelize.INTEGER
    },
    SourceID: {
        type: Sequelize.STRING
    },
    UserID: {
        type: Sequelize.STRING
    },
}, {
    tableName: 'stockmovements',
    timestamps: false
});