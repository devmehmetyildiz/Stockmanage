const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('visitModel', {
    ...defaultTableColumns,
    Visittype: {
        type: Sequelize.INTEGER
    },
    Visitcode: {
        type: Sequelize.STRING
    },
    WorkerUserID: {
        type: Sequelize.STRING
    },
    ResponsibleUserID: {
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
        type: Sequelize.DATE
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
    Finalpayment: {
        type: Sequelize.FLOAT
    },
    Isapproved: {
        type: Sequelize.BOOLEAN
    },
    Isrejected: {
        type: Sequelize.BOOLEAN
    },
    ApprovedUserID: {
        type: Sequelize.STRING
    },
    RejectedUserID: {
        type: Sequelize.STRING
    },
    ApproveDescription: {
        type: Sequelize.STRING
    },
    RejectDescription: {
        type: Sequelize.STRING
    },
    Description: {
        type: Sequelize.STRING
    },
}, {
    tableName: 'visits',
    timestamps: false
});