const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const { publishEvent } = require("../Services/MessageService")

async function GetStockdefinesCount(req, res, next) {
    try {
        const stockdefines = await db.stockdefineModel.count({ where: req.query })
        res.status(200).json(stockdefines)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetStockdefines(req, res, next) {
    try {
        const stockdefines = await db.stockdefineModel.findAll({ where: req.query })
        res.status(200).json(stockdefines)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetStockdefine(req, res, next) {

    const Uuid = req.params.ID

    if (!validator.isUUID(Uuid)) {
        return next(createValidationError([req.t('Stockdefines.Error.IDRequired')], req.t('Stockdefines'), req.language))
    }

    try {
        const stockdefineData = await db.stockdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!stockdefineData) {
            return next(createNotFoundError(req.t('Stockdefines.Error.NotFound'), req.t('Stockdefines'), req.language))
        }
        if (!stockdefineData.Isactive) {
            return next(createNotFoundError(req.t('Stockdefines.Error.NotActive'), req.t('Stockdefines'), req.language))
        }

        res.status(200).json(stockdefineData)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function AddStockdefine(req, res, next) {

    const {
        DefineList
    } = req.body

    if (!DefineList || !validator.isArray(DefineList) || (DefineList || []).length <= 0) {
        next(createValidationError([req.t('Stockdefines.Error.ListNotFound')], req.t('Stockdefines'), req.language))
    }


    const username = req?.identity?.user?.Username || 'System'

    for (const stockdefine of DefineList) {

        let validationErrors = []
        const {
            Productname,
            Brand,
            Barcodeno,
            Model,
            Category,
            Diameter,
            Length,
            Material,
            Surfacetreatment,
            Connectiontype,
            Suppliername,
            Suppliercontact,
        } = stockdefine

        if (!validator.isString(Productname)) {
            validationErrors.push(req.t('Stockdefines.Error.ProductnameRequired'))
        }
        if (!validator.isString(Barcodeno)) {
            validationErrors.push(req.t('Stockdefines.Error.BarcodenoRequired'))
        }
        if (!validator.isString(Brand)) {
            validationErrors.push(req.t('Stockdefines.Error.BrandRequired'))
        }
        if (!validator.isString(Model)) {
            validationErrors.push(req.t('Stockdefines.Error.ModelRequired'))
        }
        if (!validator.isString(Category)) {
            validationErrors.push(req.t('Stockdefines.Error.CategoryRequired'))
        }
        if (!validator.isString(Diameter)) {
            validationErrors.push(req.t('Stockdefines.Error.DiameterRequired'))
        }
        if (!validator.isString(Length)) {
            validationErrors.push(req.t('Stockdefines.Error.LengthRequired'))
        }
        if (!validator.isString(Material)) {
            validationErrors.push(req.t('Stockdefines.Error.MaterialRequired'))
        }
        if (!validator.isString(Surfacetreatment)) {
            validationErrors.push(req.t('Stockdefines.Error.SurfacetreatmentRequired'))
        }
        if (!validator.isString(Connectiontype)) {
            validationErrors.push(req.t('Stockdefines.Error.ConnectiontypeRequired'))
        }
        if (!validator.isString(Suppliername)) {
            validationErrors.push(req.t('Stockdefines.Error.SuppliernameRequired'))
        }
        if (!validator.isString(Suppliercontact)) {
            validationErrors.push(req.t('Stockdefines.Error.SuppliercontactRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Stockdefines'), req.language))
        }
    }

    const t = null
    try {
        let t = await db.sequelize.transaction()
        const createdItems = []
        for (const stockdefine of DefineList) {

            const {
                Productname,
                Brand,
                Barcodeno,
                Model,
                Category,
                Diameter,
                Length,
                Material,
                Surfacetreatment,
                Connectiontype,
                Suppliername,
                Suppliercontact,
                Description,
            } = stockdefine

            const itemUuid = uuid()
            createdItems.push(itemUuid)
            await db.stockdefineModel.create({
                Uuid: itemUuid,
                Productname,
                Brand,
                Model,
                Barcodeno,
                Category,
                Diameter,
                Length,
                Material,
                Surfacetreatment,
                Connectiontype,
                Suppliername,
                Suppliercontact,
                Description,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true,
            }, { transaction: t })
        }

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'created',
            service: req.t('Stockdefines'),
            role: 'stockdefinenotification',
            message: {
                en: `${DefineList.length} count stock item created by ${username}`,
                tr: `${DefineList.length} adet ürün tanımı ${username} tarafından oluşturuldu`
            }[req.language],
            pushurl: '/Stockdefines'
        })
        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyCreated'), entities: createdItems })
    } catch (error) {
        if (t) {
            await t.rollback()
        }
        next(sequelizeErrorCatcher(error))
    }
}

async function UpdateStockdefine(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        Productname,
        Brand,
        Barcodeno,
        Model,
        Category,
        Diameter,
        Length,
        Material,
        Surfacetreatment,
        Connectiontype,
        Suppliername,
        Suppliercontact,
        Description,
    } = req.body

    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Stockdefines.Error.IDRequired'))
    }
    if (!validator.isString(Productname)) {
        validationErrors.push(req.t('Stockdefines.Error.ProductnameRequired'))
    }
    if (!validator.isString(Barcodeno)) {
        validationErrors.push(req.t('Stockdefines.Error.BarcodenoRequired'))
    }
    if (!validator.isString(Brand)) {
        validationErrors.push(req.t('Stockdefines.Error.BrandRequired'))
    }
    if (!validator.isString(Model)) {
        validationErrors.push(req.t('Stockdefines.Error.ModelRequired'))
    }
    if (!validator.isString(Category)) {
        validationErrors.push(req.t('Stockdefines.Error.CategoryRequired'))
    }
    if (!validator.isString(Diameter)) {
        validationErrors.push(req.t('Stockdefines.Error.DiameterRequired'))
    }
    if (!validator.isString(Length)) {
        validationErrors.push(req.t('Stockdefines.Error.LengthRequired'))
    }
    if (!validator.isString(Material)) {
        validationErrors.push(req.t('Stockdefines.Error.MaterialRequired'))
    }
    if (!validator.isString(Surfacetreatment)) {
        validationErrors.push(req.t('Stockdefines.Error.SurfacetreatmentRequired'))
    }
    if (!validator.isString(Connectiontype)) {
        validationErrors.push(req.t('Stockdefines.Error.ConnectiontypeRequired'))
    }
    if (!validator.isString(Suppliername)) {
        validationErrors.push(req.t('Stockdefines.Error.SuppliernameRequired'))
    }
    if (!validator.isString(Suppliercontact)) {
        validationErrors.push(req.t('Stockdefines.Error.SuppliercontactRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Stockdefines'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stockdefineData = await db.stockdefineModel.findOne({ where: { Uuid } })
        if (!stockdefineData) {
            return next(createNotFoundError(req.t('Stockdefines.Error.NotFound'), req.t('Stockdefines'), req.language))
        }
        if (!stockdefineData.Isactive) {
            return next(createNotFoundError(req.t('Stockdefines.Error.NotActive'), req.t('Stockdefines'), req.language))
        }

        await db.stockdefineModel.update({
            Productname,
            Brand,
            Model,
            Category,
            Diameter,
            Barcodeno,
            Length,
            Material,
            Surfacetreatment,
            Connectiontype,
            Suppliername,
            Suppliercontact,
            Description,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid }, transaction: t })

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'updated',
            service: req.t('Stockdefines'),
            role: 'stockdefinenotification',
            message: {
                en: `${Productname} stock item updated by ${username}`,
                tr: `${Productname} ürün tanımı ${username} tarafından güncellendi`
            }[req.language],
            pushurl: '/Stockdefines'
        })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyUpdated'), entity: Uuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function DeleteStockdefine(req, res, next) {

    const Uuid = req.params.ID

    if (!validator.isUUID(Uuid)) {
        return next(createValidationError([req.t('Stockdefines.Error.IDRequired')], req.t('Stockdefines'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'

    try {
        const stockdefineData = await db.stockdefineModel.findOne({ where: { Uuid } })
        if (!stockdefineData) {
            return next(createNotFoundError(req.t('Stockdefines.Error.NotFound'), req.t('Stockdefines'), req.language))
        }
        if (!stockdefineData.Isactive) {
            return next(createNotFoundError(req.t('Stockdefines.Error.NotActive'), req.t('Stockdefines'), req.language))
        }

        await db.stockdefineModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid }, transaction: t })

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'deleted',
            service: req.t('Stockdefines'),
            role: 'stockdefinenotification',
            message: {
                en: `${stockdefineData.Productname} stock item deleted by ${username}`,
                tr: `${stockdefineData.Productname} ürün tanımı ${username} tarafından silindi`
            }[req.language],
            pushurl: '/Stockdefines'
        })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyDeleted'), entity: Uuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

module.exports = {
    GetStockdefine,
    GetStockdefines,
    GetStockdefinesCount,
    AddStockdefine,
    UpdateStockdefine,
    DeleteStockdefine
}
