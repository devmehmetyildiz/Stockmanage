const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('doctordefineModel', {
    ...defaultTableColumns,
    Name: {
        type: Sequelize.STRING
    },
    Surname: {
        type: Sequelize.STRING
    },
    CountryID: {
        type: Sequelize.STRING
    },
    Address: {
        type: Sequelize.TEXT
    },
    LocationID: {
        type: Sequelize.STRING
    },
    Gender: {
        type: Sequelize.INTEGER
    },
    Phonenumber1: {
        type: Sequelize.STRING
    },
    Phonenumber2: {
        type: Sequelize.STRING
    },
    Email: {
        type: Sequelize.STRING
    },
    Specialization: {
        type: Sequelize.STRING
    },
    Status: {
        type: Sequelize.BOOLEAN
    },
    Role: {
        type: Sequelize.STRING
    },
    Description: {
        type: Sequelize.STRING
    },
}, {
    tableName: 'doctordefines',
    timestamps: false
});