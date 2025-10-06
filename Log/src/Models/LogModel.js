module.exports = sequelize.define('logModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Service: {
        type: Sequelize.STRING
    },
    UserID: {
        type: Sequelize.STRING
    },
    Requesttype: {
        type: Sequelize.STRING
    },
    Requesturl: {
        type: Sequelize.STRING
    },
    Requestip: {
        type: Sequelize.STRING
    },
    Status: {
        type: Sequelize.STRING
    },
    Requestdata: {
        type: Sequelize.TEXT('medium')
    },
    Responsedata: {
        type: Sequelize.TEXT('medium')
    },
    Createtime: {
        type: Sequelize.DATE
    },
}, {
    tableName: 'logs',
    timestamps: false
});