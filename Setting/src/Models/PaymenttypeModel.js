const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('paymenttypeModel', {
    ...defaultTableColumns,
    Name: {
        type: Sequelize.STRING
    },
    Description: {
        type: Sequelize.STRING
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
}, {
    tableName: 'paymenttypes',
    timestamps: false
});