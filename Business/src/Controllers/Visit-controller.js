const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const { publishEvent } = require("../Services/MessageService")
const DoPut = require("../Utilities/DoPut")
const DoGet = require("../Utilities/DoGet")
const config = require("../Config")

const VISIT_STATU_PLANNED = 0
const VISIT_STATU_WORKING = 1
const VISIT_STATU_ON_APPROVE = 2
const VISIT_STATU_COMPLETED = 3
const VISIT_STATU_DECLINED = 4

const STOCK_SOURCETYPE_USER = 0
const STOCK_SOURCETYPE_PURCHASEORDER = 1
const STOCK_SOURCETYPE_VISIT = 2

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
        PaymenttypeID,
        LocationID,
        Visitdate,
        Notes,
        Stocks,
        WarehouseID,
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
        if (new Date(Visitdate).getTime() < current) {
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
        if (new Date(Visitdate).getTime() < new Date().getTime()) {
            validationErrors.push(req.t('Visits.Error.VisitdateCantSmall'))
        }
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Visits'), req.language))
    }

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
            Visitdate,
            Notes,
            Updateduser: username,
            Updatetime: new Date(),
        }, { transaction: t, where: { Uuid: VisitID } })
        res.status(200).json({ message: req.t('General.SuccessfullyUpdated'), entity: VisitID })
    } catch (error) {
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

        const visitStocks = await db.visitproductModel.findAll({ where: { Isactive: true, VisitID } })

        let stockCheckRequestBody = (visitStocks || []).map(item => {
            return {
                StockID: item.StockID,
                Amount: item.Amount,
                Sourcetype: STOCK_SOURCETYPE_VISIT,
                SourceID: VisitID
            }
        })

        await DoPut(config.services.Warehouse, 'Stocks/UseStockList', stockCheckRequestBody)

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

        res.status(200).json({ message: req.t('General.SuccessfullyUpdated'), entity: VisitID })

    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function CompleteVisit(req, res, next) {
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

        const visitStocks = await db.visitproductModel.findAll({ where: { Isactive: true, VisitID } })

        let stockCheckRequestBody = (visitStocks || []).map(item => {
            return {
                StockID: item.StockID,
                Amount: item.Amount,
                Sourcetype: STOCK_SOURCETYPE_VISIT,
                SourceID: VisitID
            }
        })

        await DoPut(config.services.Warehouse, 'Stocks/UseStockList', stockCheckRequestBody)

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

        res.status(200).json({ message: req.t('General.SuccessfullyUpdated'), entity: VisitID })

    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

module.exports = {
    GetVisitCounts,
    GetVisits,
    GetVisit,
    CreateVisit,
    UpdateVisitStocks,
    UpdateVisitDefines
}