const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('stockdefineModel', {
    ...defaultTableColumns,
    Productname: {
        type: Sequelize.STRING
    },
    Brand: {
        type: Sequelize.STRING
    },
    Model: {
        type: Sequelize.STRING
    },
    Category: {
        type: Sequelize.STRING
    },
    Diameter: {
        type: Sequelize.STRING
    },
    Length: {
        type: Sequelize.STRING
    },
    Material: {
        type: Sequelize.STRING
    },
    Surfacetreatment: {
        type: Sequelize.STRING
    },
    Connectiontype: {
        type: Sequelize.STRING
    },
    Suppliername: {
        type: Sequelize.STRING
    },
    Suppliercontact: {
        type: Sequelize.STRING
    },
    Description: {
        type: Sequelize.STRING
    },
}, {
    tableName: 'stockdefines',
    timestamps: false
});