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
        type: Sequelize.STRING
    },
    Referenceno: {
        type: Sequelize.STRING
    },
    Status: {
        type: Sequelize.BOOLEAN
    },
}, {
    tableName: 'paymenttransactions',
    timestamps: false
});