const { sequelizeErrorCatcher, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const { publishEvent } = require("../Services/MessageService")
const DoPut = require("../Utilities/DoPut")
const DoGet = require("../Utilities/DoGet")
const config = require("../Config")
const { Op } = require('sequelize')

const VISIT_STATU_PLANNED = 0
const VISIT_STATU_WORKING = 1
const VISIT_STATU_COMPLETED = 2
const VISIT_STATU_ON_APPROVE = 3
const VISIT_STATU_CLOSED = 4
const VISIT_STATU_DECLINED = 5

const STOCK_SOURCETYPE_USER = 0
const STOCK_SOURCETYPE_PURCHASEORDER = 1
const STOCK_SOURCETYPE_VISIT = 2

const VISIT_PAYMENT_STATUS_NON = 0
const VISIT_PAYMENT_STATUS_SEMI = 1
const VISIT_PAYMENT_STATUS_FULL = 2

async function GetVisitCounts(req, res, next) {
    try {
        const visits = await db.visitModel.count({ where: req.query })
        res.status(200).json(visits)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetVisits(req, res, next) {
    try {
        const visits = await db.visitModel.findAll({ where: req.query })
        res.status(200).json(visits)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetVisit(req, res, next) {
    const Uuid = req.params.ID

    if (!validator.isUUID(Uuid)) {
        return next(createValidationError([req.t('Visits.Error.IDRequired')], req.t('Visits'), req.language))
    }

    try {
        const visit = await db.visitModel.findOne({ where: { Uuid: Uuid } })
        if (!visit) {
            return next(createNotFoundError(req.t('Visits.Error.NotFound'), req.t('Visits'), req.language))
        }
        if (!visit.Isactive) {
            return next(createNotFoundError(req.t('Visits.Error.NotActive'), req.t('Visits'), req.language))
        }

        const visitproducts = await db.visitproductModel.findAll({ where: { Isactive: true, VisitID: visit.Uuid } })
        visit.Products = visitproducts ?? []
        res.status(200).json(visit)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function CreateVisit(req, res, next) {
    let validationErrors = []
    const {
        UserID,
        DoctorID,
        LocationID,
        Visitdate,
        Notes,
        Stocks,
        WarehouseID,
        PaymenttypeID,
        Scheduledpayment
    } = req.body

    if (!validator.isUUID(UserID)) {
        validationErrors.push(req.t('Visits.Error.UserIDRequired'))
    }
    if (!validator.isUUID(DoctorID)) {
        validationErrors.push(req.t('Visits.Error.DoctorIDRequired'))
    }
    if (!validator.isUUID(LocationID)) {
        validationErrors.push(req.t('Visits.Error.LocationIDRequired'))
    }
    if (!validator.isArray(Stocks) || (Stocks || []).length <= 0) {
        validationErrors.push(req.t('Visits.Error.StocksRequired'))
    } else {
        for (const stock of Stocks) {
            if (!validator.isUUID(stock.Uuid)) {
                validationErrors.push(req.t('Visits.Error.StockIDRequired'))
            }
            if (!validator.isNumber(stock.Amount) || stock.Amount <= 0) {
                validationErrors.push(req.t('Visits.Error.AmountRequired'))
            }
        }
    }
    if (!validator.isISODate(Visitdate)) {
        validationErrors.push(req.t('Visits.Error.VisitdateRequired'))
    } else {
        const current = new Date()
        current.setHours(0, 0, 0, 0)
        if (new Date(Visitdate).getTime() < current.getTime()) {
            validationErrors.push(req.t('Visits.Error.VisitdateCantSmall'))
        }
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Visits'), req.language))
    }

    const doctor = await DoGet(config.services.Setting, 'Doctordefines/' + DoctorID)
    const location = await DoGet(config.services.Setting, 'Locations/' + LocationID)

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    const itemUuid = uuid()
    let visitCode = null

    const latestVisit = await db.visitModel.findOne({
        attributes: ['Visitcode'],
        where: { Isactive: true },
        order: [
            ['Createtime', 'DESC'],
        ],
        raw: true
    });

    if (latestVisit && latestVisit.Visitcode && (latestVisit.Visitcode ?? '').split('-').length >= 3) {
        const parts = latestVisit.Visitcode.split('-');
        const year = parts[0];
        const month = parts[1];
        const lastNumber = parseInt(parts[2], 10) || 0;
        const nextNumber = String(lastNumber + 1).padStart(4, "0");
        visitCode = `${year}-${month}-${nextNumber}`;
    } else {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        visitCode = `${year}-${month}-${String(1).padStart(4, "0")}`;
    }

    try {
        await db.visitModel.create({
            Uuid: itemUuid,
            Visitcode: visitCode,
            UserID,
            DoctorID,
            PaymenttypeID,
            WarehouseID,
            LocationID,
            Visitdate,
            Scheduledpayment,
            Status: 0,
            Notes,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true,
        }, { transaction: t })

        for (const stock of Stocks) {
            await db.visitproductModel.create({
                Uuid: uuid(),
                VisitID: itemUuid,
                StockID: stock.Uuid,
                Amount: stock.Amount,
                Istaken: false,
                IsReturned: false,
                Description: stock.Description,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true,
            }, { transaction: t })
        }

        await t.commit()

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'created',
            service: req.t('Visits'),
            role: 'visitnotification',
            message: {
                en: `${location?.Name} ${doctor?.Name} visit created by ${username}`,
                tr: `${location?.Name} Bölgesindeki ${doctor?.Name} için ziyaret ${username} tarafından oluşturuldu`
            }[req.language],
            pushurl: '/Visits'
        });

        res.status(200).json({ message: req.t('General.SuccessfullyCreated'), entity: itemUuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function UpdateVisitStocks(req, res, next) {

    let validationErrors = []
    const {
        VisitID,
        Stocks,
        WarehouseID
    } = req.body

    if (!validator.isUUID(VisitID)) {
        validationErrors.push(req.t('Visits.Error.VisitIDRequired'))
    }
    if (!validator.isUUID(WarehouseID)) {
        validationErrors.push(req.t('Visits.Error.WarehouseIDRequired'))
    }
    if (!validator.isArray(Stocks) || (Stocks || []).length <= 0) {
        validationErrors.push(req.t('Visits.Error.StocksRequired'))
    } else {
        for (const stock of Stocks) {
            if (!validator.isUUID(stock.Uuid)) {
                validationErrors.push(req.t('Visits.Error.StockIDRequired'))
            }
            if (!validator.isNumber(stock.Amount) || stock.Amount <= 0) {
                validationErrors.push(req.t('Visits.Error.AmountRequired'))
            }
        }
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Visits'), req.language))
    }

    const visit = await db.visitModel.findOne({ where: { Uuid: VisitID } })
    if (!visit) {
        return next(createNotFoundError(req.t('Visits.Error.NotFound'), req.t('Visits'), req.language))
    }
    if (!visit.Isactive) {
        return next(createNotFoundError(req.t('Visits.Error.NotActive'), req.t('Visits'), req.language))
    }
    if (visit.Status !== VISIT_STATU_PLANNED) {
        return next(createNotFoundError(req.t('Visits.Error.NotPlanned'), req.t('Visits'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'
    const createdEntities = []

    try {
        await db.visitproductModel.destroy({ where: { VisitID }, transaction: t });

        for (const stock of Stocks) {
            const itemUuid = uuid()
            createdEntities.push(itemUuid)

            await db.visitModel.update({
                WarehouseID,
                Updateduser: username,
                Updatetime: new Date(),
            }, { transaction: t, where: { Uuid: VisitID } })

            await db.visitproductModel.create({
                Uuid: itemUuid,
                VisitID,
                StockID: stock.Uuid,
                Amount: stock.Amount,
                Istaken: false,
                IsReturned: false,
                Description: stock.Description,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true,
            }, { transaction: t })
        }
        res.status(200).json({ message: req.t('General.SuccessfullyUpdated'), entities: createdEntities })
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function UpdateVisitDefines(req, res, next) {
    let validationErrors = []
    const {
        VisitID,
        Visitcode,
        UserID,
        DoctorID,
        LocationID,
        Visitdate,
        Notes,
        PaymenttypeID,
        Scheduledpayment
    } = req.body

    if (!validator.isUUID(VisitID)) {
        validationErrors.push(req.t('Visits.Error.VisitIDRequired'))
    }
    if (!validator.isUUID(UserID)) {
        validationErrors.push(req.t('Visits.Error.UserIDRequired'))
    }
    if (!validator.isUUID(DoctorID)) {
        validationErrors.push(req.t('Visits.Error.DoctorIDRequired'))
    }
    if (!validator.isUUID(LocationID)) {
        validationErrors.push(req.t('Visits.Error.LocationIDRequired'))
    }
    if (!validator.isISODate(Visitdate)) {
        validationErrors.push(req.t('Visits.Error.VisitdateRequired'))
    } else {
        const current = new Date()
        current.setHours(0, 0, 0, 0)
        if (new Date(Visitdate).getTime() < current.getTime()) {
            validationErrors.push(req.t('Visits.Error.VisitdateCantSmall'))
        }
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Visits'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const visit = await db.visitModel.findOne({ where: { Uuid: VisitID } })
        if (!visit) {
            return next(createNotFoundError(req.t('Visits.Error.NotFound'), req.t('Visits'), req.language))
        }
        if (!visit.Isactive) {
            return next(createNotFoundError(req.t('Visits.Error.NotActive'), req.t('Visits'), req.language))
        }
        if (visit.Status !== VISIT_STATU_PLANNED) {
            return next(createNotFoundError(req.t('Visits.Error.NotPlanned'), req.t('Visits'), req.language))
        }

        await db.visitModel.update({
            Visitcode,
            UserID,
            DoctorID,
            LocationID,
            PaymenttypeID,
            Visitdate,
            Scheduledpayment,
            Notes,
            Updateduser: username,
            Updatetime: new Date(),
        }, { transaction: t, where: { Uuid: VisitID } })
        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyUpdated'), entity: VisitID })
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
}

async function WorkVisit(req, res, next) {
    let validationErrors = []
    const {
        VisitID,
    } = req.body

    if (!validator.isUUID(VisitID)) {
        validationErrors.push(req.t('Visits.Error.VisitIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Visits'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'


    const visit = await db.visitModel.findOne({ where: { Uuid: VisitID } })
    if (!visit) {
        return next(createNotFoundError(req.t('Visits.Error.NotFound'), req.t('Visits'), req.language))
    }
    if (!visit.Isactive) {
        return next(createNotFoundError(req.t('Visits.Error.NotActive'), req.t('Visits'), req.language))
    }
    if (visit.Status !== VISIT_STATU_PLANNED) {
        return next(createNotFoundError(req.t('Visits.Error.NotPlanned'), req.t('Visits'), req.language))
    }

    const visitStocks = await db.visitproductModel.findAll({ where: { Isactive: true, VisitID } })

    let stockCheckRequestBody = (visitStocks || []).map(item => {
        return {
            StockID: item.StockID,
            Amount: item.Amount,
            Sourcetype: STOCK_SOURCETYPE_VISIT,
            SourceID: VisitID
        }
    })

    try {
        await DoPut(config.services.Warehouse, 'Stocks/UseStockList', {
            StockList: stockCheckRequestBody
        })
    } catch (error) {
        return next(requestErrorCatcher(error, 'Warehouse'))
    }

    try {
        await db.visitModel.update({
            Visitstartdate: new Date(),
            Status: VISIT_STATU_WORKING,
            Updateduser: username,
            Updatetime: new Date(),
        }, { transaction: t, where: { Uuid: VisitID } })

        await db.visitproductModel.update({
            Istaken: true,
            Updateduser: username,
            Updatetime: new Date(),
        }, { transaction: t, where: { Isactive: true, VisitID } })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyUpdated'), entity: VisitID })

    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
}

async function UpdateVisitPaymentDefines(req, res, next) {
    let validationErrors = []
    const {
        VisitID,
        PaymenttypeID,
        Scheduledpayment
    } = req.body

    if (!validator.isUUID(VisitID)) {
        validationErrors.push(req.t('Visits.Error.VisitIDRequired'))
    }
    if (!validator.isUUID(PaymenttypeID)) {
        validationErrors.push(req.t('Visits.Error.PaymenttypeIDRequired'))
    }
    if (!validator.isNumber(Scheduledpayment) || Scheduledpayment <= 0) {
        validationErrors.push(req.t('Visits.Error.ScheduledpaymentRequired'))
    }


    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Visits'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const visit = await db.visitModel.findOne({ where: { Uuid: VisitID } })
        if (!visit) {
            return next(createNotFoundError(req.t('Visits.Error.NotFound'), req.t('Visits'), req.language))
        }
        if (!visit.Isactive) {
            return next(createNotFoundError(req.t('Visits.Error.NotActive'), req.t('Visits'), req.language))
        }
        if (visit.Status !== VISIT_STATU_WORKING) {
            return next(createNotFoundError(req.t('Visits.Error.NotWorking'), req.t('Visits'), req.language))
        }

        await db.visitModel.update({
            PaymenttypeID,
            Scheduledpayment,
            Updateduser: username,
            Updatetime: new Date(),
        }, { transaction: t, where: { Uuid: VisitID } })
        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyUpdated'), entity: VisitID })
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
}

async function CompleteVisit(req, res, next) {
    let validationErrors = []

    const {
        VisitID,
        Totalamount,
        Installmentcount,
        Installmentinterval,
        Duedays,
        Startdate,
        Prepaymentamount,
        Returnedproducts,
    } = req.body

    if (!validator.isNumber(Totalamount) || Totalamount <= 0) {
        validationErrors.push(req.t('Visits.Error.TotalamountRequired'))
    }

    if (Prepaymentamount && (!validator.isNumber(Prepaymentamount) || Prepaymentamount < 0)) {
        validationErrors.push(req.t('Visits.Error.PrepaymentInvalid'))
    }

    const isFullPayment = Number(Prepaymentamount || 0) >= Number(Totalamount)

    if (!isFullPayment) {
        if (!validator.isNumber(Installmentcount) || Installmentcount <= 0) {
            validationErrors.push(req.t('Visits.Error.InstallmentcountRequired'))
        }
        if (!validator.isNumber(Installmentinterval) || Installmentinterval <= 0) {
            validationErrors.push(req.t('Visits.Error.InstallmentintervalRequired'))
        }
        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Visits.Error.StartdateRequired'))
        }
    }

    if (!validator.isUUID(VisitID)) {
        validationErrors.push(req.t('Visits.Error.VisitIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Visits'), req.language))
    }

    let t = null
    const username = req?.identity?.user?.Username || 'System'

    try {

        const visit = await db.visitModel.findOne({ where: { Uuid: VisitID } })
        if (!visit) {
            return next(createNotFoundError(req.t('Visits.Error.NotFound'), req.t('Visits'), req.language))
        }
        if (!visit.Isactive) {
            return next(createNotFoundError(req.t('Visits.Error.NotActive'), req.t('Visits'), req.language))
        }
        if (visit.Status !== VISIT_STATU_WORKING) {
            return next(createNotFoundError(req.t('Visits.Error.NotWorked'), req.t('Visits'), req.language))
        }

        if (Returnedproducts && Returnedproducts.length > 0) {
            const visitProducts = await db.visitproductModel.findAll({
                where: { Isactive: true, Uuid: { [Op.in]: Returnedproducts.map(u => u.Uuid) } }
            })

            let returnStockRequestBody = []

            for (const returnedproduct of Returnedproducts) {
                const foundedStock = visitProducts.find(u => u.Uuid === returnedproduct.Uuid)

                returnStockRequestBody.push({
                    StockID: foundedStock.StockID,
                    Amount: returnedproduct.Amount,
                    Sourcetype: STOCK_SOURCETYPE_VISIT,
                    SourceID: VisitID
                })

            }

            try {
                await DoPut(config.services.Warehouse, `Stocks/InsertStockList`, {
                    StockList: returnStockRequestBody
                })
            } catch (error) {
                return next(requestErrorCatcher(error, 'Warehouse'))
            }
        }

        t = await db.sequelize.transaction()

        if (Returnedproducts && Returnedproducts.length > 0) {
            for (const returnedproduct of Returnedproducts) {
                await db.visitproductModel.update({
                    Returnedamount: returnedproduct.Amount,
                    IsReturned: true,
                    Returndescription: returnedproduct.Description,
                    Updateduser: username,
                    Updatetime: new Date(),
                }, { transaction: t, where: { Isactive: true, Uuid: returnedproduct.Uuid } })
            }
        }

        const planUuid = uuid()

        const getPaymentPlanStatus = () => {
            if (isFullPayment) {
                return VISIT_PAYMENT_STATUS_FULL
            } else if (Prepaymentamount > 0) {
                return VISIT_PAYMENT_STATUS_SEMI
            } else {
                return VISIT_PAYMENT_STATUS_NON
            }
        }

        let calculatedEndDate = null
        if (isFullPayment) {
            calculatedEndDate = Startdate
        } else {
            if (Startdate && Installmentcount && Installmentinterval) {
                const temp = new Date(Startdate)
                temp.setDate(temp.getDate() + (Installmentcount * Installmentinterval))
                calculatedEndDate = temp
            }
        }

        await db.paymentplanModel.create({
            Uuid: planUuid,
            VisitID: VisitID,
            Totalamount,
            Prepaymentamount,
            Remainingvalue: Totalamount - Prepaymentamount,
            Duedays,
            Startdate,
            Installmentcount,
            Installmentinterval,
            Enddate: calculatedEndDate,
            Status: getPaymentPlanStatus(),
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        if (Prepaymentamount && Prepaymentamount > 0) {
            await db.paymenttransactionModel.create({
                Uuid: uuid(),
                PaymentplanID: planUuid,
                Amount: Prepaymentamount,
                Paymentdate: new Date(),
                Status: true,
                Description: isFullPayment ? req.t('Visits.Messages.FullpaymentTransaction') : req.t('Visits.Messages.PrepaymentTransaction'),
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        if (!isFullPayment) {
            const remaining = Totalamount - (Prepaymentamount || 0)
            const eachAmount = remaining / Installmentcount
            const baseDate = new Date(Startdate)

            for (let i = 0; i < Installmentcount; i++) {
                const dueDate = new Date(baseDate)
                dueDate.setDate(dueDate.getDate() + (i * Installmentinterval))

                await db.paymenttransactionModel.create({
                    Uuid: uuid(),
                    PaymentplanID: planUuid,
                    Amount: eachAmount,
                    Paymentdate: dueDate,
                    Status: false,
                    Description: `${i + 1}. ${req.t('Visits.Messages.Installment')}`,
                    Createduser: username,
                    Createtime: new Date(),
                    Isactive: true
                }, { transaction: t })
            }
        }

        await db.visitModel.update({
            Status: VISIT_STATU_ON_APPROVE,
            Updateduser: username,
            Updatetime: new Date(),
        }, { transaction: t, where: { Uuid: VisitID } })

        await t.commit()
        return res.status(200).json({ message: req.t('General.SuccessfullyUpdated'), entity: VisitID })

    } catch (error) {
        if (t) await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
}

async function DeleteVisit(req, res, next) {
    const Uuid = req.params.ID

    if (!validator.isUUID(Uuid)) {
        return next(createValidationError([req.t('Visits.Error.IDRequired')], req.t('Visits'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'

    const visit = await db.visitModel.findOne({ where: { Uuid: Uuid } })
    if (!visit) {
        return next(createNotFoundError(req.t('Visits.Error.NotFound'), req.t('Visits'), req.language))
    }
    if (!visit.Isactive) {
        return next(createNotFoundError(req.t('Visits.Error.NotActive'), req.t('Visits'), req.language))
    }
    if (visit.Status !== VISIT_STATU_PLANNED) {
        return next(createNotFoundError(req.t('Visits.Error.NotPlanned'), req.t('Visits'), req.language))
    }

    try {
        await db.visitModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { transaction: t, where: { Uuid: Uuid } })

        await db.visitproductModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { transaction: t, where: { Isactive: true, VisitID: Uuid } })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyDeleted'), entity: Uuid })

    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
}

module.exports = {
    GetVisitCounts,
    GetVisits,
    GetVisit,
    CreateVisit,
    UpdateVisitStocks,
    UpdateVisitDefines,
    WorkVisit,
    DeleteVisit,
    UpdateVisitPaymentDefines,
    CompleteVisit
}