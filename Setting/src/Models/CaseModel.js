const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('caseDataModel', {
    ...defaultTableColumns,
    Name: {
        type: Sequelize.STRING
    },
    Color: {
        type: Sequelize.STRING
    },
    Type: {
        type: Sequelize.INTEGER
    },
    Isdefault: {
        type: Sequelize.BOOLEAN
    },
    Description: {
        type: Sequelize.STRING
    },
}, {
    tableName: 'cases',
    timestamps: false
});