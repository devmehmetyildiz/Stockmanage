const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('paymenttransactionModel', {
    ...defaultTableColumns,
    PaymentPlanID: {
        type: Sequelize.STRING
    },
    Paymentdate: {
        type: Sequelize.DATE
    },
    Amount: {
        type: Sequelize.FLOAT
    },
    PaymentMethod: {
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