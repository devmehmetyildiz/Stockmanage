const { Op } = require("sequelize")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const { createValidationError } = require("../Utilities/Error")
const validator = require("../Utilities/Validator")

async function GetUserSalesReport(req, res, next) {
    let validationErrors = []
    const { Startdate, Enddate } = req.body

    if (!validator.isISODate(Startdate)) {
        validationErrors.push(req.t('Paymentplans.Error.StartdateRequired'))
    }
    if (!validator.isISODate(Enddate)) {
        validationErrors.push(req.t('Paymentplans.Error.EnddateRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Paymentplans'), req.language))
    }

    try {
        const query = `
            SELECT 
                v.\`UserID\` AS UserID,
                COUNT(DISTINCT v.\`Uuid\`) AS VisitCount,
                COALESCE(SUM(pp.\`Totalamount\`), 0) AS TotalSales,
                COALESCE(SUM(CASE WHEN pt.\`Status\` = TRUE THEN pt.\`Amount\` ELSE 0 END), 0) AS Paid,
                COALESCE(SUM(CASE WHEN pt.\`Status\` = FALSE THEN pt.\`Amount\` ELSE 0 END), 0) AS Unpaid,
                CASE 
                    WHEN SUM(pp.\`Totalamount\`) > 0 
                        THEN ROUND(SUM(CASE WHEN pt.\`Status\` = TRUE THEN pt.\`Amount\` ELSE 0 END) / SUM(pp.\`Totalamount\`) * 100, 2)
                    ELSE 0 
                END AS CollectionRate
            FROM \`visits\` v
            LEFT JOIN \`paymentplans\` pp ON pp.\`VisitID\` = v.\`Uuid\` AND pp.\`Isactive\` = TRUE
            LEFT JOIN \`paymenttransactions\` pt ON pt.\`PaymentplanID\` = pp.\`Uuid\` AND pt.\`Isactive\` = TRUE
            WHERE 
                v.\`Isactive\` = TRUE
                AND v.\`Visitdate\` BETWEEN :Startdate AND :Enddate
            GROUP BY v.\`UserID\`
            ORDER BY TotalSales DESC;
        `;

        const query1 = `
        select * from 
        
        
        `

        const results = await db.sequelize.query(query, {
            replacements: { Startdate, Enddate },
            type: db.Sequelize.QueryTypes.SELECT
        });
        console.log('results: ', results);
        
        res.status(200).json(results);

    } catch (error) {
        return next(sequelizeErrorCatcher(error));
    }
}



module.exports = {
    GetUserSalesReport
}
