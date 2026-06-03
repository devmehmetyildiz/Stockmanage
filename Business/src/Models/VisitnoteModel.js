const { defaultTableColumns } = require("../Constants/DefaultColumns");

module.exports = sequelize.define('visitnoteModel', {
    ...defaultTableColumns,
    VisitID: {
        type: Sequelize.STRING
    },
    Note: {
        type: Sequelize.TEXT
    },
}, {
    tableName: 'visitnotes',
    timestamps: false
});