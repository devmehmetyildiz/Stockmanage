const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('cashflowModel', {
    ...defaultTableColumns,
    Type: {
        type: Sequelize.INTEGER,
    },
    Parenttype: {
        type: Sequelize.INTEGER,
    },
    ParentID: {
        type: Sequelize.STRING,
    },
    TransactionID: {
        type: Sequelize.STRING,
    },
    Paymenttype: {
        type: Sequelize.INTEGER,
    },
    Processdate: {
        type: Sequelize.DATE,
    },
    Amount: {
        type: Sequelize.FLOAT,
    },
    Info: {
        type: Sequelize.TEXT,
    },
}, {
    tableName: 'cashflows',
    timestamps: false
});