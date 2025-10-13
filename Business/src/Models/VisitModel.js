const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('visitModel', {
    ...defaultTableColumns,
    Visitcode: {
        type: Sequelize.STRING
    },
    UserID: {
        type: Sequelize.STRING
    },
    DoctorID: {
        type: Sequelize.STRING
    },
    WarehouseID: {
        type: Sequelize.STRING
    },
    LocationID: {
        type: Sequelize.STRING
    },
    PaymenttypeID: {
        type: Sequelize.STRING
    },
    Visitdate: {
        type: Sequelize.DATE
    },
    Visitstartdate: {
        type: Sequelize.DATE
    },
    Visitenddate: {
        type: Sequelize.STRING
    },
    Status: {
        type: Sequelize.INTEGER
    },
    Notes: {
        type: Sequelize.STRING
    },
    Scheduledpayment: {
        type: Sequelize.FLOAT
    },
}, {
    tableName: 'visits',
    timestamps: false
});