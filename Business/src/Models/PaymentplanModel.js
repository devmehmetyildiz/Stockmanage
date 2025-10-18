const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('paymentplanModel', {
    ...defaultTableColumns,
    VisitID: {
        type: Sequelize.STRING
    },
    PaymenttypeID: {
        type: Sequelize.STRING
    },
    Totalamount: {
        type: Sequelize.FLOAT
    },
    Prepaymentamount: {
        type: Sequelize.FLOAT
    },
    Remainingvalue: {
        type: Sequelize.FLOAT
    },
    Installmentcount: {
        type: Sequelize.INTEGER
    },
    Installmentinterval: {
        type: Sequelize.INTEGER
    },
    Duedays: {
        type: Sequelize.INTEGER
    },
    Startdate: {
        type: Sequelize.DATE
    },
    Enddate: {
        type: Sequelize.DATE
    },
    Status: {
        type: Sequelize.INTEGER
    },
}, {
    tableName: 'paymentplans',
    timestamps: false
});