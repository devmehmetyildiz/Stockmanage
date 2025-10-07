const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const { publishEvent } = require("../Services/MessageService")

async function GetWarehousesCount(req, res, next) {
    try {
        const warehouses = await db.warehouseModel.count({ where: req.query })
        res.status(200).json(warehouses)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetWarehouses(req, res, next) {
    try {
        const warehouses = await db.warehouseModel.findAll({ where: req.query })
        res.status(200).json(warehouses)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetWarehouse(req, res, next) {

    const Uuid = req.params.ID

    if (!validator.isUUID(Uuid)) {
        return next(createValidationError([req.t('Warehouses.Error.IDRequired')], req.t('Warehouses'), req.language))
    }

    try {
        const warehouseData = await db.warehouseModel.findOne({ where: { Uuid: Uuid } })
        if (!warehouseData) {
            return next(createNotFoundError(req.t('Warehouses.Error.NotFound'), req.t('Warehouses'), req.language))
        }
        if (!warehouseData.Isactive) {
            return next(createNotFoundError(req.t('Warehouses.Error.NotActive'), req.t('Warehouses'), req.language))
        }

        res.status(200).json(warehouseData)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function AddWarehouse(req, res, next) {

    let validationErrors = []
    const { Name, Description } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Warehouses.Error.NameRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Warehouses'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'
    const itemUuid = uuid()

    try {
        await db.warehouseModel.create({
            Uuid: itemUuid,
            Name,
            Description,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true,
        }, { transaction: t })

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'created',
            service: req.t('Warehouses'),
            role: 'warehousenotification',
            message: {
                en: `${Name} warehouse created by ${username}`,
                tr: `${Name} deposu ${username} tarafından oluşturuldu`
            }[req.language],
            pushurl: '/Warehouses'
        })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyCreated'), entity: itemUuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function UpdateWarehouse(req, res, next) {

    let validationErrors = []
    const { Uuid, Name, Description } = req.body

    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Warehouses.Error.IDRequired'))
    }
    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Warehouses.Error.NameRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Warehouses'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'

    try {
        const warehouseData = await db.warehouseModel.findOne({ where: { Uuid } })
        if (!warehouseData) {
            return next(createNotFoundError(req.t('Warehouses.Error.NotFound'), req.t('Warehouses'), req.language))
        }
        if (!warehouseData.Isactive) {
            return next(createNotFoundError(req.t('Warehouses.Error.NotActive'), req.t('Warehouses'), req.language))
        }

        await db.warehouseModel.update({
            Name,
            Description,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid }, transaction: t })

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'updated',
            service: req.t('Warehouses'),
            role: 'warehousenotification',
            message: {
                en: `${Name} warehouse updated by ${username}`,
                tr: `${Name} deposu ${username} tarafından güncellendi`
            }[req.language],
            pushurl: '/Warehouses'
        })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyUpdated'), entity: Uuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function DeleteWarehouse(req, res, next) {

    const Uuid = req.params.ID

    if (!validator.isUUID(Uuid)) {
        return next(createValidationError([req.t('Warehouses.Error.IDRequired')], req.t('Warehouses'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'

    try {
        const warehouseData = await db.warehouseModel.findOne({ where: { Uuid } })
        if (!warehouseData) {
            return next(createNotFoundError(req.t('Warehouses.Error.NotFound'), req.t('Warehouses'), req.language))
        }
        if (!warehouseData.Isactive) {
            return next(createNotFoundError(req.t('Warehouses.Error.NotActive'), req.t('Warehouses'), req.language))
        }

        const doctordefines = await db.doctordefineModel.findAll({ where: { Isactive: true, WarehouseID: Uuid } })

        if (doctordefines.length > 0) {
            return next(createNotFoundError(req.t('Warehouses.Error.ThereAreDoctors'), req.t('Warehouses'), req.language))
        }

        await db.warehouseModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid }, transaction: t })

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'deleted',
            service: req.t('Warehouses'),
            role: 'warehousenotification',
            message: {
                en: `${warehouseData.Name} warehouse deleted by ${username}`,
                tr: `${warehouseData.Name} deposu ${username} tarafından silindi`
            }[req.language],
            pushurl: '/Warehouses'
        })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyDeleted'), entity: Uuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

module.exports = {
    GetWarehouse,
    GetWarehouses,
    GetWarehousesCount,
    AddWarehouse,
    UpdateWarehouse,
    DeleteWarehouse
}
