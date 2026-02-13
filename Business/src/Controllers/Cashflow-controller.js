const { FLOW_TYPE_MANUEL } = require("../Constants")
const { publishEvent } = require("../Services/MessageService")
const { sequelizeErrorCatcher, createValidationError } = require("../Utilities/Error")
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetCashflows(req, res, next) {
    try {
        const {
            startDate,
            endDate,
            isActive
        } = req.query;

        const query = `
            SELECT *
            FROM cashflows 
            WHERE Isactive = :isActive
            ${startDate ? `AND DATE(Processdate) >= :startDate` : ''}
            ${endDate ? `AND DATE(Processdate) <= :endDate` : ''}
        `;

        const results = await sequelize.query(query, {
            replacements: {
                isActive: isActive === 'true' || isActive === true ? 1 : 0,
                startDate,
                endDate
            },
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).json(results);
    } catch (error) {
        next(sequelizeErrorCatcher(error));
    }
}

async function GetCashflowGraph(req, res, next) {
    try {
        const { startDate, endDate } = req.query;

        const query = `
    SELECT 
        DATE(c.Processdate) as Date,
        SUM(CASE 
            WHEN c.Type = 1  THEN c.Amount 
            ELSE 0 
        END) as TotalIncome,
        
        SUM(CASE 
            WHEN c.Type = -1 THEN c.Amount 
            ELSE 0 
        END) as TotalExpense,
        
        SUM(CASE 
            WHEN c.Type = 1 THEN c.Amount 
            ELSE -c.Amount 
        END) as NetChange
    FROM cashflows c
    WHERE c.Isactive = true
    ${startDate ? `AND DATE(c.Processdate) >= :startDate` : ''}
    ${endDate ? `AND DATE(c.Processdate) <= :endDate` : ''}
    GROUP BY DATE(c.Processdate)
    ORDER BY DATE(c.Processdate) ASC
`;

        const dbResults = await sequelize.query(query, {
            replacements: { startDate, endDate },
            type: sequelize.QueryTypes.SELECT
        });

        const resultMap = new Map(dbResults.map(r => [r.Date, r]));

        let dailyReport = [];
        let summary = {
            GrandTotalIncome: 0,
            GrandTotalExpense: 0,
            GrandNetProfit: 0
        };

        if (startDate && endDate) {
            let current = new Date(startDate);
            const last = new Date(endDate);

            current.setHours(0, 0, 0, 0);
            last.setHours(0, 0, 0, 0);

            while (current <= last) {
                const dateStr = current.getFullYear() + '-' +
                    String(current.getMonth() + 1).padStart(2, '0') + '-' +
                    String(current.getDate()).padStart(2, '0');

                const found = resultMap.get(dateStr);

                const income = found ? Number(found.TotalIncome) : 0;
                const expense = found ? Number(found.TotalExpense) : 0;
                const net = found ? Number(found.NetChange) : 0;

                dailyReport.push({
                    Date: dateStr,
                    TotalIncome: income,
                    TotalExpense: expense,
                    NetChange: net
                });

                summary.GrandTotalIncome += income;
                summary.GrandTotalExpense += expense;
                summary.GrandNetProfit += net;

                current.setDate(current.getDate() + 1);
            }
        }

        return res.status(200).json({
            summary: summary,
            details: dailyReport
        });

    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function AddCashflow(req, res, next) {
    let validationErrors = []
    const {
        Type,
        Paymenttype,
        Processdate,
        Amount,
        Info
    } = req.body

    if (!validator.isNumber(Type)) {
        return next(createValidationError([req.t('Cashflows.Error.TypeRequired')], req.t('Cashflows'), req.language))
    }
    if (!validator.isNumber(Paymenttype)) {
        return next(createValidationError([req.t('Cashflows.Error.PaymenttypeRequired')], req.t('Cashflows'), req.language))
    }
    if (!validator.isISODate(Processdate)) {
        return next(createValidationError([req.t('Cashflows.Error.ProcessdateRequired')], req.t('Cashflows'), req.language))
    }
    if (!validator.isNumber(Amount)) {
        return next(createValidationError([req.t('Cashflows.Error.AmountRequired')], req.t('Cashflows'), req.language))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Cashflows'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'
    const itemUuid = uuid()

    try {
        await db.cashflowModel.create({
            Uuid: itemUuid,
            Type: Type,
            Parenttype: FLOW_TYPE_MANUEL,
            Paymenttype: Paymenttype,
            Processdate: Processdate,
            Amount: Amount,
            Info: Info,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true,
        }, { transaction: t })

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: {
                en: "Created",
                tr: "Oluşturuldu"
            }[req.language],
            service: req.t('Cashflows'),
            role: 'cashflownotification',
            message: {
                en: `${itemUuid} cash flow created by ${username}`,
                tr: `${itemUuid} cari işlemi ${username} tarafından oluşturuldu`
            }[req.language],
            pushurl: '/Cashflows'
        })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyCreated'), entity: itemUuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}
module.exports = {
    GetCashflows,
    AddCashflow,
    GetCashflowGraph
}
