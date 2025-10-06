module.exports = sequelize.define('approvalrequestModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    Service: {
        type: Sequelize.STRING
    },
    Message: {
        type: Sequelize.STRING
    },
    Table: {
        type: Sequelize.STRING
    },
    Record: {
        type: Sequelize.STRING
    },
    Detiallink: {
        type: Sequelize.STRING
    },
    RequestTime: {
        type: Sequelize.DATE
    },
    RequestUserID: {
        type: Sequelize.STRING
    },
    ApproveTime: {
        type: Sequelize.DATE
    },
    ApproveUserID: {
        type: Sequelize.STRING
    },
    ApproveRoles: {
        type: Sequelize.STRING
    },
    Isapproved: {
        type: Sequelize.BOOLEAN
    },
    Isrejected: {
        type: Sequelize.BOOLEAN
    },
    Comment: {
        type: Sequelize.STRING
    },
    Deleteduser: {
        type: Sequelize.STRING
    },
    Deletetime: {
        type: Sequelize.DATE
    },
    Isactive: {
        type: Sequelize.BOOLEAN
    }
}, {
    tableName: 'approvalrequests', // replace with the name of your existing table
    timestamps: false
});