const { Op } = require("sequelize")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const { createValidationError } = require("../Utilities/Error")
const validator = require("../Utilities/Validator")
const { VISIT_STATU_CLOSED } = require("../Constants")

async function SaleReportByDoctor(req, res, next) {
    let validationErrors = []
    const { Startdate, Enddate } = req.body

    if (!validator.isISODate(Startdate)) {
        validationErrors.push(req.t('Reports.Error.StartdateRequired'))
    }
    if (!validator.isISODate(Enddate)) {
        validationErrors.push(req.t('Reports.Error.EnddateRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Reports'), req.language))
    }

    try {
        const query = `
           SELECT
           s.DoctorID,
           COUNT(s.Uuid) AS VisitCount,
           SUM(pp.Totalamount) AS TotalPayment,
           SUM(pp.Totalamount) - SUM(pp.Remainingvalue) AS TotalRealPayment,
           SUM(pp.Remainingvalue) AS TotalRemaining
           FROM visits s
           LEFT JOIN paymentplans pp ON pp.VisitID = s.Uuid
           WHERE s.Visitdate BETWEEN :Startdate AND :Enddate
           AND s.Status IN (2,4)
           GROUP BY s.DoctorID
        `;


        const results = await db.sequelize.query(query, {
            replacements: { Startdate, Enddate },
            type: db.Sequelize.QueryTypes.SELECT
        });

        res.status(200).json(results);

    } catch (error) {
        return next(sequelizeErrorCatcher(error));
    }
}

async function SaleReportByLocation(req, res, next) {
    let validationErrors = []
    const { Startdate, Enddate } = req.body

    if (!validator.isISODate(Startdate)) {
        validationErrors.push(req.t('Reports.Error.StartdateRequired'))
    }
    if (!validator.isISODate(Enddate)) {
        validationErrors.push(req.t('Reports.Error.EnddateRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Reports'), req.language))
    }

    try {
        const query = `
           SELECT
           s.LocationID,
           COUNT(s.Uuid) AS VisitCount,
           SUM(pp.Totalamount) AS TotalPayment,
           SUM(pp.Totalamount) - SUM(pp.Remainingvalue) AS TotalRealPayment,
           SUM(pp.Remainingvalue) AS TotalRemaining
           FROM visits s
           LEFT JOIN paymentplans pp ON pp.VisitID = s.Uuid
           LEFT JOIN locations l ON l.Uuid = s.LocationID
           WHERE s.Visitdate BETWEEN :Startdate AND :Enddate
           AND s.Status IN (2,4)
           GROUP BY s.LocationID
        `;

        const results = await db.sequelize.query(query, {
            replacements: { Startdate, Enddate },
            type: db.Sequelize.QueryTypes.SELECT
        });

        res.status(200).json(results);

    } catch (error) {
        return next(sequelizeErrorCatcher(error));
    }
}

async function VisitProductReport(req, res, next) {
    let validationErrors = []
    const { Startdate, Enddate } = req.body

    if (!validator.isISODate(Startdate)) {
        validationErrors.push(req.t('Reports.Error.StartdateRequired'))
    }
    if (!validator.isISODate(Enddate)) {
        validationErrors.push(req.t('Reports.Error.EnddateRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Reports'), req.language))
    }

    try {
        const query = `
           SELECT
           vp.StockID,
           SUM(vp.Amount) AS SoldAmount,
           SUM(COALESCE(vp.Returnedamount, 0)) AS ReturnedAmount
           FROM visitproducts vp
           LEFT JOIN stockdefines sd ON sd.Uuid = vp.StockID
           LEFT JOIN visits s ON s.Uuid = vp.VisitID
           WHERE   
                s.Visitdate BETWEEN :Startdate AND :Enddate AND
                s.Status = :Status
           AND s.Status IN (2,4)
           GROUP BY vp.StockID
           ORDER BY SoldAmount DESC
        `;

        const results = await db.sequelize.query(query, {
            replacements: { Startdate, Enddate, Status: VISIT_STATU_CLOSED },
            type: db.Sequelize.QueryTypes.SELECT
        });

        res.status(200).json(results);

    } catch (error) {
        return next(sequelizeErrorCatcher(error));
    }
}

async function UserSaleReport(req, res, next) {
    let validationErrors = []
    const { Startdate, Enddate } = req.body

    if (!validator.isISODate(Startdate)) {
        validationErrors.push(req.t('Reports.Error.StartdateRequired'))
    }
    if (!validator.isISODate(Enddate)) {
        validationErrors.push(req.t('Reports.Error.EnddateRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Reports'), req.language))
    }

    try {
        const query = `
          SELECT
          s.UserID,
          COUNT(s.Uuid) AS VisitCount,
          SUM(pp.Totalamount) AS TotalPayment,
          AVG(pp.Totalamount) AS AvgPaymentPerVisit
          FROM visits s
          LEFT JOIN paymentplans pp ON pp.VisitID = s.Uuid
          LEFT JOIN users u ON u.Uuid = s.UserID
          WHERE s.Visitdate BETWEEN :Startdate AND :Enddate
          AND s.Status IN (2,4)
          GROUP BY s.UserID
        `;

        const results = await db.sequelize.query(query, {
            replacements: { Startdate, Enddate, Status: VISIT_STATU_CLOSED },
            type: db.Sequelize.QueryTypes.SELECT
        });

        res.status(200).json(results);

    } catch (error) {
        return next(sequelizeErrorCatcher(error));
    }
}

async function DailySalesReport(req, res, next) {
    let validationErrors = [];
    const { Startdate, Enddate } = req.body;

    if (!validator.isISODate(Startdate)) {
        validationErrors.push(req.t('Reports.Error.StartdateRequired'));
    }
    if (!validator.isISODate(Enddate)) {
        validationErrors.push(req.t('Reports.Error.EnddateRequired'));
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Reports'), req.language));
    }

    try {
        const query = `
          SELECT
            DATE(s.Visitdate) AS SalesDate,
            COUNT(s.Uuid) AS VisitCount,
            SUM(pp.Totalamount) AS TotalPayment
          FROM visits s
          LEFT JOIN paymentplans pp ON pp.VisitID = s.Uuid
          WHERE s.Visitdate BETWEEN :Startdate AND :Enddate
          AND s.Status IN (2,4)
          GROUP BY SalesDate
          ORDER BY SalesDate ASC
        `;

        const results = await db.sequelize.query(query, {
            replacements: { Startdate, Enddate },
            type: db.Sequelize.QueryTypes.SELECT
        });

        res.status(200).json(results);

    } catch (error) {
        return next(sequelizeErrorCatcher(error));
    }
}

async function MonthlySalesReport(req, res, next) {
    let validationErrors = [];
    const { Startdate, Enddate } = req.body;

    if (!validator.isISODate(Startdate)) {
        validationErrors.push(req.t('Reports.Error.StartdateRequired'));
    }
    if (!validator.isISODate(Enddate)) {
        validationErrors.push(req.t('Reports.Error.EnddateRequired'));
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Reports'), req.language));
    }

    try {
        const query = `
          SELECT
            DATE_FORMAT(s.Visitdate, '%Y-%m') AS SalesMonth,
            COUNT(s.Uuid) AS VisitCount,
            SUM(pp.Totalamount) AS TotalPayment
          FROM visits s
          LEFT JOIN paymentplans pp ON pp.VisitID = s.Uuid
          WHERE s.Visitdate BETWEEN :Startdate AND :Enddate
          AND s.Status IN (2,4)
          GROUP BY SalesMonth
          ORDER BY SalesMonth ASC
        `;

        const results = await db.sequelize.query(query, {
            replacements: { Startdate, Enddate },
            type: db.Sequelize.QueryTypes.SELECT
        });

        res.status(200).json(results);

    } catch (error) {
        return next(sequelizeErrorCatcher(error));
    }
}

module.exports = {
    SaleReportByDoctor,
    SaleReportByLocation,
    VisitProductReport,
    UserSaleReport,
    DailySalesReport,
    MonthlySalesReport,
}
