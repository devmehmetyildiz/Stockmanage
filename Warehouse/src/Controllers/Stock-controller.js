const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const { publishEvent } = require("../Services/MessageService")
const DoGet = require("../Utilities/DoGet")
const config = require("../Config")

const STOCKMOVEMENT_CREATE = 0
const STOCKMOVEMENT_INSERT = 1
const STOCKMOVEMENT_REDUCE = 2

const STOCKMOVEMENT_TYPE_PLUS = 1
const STOCKMOVEMENT_TYPE_MINUS = -1

async function GetStocks(req, res, next) {
    try {
        const whereClauses = [];
        const replacements = {};

        for (const [key, value] of Object.entries(req.query)) {
            whereClauses.push(`s.${key} = :${key}`);
            replacements[key] = value;
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const query = `
            SELECT 
                s.Id,
                s.Uuid,
                s.WarehouseID,
                s.StockdefineID,
                 COALESCE(SUM(sm.Amount * sm.Type), 0) AS TotalAmount
            FROM stocks s
            LEFT JOIN stockmovements sm ON sm.StockID = s.Uuid AND sm.Isactive = true
            ${whereSQL}
            GROUP BY   s.Id, s.Uuid, s.WarehouseID, s.StockdefineID,  s.Isactive
            ORDER BY s.Id DESC
        `;

        const result = await db.sequelize.query(query, {
            replacements,
            type: db.Sequelize.QueryTypes.SELECT
        });

        res.status(200).json(result);
    } catch (error) {
        next(sequelizeErrorCatcher(error));
    }
}

async function GetStockmovements(req, res, next) {
    try {
        const movements = await db.stockmovementModel.findAll({
            where: req.query,
            attributes: [
                'Uuid',
                'StockID',
                'UserID',
                'Type',
                'Amount',
                'Movementtype',
                'Movementdate',
                'Sourcetype',
                'SourceID',
            ]
        })
        res.status(200).json(movements)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function CreateStock(req, res, next) {

    let validationErrors = []

    const {
        WarehouseID,
        StockdefineID,
        Sourcetype,
        SourceID,
        Amount
    } = req.body

    if (!validator.isUUID(WarehouseID)) {
        validationErrors.push(req.t('Stocks.Error.WarehouseIDRequired'))
    }
    if (!validator.isUUID(StockdefineID)) {
        validationErrors.push(req.t('Stocks.Error.StockdefineIDRequired'))
    }
    if (!validator.isNumber(Sourcetype)) {
        validationErrors.push(req.t('Stocks.Error.SourcetypeRequired'))
    }
    if (!validator.isUUID(SourceID)) {
        validationErrors.push(req.t('Stocks.Error.SourceIDRequired'))
    }
    if (!validator.isNumber(Amount) || Amount <= 0) {
        validationErrors.push(req.t('Stocks.Error.AmountRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocks'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'

    try {
        const foundedStock = await db.stockModel.findOne({
            where: {
                Isactive: true,
                WarehouseID,
                StockdefineID,
            }
        })

        if (foundedStock) {
            await db.stockmovementModel.create({
                Uuid: uuid(),
                StockID: foundedStock.Uuid,
                Type: STOCKMOVEMENT_TYPE_PLUS,
                Amount,
                Movementtype: STOCKMOVEMENT_INSERT,
                Sourcetype,
                SourceID,
                UserID: req?.identity?.user?.Uuid || username,
                Movementdate: new Date(),
                Createduser: username,
                Createtime: new Date(),
                Isactive: true,
            }, { transaction: t })
        } else {
            const itemUuid = uuid()

            await db.stockModel.create({
                Uuid: itemUuid,
                WarehouseID,
                StockdefineID,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true,
            }, { transaction: t })

            await db.stockmovementModel.create({
                Uuid: uuid(),
                StockID: itemUuid,
                Type: STOCKMOVEMENT_TYPE_PLUS,
                Amount,
                Movementdate: new Date(),
                Movementtype: STOCKMOVEMENT_CREATE,
                Sourcetype,
                SourceID,
                UserID: req?.identity?.user?.Uuid || username,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true,
            }, { transaction: t })

        }

        const stockdefine = await DoGet(config.services.Setting, 'Stockdefines/' + StockdefineID)

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'created',
            service: req.t('Stocks'),
            role: 'stocknotification',
            message: {
                en: `${stockdefine?.Name} ${Amount} amounted stock created by ${username}`,
                tr: `${Amount} adet ${stockdefine?.Name} ürünü  ${username} tarafından oluşturuldu`
            }[req.language],
            pushurl: '/Stocks'
        })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyCreated'), entity: StockdefineID })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function UseStock(req, res, next) {
    let validationErrors = []

    const {
        StockID,
        Amount,
        Sourcetype,
        SourceID
    } = req.body

    if (!validator.isNumber(Amount) || Amount <= 0) {
        validationErrors.push(req.t('Stocks.Error.AmountRequired'))
    }
    if (!validator.isUUID(StockID)) {
        validationErrors.push(req.t('Stocks.Error.StockIDRequired'))
    }
    if (!validator.isNumber(Sourcetype)) {
        validationErrors.push(req.t('Stocks.Error.SourcetypeRequired'))
    }
    if (!validator.isUUID(SourceID)) {
        validationErrors.push(req.t('Stocks.Error.SourceIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocks'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'

    const stock = await db.stockModel.findOne({ where: { Uuid: StockID } })
    if (!stock) {
        return next(createNotFoundError(req.t('Stocks.Error.NotFound'), req.t('Stocks'), req.language))
    }
    if (!stock.Isactive) {
        return next(createNotFoundError(req.t('Stocks.Error.NotActive'), req.t('Stocks'), req.language))
    }

    try {
        const query = `
            SELECT 
                COALESCE(SUM(Amount * Type), 0) AS TotalAmount
            FROM stockmovements
            WHERE StockID = :StockID
        `;

        const [result] = await db.sequelize.query(query, {
            replacements: { StockID },
            type: db.Sequelize.QueryTypes.SELECT
        });

        const foundedAmount = result.TotalAmount

        if (!foundedAmount) {
            return next(createNotFoundError(req.t('Stocks.Error.AmountNotCalculated'), req.t('Stocks'), req.language))
        }

        if (Amount > foundedAmount) {
            return next(createNotFoundError(req.t('Stocks.Error.AmountIsLower'), req.t('Stocks'), req.language))
        }

        await db.stockmovementModel.create({
            Uuid: uuid(),
            StockID,
            Type: STOCKMOVEMENT_TYPE_MINUS,
            Amount,
            Movementdate: new Date(),
            Movementtype: STOCKMOVEMENT_REDUCE,
            Sourcetype,
            SourceID,
            UserID: req?.identity?.user?.Uuid || username,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true,
        }, { transaction: t })


        const stockdefine = await DoGet(config.services.Setting, 'Stockdefines/' + StockdefineID)

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'created',
            service: req.t('Stocks'),
            role: 'stocknotification',
            message: {
                en: `${stockdefine?.Name} ${Amount} amounted stock used by ${username}`,
                tr: `${Amount} adet ${stockdefine?.Name} ürünü  ${username} tarafından kullanıldı`
            }[req.language],
            pushurl: '/Stocks'
        })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyUpdated'), entity: StockID })

    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function UseStockList(req, res, next) {
    let mainValidationErrors = []

    const {
        StockList
    } = req.body

    if (!validator.isArray(StockList) || (StockList || []).length <= 0) {
        mainValidationErrors.push(req.t('Stocks.Error.StockListRequired'))
    }

    if (mainValidationErrors.length > 0) {
        return next(createValidationError(mainValidationErrors, req.t('Stocks'), req.language))
    }

    try {
        let validationErrors = []

        for (const stock of StockList) {
            const {
                StockID,
                Amount,
                Sourcetype,
                SourceID
            } = stock

            if (!validator.isNumber(Amount) || Amount <= 0) {
                validationErrors.push(req.t('Stocks.Error.AmountRequired'))
            }
            if (!validator.isUUID(StockID)) {
                validationErrors.push(req.t('Stocks.Error.StockIDRequired'))
            }
            if (!validator.isNumber(Sourcetype)) {
                validationErrors.push(req.t('Stocks.Error.SourcetypeRequired'))
            }
            if (!validator.isUUID(SourceID)) {
                validationErrors.push(req.t('Stocks.Error.SourceIDRequired'))
            }
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Stocks'), req.language))
        }

        for (const stockItem of StockList) {

            const stock = await db.stockModel.findOne({ where: { Uuid: stockItem.StockID } })
            if (!stock) {
                return next(createNotFoundError(req.t('Stocks.Error.NotFound'), req.t('Stocks'), req.language))
            }
            if (!stock.Isactive) {
                return next(createNotFoundError(req.t('Stocks.Error.NotActive'), req.t('Stocks'), req.language))
            }

            const query = `
            SELECT 
                COALESCE(SUM(Amount * Type), 0) AS TotalAmount
            FROM stockmovements
            WHERE StockID = :StockID
             `;

            const [result] = await db.sequelize.query(query, {
                replacements: { StockID: stockItem.StockID },
                type: db.Sequelize.QueryTypes.SELECT
            });

            const foundedAmount = result.TotalAmount

            if (!foundedAmount) {
                return next(createNotFoundError(req.t('Stocks.Error.AmountNotCalculated'), req.t('Stocks'), req.language))
            }

            if (stockItem.Amount > foundedAmount) {
                return next(createNotFoundError(req.t('Stocks.Error.AmountIsLower'), req.t('Stocks'), req.language))
            }
        }
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'
    const createdEntities = []

    try {

        for (const stockItem of StockList) {

            const movementUuid = uuid()
            createdEntities.push(movementUuid)

            await db.stockmovementModel.create({
                Uuid: movementUuid,
                StockID: stockItem.StockID,
                Type: STOCKMOVEMENT_TYPE_MINUS,
                Amount: stockItem.Amount,
                Movementdate: new Date(),
                Movementtype: STOCKMOVEMENT_REDUCE,
                Sourcetype: stockItem.Sourcetype,
                SourceID: stockItem.SourceID,
                UserID: req?.identity?.user?.Uuid || username,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true,
            }, { transaction: t })
        }

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyUpdated'), entities: createdEntities })

    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function InsertStock(req, res, next) {
    let validationErrors = []

    const {
        StockID,
        Amount,
        Sourcetype,
        SourceID
    } = req.body

    if (!validator.isNumber(Amount) || Amount <= 0) {
        validationErrors.push(req.t('Stocks.Error.AmountRequired'))
    }
    if (!validator.isUUID(StockID)) {
        validationErrors.push(req.t('Stocks.Error.StockIDRequired'))
    }
    if (!validator.isNumber(Sourcetype)) {
        validationErrors.push(req.t('Stocks.Error.SourcetypeRequired'))
    }
    if (!validator.isUUID(SourceID)) {
        validationErrors.push(req.t('Stocks.Error.SourceIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stocks'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'

    const stock = await db.stockModel.findOne({ where: { Uuid: StockID } })
    if (!stock) {
        return next(createNotFoundError(req.t('Stocks.Error.NotFound'), req.t('Stocks'), req.language))
    }
    if (!stock.Isactive) {
        return next(createNotFoundError(req.t('Stocks.Error.NotActive'), req.t('Stocks'), req.language))
    }

    try {

        await db.stockmovementModel.create({
            Uuid: uuid(),
            StockID,
            Type: STOCKMOVEMENT_TYPE_PLUS,
            Amount,
            Movementdate: new Date(),
            Movementtype: STOCKMOVEMENT_INSERT,
            Sourcetype,
            SourceID,
            UserID: req?.identity?.user?.Uuid || username,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true,
        }, { transaction: t })


        const stockdefine = await DoGet(config.services.Setting, 'Stockdefines/' + StockdefineID)

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'created',
            service: req.t('Stocks'),
            role: 'stocknotification',
            message: {
                en: `${stockdefine?.Name} ${Amount} amounted stock inserted by ${username}`,
                tr: `${Amount} adet ${stockdefine?.Name} ürünü  ${username} tarafından eklendi`
            }[req.language],
            pushurl: '/Stocks'
        })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyUpdated'), entity: StockID })

    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function InsertStockList(req, res, next) {
    let mainValidationErrors = []

    const {
        StockList
    } = req.body

    if (!validator.isArray(StockList) || (StockList || []).length <= 0) {
        mainValidationErrors.push(req.t('Stocks.Error.StockListRequired'))
    }

    if (mainValidationErrors.length > 0) {
        return next(createValidationError(mainValidationErrors, req.t('Stocks'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'
    try {

        for (const returnstock of StockList) {
            let validationErrors = []

            const {
                StockID,
                Amount,
                Sourcetype,
                SourceID
            } = returnstock
            console.log('returnstock: ', returnstock);

            if (!validator.isNumber(Amount) || Amount <= 0) {
                validationErrors.push(req.t('Stocks.Error.AmountRequired'))
            }
            if (!validator.isUUID(StockID)) {
                validationErrors.push(req.t('Stocks.Error.StockIDRequired'))
            }
            if (!validator.isNumber(Sourcetype)) {
                validationErrors.push(req.t('Stocks.Error.SourcetypeRequired'))
            }
            if (!validator.isUUID(SourceID)) {
                validationErrors.push(req.t('Stocks.Error.SourceIDRequired'))
            }

            if (validationErrors.length > 0) {
                return next(createValidationError(validationErrors, req.t('Stocks'), req.language))
            }

            const stock = await db.stockModel.findOne({ where: { Uuid: StockID } })
            if (!stock) {
                return next(createNotFoundError(req.t('Stocks.Error.NotFound'), req.t('Stocks'), req.language))
            }
            if (!stock.Isactive) {
                return next(createNotFoundError(req.t('Stocks.Error.NotActive'), req.t('Stocks'), req.language))
            }

            await db.stockmovementModel.create({
                Uuid: uuid(),
                StockID,
                Type: STOCKMOVEMENT_TYPE_PLUS,
                Amount,
                Movementdate: new Date(),
                Movementtype: STOCKMOVEMENT_INSERT,
                Sourcetype,
                SourceID,
                UserID: req?.identity?.user?.Uuid || username,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true,
            }, { transaction: t })
        }

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyUpdated'), entities: StockList.map(u => u.StockID) })

    } catch (error) {
        console.log('error: ', error);
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function DeleteStock(req, res, next) {
    const Uuid = req.params.ID

    if (!validator.isUUID(Uuid)) {
        return next(createValidationError([req.t('Stocks.Error.IDRequired')], req.t('Stocks'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stock = await db.stockModel.findOne({ where: { Uuid } })
        if (!stock) {
            return next(createNotFoundError(req.t('Stocks.Error.NotFound'), req.t('Stocks'), req.language))
        }
        if (!stock.Isactive) {
            return next(createNotFoundError(req.t('Stocks.Error.NotActive'), req.t('Stocks'), req.language))
        }

        await db.stockModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid }, transaction: t })

        const stockdefine = await DoGet(config.services.Setting, 'Stockdefines/' + StockdefineID)

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'deleted',
            service: req.t('Stocks'),
            role: 'stocknotification',
            message: {
                en: `${stockdefine.Name} stock deleted by ${username}`,
                tr: `${stockdefine.Name} ürünü ${username} tarafından silindi`
            }[req.language],
            pushurl: '/Stocks'
        })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyDeleted'), entity: Uuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function DeleteStockmovement(req, res, next) {
    const Uuid = req.params.ID

    if (!validator.isUUID(Uuid)) {
        return next(createValidationError([req.t('Stocks.Error.MovementIDRequired')], req.t('Stocks'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stockmovement = await db.stockmovementModel.findOne({ where: { Uuid } })
        if (!stockmovement) {
            return next(createNotFoundError(req.t('Stocks.Error.MovementNotActive'), req.t('Stocks'), req.language))
        }
        if (!stockmovement.Isactive) {
            return next(createNotFoundError(req.t('Stocks.Error.MovementNotFound'), req.t('Stocks'), req.language))
        }

        await db.stockmovementModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid }, transaction: t })

        const stock = await db.stockModel.findOne({ where: { Uuid: stockmovement?.StockID ?? '' } })
        const stockdefine = await DoGet(config.services.Setting, 'Stockdefines/' + stock.StockdefineID)

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'deleted',
            service: req.t('Stocks'),
            role: 'stocknotification',
            message: {
                en: `${stockdefine.Name} stock movement deleted by ${username}`,
                tr: `${stockdefine.Name} ürün hareketi ${username} tarafından silindi`
            }[req.language],
            pushurl: '/Stocks'
        })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyDeleted'), entity: Uuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

module.exports = {
    GetStocks,
    CreateStock,
    UseStock,
    UseStockList,
    InsertStock,
    DeleteStock,
    GetStockmovements,
    DeleteStockmovement,
    InsertStockList
}
