const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('stockmovementModel', {
    ...defaultTableColumns,
    StockID: {
        type: Sequelize.STRING
    },
    Type: {
        type: Sequelize.INTEGER
    },
    Amount: {
        type: Sequelize.INTEGER
    },
}, {
    tableName: 'stockmovements',
    timestamps: false
});