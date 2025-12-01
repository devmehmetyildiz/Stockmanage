const { sequelizeErrorCatcher, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const { publishEvent, initApproveMessageService } = require("../Services/MessageService")
const DoPut = require("../Utilities/DoPut")
const DoGet = require("../Utilities/DoGet")
const config = require("../Config")
const { Op, DATE } = require('sequelize')
const {
    VISIT_STATU_PLANNED,
    VISIT_STATU_WORKING,
    VISIT_STATU_COMPLETED,
    VISIT_STATU_ON_APPROVE,
    STOCK_SOURCETYPE_VISIT,
    VISIT_PAYMENT_STATUS_NON,
    VISIT_PAYMENT_STATUS_SEMI,
    VISIT_PAYMENT_STATUS_FULL,
    PAYMENT_TRANSACTION_TYPE_PREPAYMENT,
    PAYMENT_TRANSACTION_TYPE_FULLPAYMENT,
    PAYMENT_TRANSACTION_TYPE_TRANSACTION,
    PAYMENT_TRANSACTION_TYPE_CLOSE_TRANSACTION,
    VISIT_STATU_CLOSED,
} = require("../Constants")

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
        WorkerUserID,
        ResponsibleUserID,
        DoctorID,
        LocationID,
        Visitdate,
        Notes,
        Stocks,
        WarehouseID,
        PaymenttypeID,
        Scheduledpayment,
        Description
    } = req.body

    if (!validator.isUUID(WorkerUserID)) {
        validationErrors.push(req.t('Visits.Error.WorkerUserIDRequired'))
    }
    if (!validator.isUUID(ResponsibleUserID)) {
        validationErrors.push(req.t('Visits.Error.ResponsibleUserIDRequired'))
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
            WorkerUserID,
            ResponsibleUserID,
            DoctorID,
            PaymenttypeID,
            WarehouseID,
            LocationID,
            Visitdate,
            Scheduledpayment,
            Status: 0,
            Notes,
            Description,
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
        ResponsibleUserID,
        WorkerUserID,
        DoctorID,
        LocationID,
        Visitdate,
        Notes,
        PaymenttypeID,
        Scheduledpayment,
        Description
    } = req.body

    if (!validator.isUUID(VisitID)) {
        validationErrors.push(req.t('Visits.Error.VisitIDRequired'))
    }
    if (!validator.isUUID(ResponsibleUserID)) {
        validationErrors.push(req.t('Visits.Error.ResponsibleUserIDRequired'))
    }
    if (!validator.isUUID(WorkerUserID)) {
        validationErrors.push(req.t('Visits.Error.WorkerUserIDRequired'))
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
            ResponsibleUserID,
            WorkerUserID,
            DoctorID,
            LocationID,
            PaymenttypeID,
            Visitdate,
            Scheduledpayment,
            Notes,
            Description,
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

async function SendApproveVisit(req, res, next) {
    let validationErrors = []
    const {
        VisitID,
        Comment
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

    try {
        await db.visitModel.update({
            Status: VISIT_STATU_ON_APPROVE,
            Updateduser: username,
            Updatetime: new Date(),
        }, { transaction: t, where: { Uuid: VisitID } })

        const doctor = await DoGet(config.services.Setting, `Doctordefines/${visit.DoctorID}`)
        const location = await DoGet(config.services.Setting, `Locations/${visit.LocationID}`)
        const workerUser = await DoGet(config.services.Userrole, `Users/${visit.WorkerUserID}`)

        const doctorName = doctor ? `${doctor.Name} ${doctor.Surname}` : req.t('General.NotFound')
        const locationName = location ? location.Name : req.t('General.NotFound')
        const userName = workerUser ? `${workerUser.Name} ${workerUser.Surname}` : req.t('General.NotFound')
        
        publishEvent("approveRequest", 'System', 'Approval', {
            Service: 'Business',
            Table: 'Visit',
            Detiallink: `/Visits/${visit.Uuid}/Detail`,
            Message: {
                tr: `${locationName} bölgesindeki ${doctorName} doktoru için ${userName} Personeli tarafından açılan satış`,
                en: `The sale opened by ${userName} staff for Dr. ${doctorName} in the ${locationName} region`
            }[req.language],
            Comment,
            Record: visit.Uuid,
            RequestTime: new Date(),
            RequestUserID: req?.identity?.user?.Uuid ?? username,
            ApproveRoles: 'visitapprove',
        })

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
    if (visit.Status !== VISIT_STATU_ON_APPROVE) {
        return next(createNotFoundError(req.t('Visits.Error.NotApproveStatu'), req.t('Visits'), req.language))
    }
    if (!(visit.Isapproved === true || visit.Isapproved === 1)) {
        return next(createNotFoundError(req.t('Visits.Error.NotApproved'), req.t('Visits'), req.language))
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
        Prepaymenttype,
        Returnedproducts,
    } = req.body

    if (!validator.isNumber(Totalamount) || Totalamount <= 0) {
        validationErrors.push(req.t('Visits.Error.TotalamountRequired'))
    }

    if (Prepaymentamount && (!validator.isNumber(Prepaymentamount) || Prepaymentamount < 0)) {
        validationErrors.push(req.t('Visits.Error.PrepaymentInvalid'))
    } else if (Prepaymentamount > 0) {
        if (!validator.isNumber(Prepaymenttype)) {
            validationErrors.push(req.t('Visits.Error.PrepaymenttypeInvalid'))
        }
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
            PaymenttypeID: visit.PaymenttypeID,
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
                Paydate: new Date(),
                Status: true,
                Type: isFullPayment ? PAYMENT_TRANSACTION_TYPE_FULLPAYMENT : PAYMENT_TRANSACTION_TYPE_PREPAYMENT,
                Paymentmethod: Prepaymenttype,
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
                    Referenceno: visit.Visitcode,
                    PaymentplanID: planUuid,
                    Amount: eachAmount,
                    Paymentdate: dueDate,
                    Type: i === (Installmentcount - 1) ? PAYMENT_TRANSACTION_TYPE_CLOSE_TRANSACTION : PAYMENT_TRANSACTION_TYPE_TRANSACTION,
                    Status: false,
                    Description: `${i + 1}. ${req.t('Visits.Messages.Installment')}`,
                    Createduser: username,
                    Createtime: new Date(),
                    Isactive: true
                }, { transaction: t })
            }
        }

        await db.visitModel.update({
            Status: isFullPayment ? VISIT_STATU_CLOSED : VISIT_STATU_COMPLETED,
            Finalpayment: Totalamount,
            Visitenddate: new Date(),
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

async function ConsumeVisitRequests() {
    const { channel, q } = await initApproveMessageService('approveResponse', 'Business', 'Visit');

    console.log('RabbitMQ consumer started, waiting for messages...');

    channel.consume(q.queue, async (msg) => {
        if (msg) {
            try {
                const payload = JSON.parse(msg.content.toString());

                if (payload.Isapproved) {
                    await db.visitModel.update({
                        Isapproved: true,
                        ApprovedUserID: payload.ApproveUserID,
                        ApproveDescription: payload.Comment,
                        Updateduser: payload.ApproveUsername,
                        Updatetime: new Date(),
                    }, { where: { Uuid: payload.Record } })
                    console.log('Visit record updated:', payload.Record);
                    channel.ack(msg);
                }
                if (payload.Isrejected) {
                    await db.visitModel.update({
                        Isrejected: true,
                        Status: VISIT_STATU_PLANNED,
                        RejectedUserID: payload.ApproveUserID,
                        RejectDescription: payload.Comment,
                        Updateduser: payload.ApproveUsername,
                        Updatetime: new Date(),
                    }, { where: { Uuid: payload.Record } })

                    console.log('Visit record updated:', payload.Record);
                    channel.ack(msg);
                }

                console.log('Visit record passed:', payload.Record);
            } catch (error) {
                console.error('Error processing message:', error);
            }
        }
    });
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
    CompleteVisit,
    SendApproveVisit,
    ConsumeVisitRequests
}