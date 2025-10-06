module.exports = sequelize.define('tableconfigModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UserID: {
        type: Sequelize.STRING
    },
    Key: {
        type: Sequelize.STRING
    },
    Config: {
        type: Sequelize.TEXT
    }
}, {
    tableName: 'tableconfigs', // replace with the name of your existing table
    timestamps: false
});