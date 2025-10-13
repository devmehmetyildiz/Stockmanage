const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('paymentplanModel', {
    ...defaultTableColumns,
    VisitID: {
        type: Sequelize.STRING
    },
    PaymenttypeID: {
        type: Sequelize.STRING
    },
    TotalAmount: {
        type: Sequelize.FLOAT
    },
    InstallmentCount: {
        type: Sequelize.INTEGER
    },
    InstallmentInterval: {
        type: Sequelize.INTEGER
    },
    DueDays: {
        type: Sequelize.INTEGER
    },
    StartDate: {
        type: Sequelize.DATE
    },
    EndDate: {
        type: Sequelize.DATE
    },
    Status: {
        type: Sequelize.INTEGER
    },
}, {
    tableName: 'paymentplans',
    timestamps: false
});