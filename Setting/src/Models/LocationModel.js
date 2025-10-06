const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('locationModel', {
    ...defaultTableColumns,
    Name: {
        type: Sequelize.STRING
    },
    Description: {
        type: Sequelize.STRING
    },
}, {
    tableName: 'locations',
    timestamps: false
});