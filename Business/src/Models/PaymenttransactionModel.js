const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('paymenttransactionModel', {
    ...defaultTableColumns,
    PaymentplanID: {
        type: Sequelize.STRING
    },
    Paymentdate: {
        type: Sequelize.DATE
    },
    Type: {
        type: Sequelize.INTEGER
    },
    Amount: {
        type: Sequelize.FLOAT
    },
    Paymentmethod: {
        type: Sequelize.INTEGER
    },
    Referenceno: {
        type: Sequelize.STRING
    },
    Paydate: {
        type: Sequelize.DATE
    },
    Status: {
        type: Sequelize.BOOLEAN
    },
}, {
    tableName: 'paymenttransactions',
    timestamps: false
});