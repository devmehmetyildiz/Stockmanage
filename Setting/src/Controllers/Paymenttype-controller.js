const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const { publishEvent } = require("../Services/MessageService")

async function GetPaymenttypesCount(req, res, next) {
    try {
        const paymenttypes = await db.paymenttypeModel.count({ where: req.query })
        res.status(200).json(paymenttypes)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPaymenttypes(req, res, next) {
    try {
        const paymenttypes = await db.paymenttypeModel.findAll({ where: req.query })
        res.status(200).json(paymenttypes)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetPaymenttype(req, res, next) {

    const Uuid = req.params.ID

    if (!validator.isUUID(Uuid)) {
        return next(createValidationError([req.t('Paymenttypes.Error.IDRequired')], req.t('Paymenttypes'), req.language))
    }

    try {
        const paymenttypeData = await db.paymenttypeModel.findOne({ where: { Uuid: Uuid } })
        if (!paymenttypeData) {
            return next(createNotFoundError(req.t('Paymenttypes.Error.NotFound'), req.t('Paymenttypes'), req.language))
        }
        if (!paymenttypeData.Isactive) {
            return next(createNotFoundError(req.t('Paymenttypes.Error.NotActive'), req.t('Paymenttypes'), req.language))
        }

        res.status(200).json(paymenttypeData)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function AddPaymenttype(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Description,
        Type,
        Installmentcount,
        Installmentinterval,
        Duedays,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Paymenttypes.Error.NameRequired'))
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Paymenttypes.Error.TypeRequired'))
    }
    if (!validator.isNumber(Installmentcount)) {
        validationErrors.push(req.t('Paymenttypes.Error.InstallmentcountRequired'))
    }
    if (!validator.isNumber(Installmentinterval)) {
        validationErrors.push(req.t('Paymenttypes.Error.InstallmentintervalRequired'))
    }
    if (!validator.isNumber(Duedays)) {
        validationErrors.push(req.t('Paymenttypes.Error.DuedaysRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Paymenttypes'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    const itemUuid = uuid()

    try {
        await db.paymenttypeModel.create({
            Uuid: itemUuid,
            Name,
            Description,
            Type,
            Installmentcount,
            Installmentinterval,
            Duedays,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true,
        }, { transaction: t })

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'created',
            service: req.t('Paymenttypes'),
            role: 'paymenttypenotification',
            message: {
                en: `${Name} payment type created by ${username}`,
                tr: `${Name} ödeme türü ${username} tarafından oluşturuldu`
            }[req.language],
            pushurl: '/Paymenttypes'
        });

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyCreated'), entity: itemUuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function UpdatePaymenttype(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        Name,
        Description,
        Type,
        Installmentcount,
        Installmentinterval,
        Duedays,
    } = req.body

    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Paymenttypes.Error.IDRequired'))
    }
    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Paymenttypes.Error.NameRequired'))
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Paymenttypes.Error.TypeRequired'))
    }
    if (!validator.isNumber(Installmentcount)) {
        validationErrors.push(req.t('Paymenttypes.Error.InstallmentcountRequired'))
    }
    if (!validator.isNumber(Installmentinterval)) {
        validationErrors.push(req.t('Paymenttypes.Error.InstallmentintervalRequired'))
    }
    if (!validator.isNumber(Duedays)) {
        validationErrors.push(req.t('Paymenttypes.Error.DuedaysRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Paymenttypes'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const paymenttypeData = await db.paymenttypeModel.findOne({ where: { Uuid: Uuid } })
        if (!paymenttypeData) {
            return next(createNotFoundError(req.t('Paymenttypes.Error.NotFound'), req.t('Paymenttypes'), req.language))
        }
        if (!paymenttypeData.Isactive) {
            return next(createNotFoundError(req.t('Paymenttypes.Error.NotActive'), req.t('Paymenttypes'), req.language))
        }

        await db.paymenttypeModel.update({
            Name,
            Description,
            Type,
            Installmentcount,
            Installmentinterval,
            Duedays,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'updated',
            service: req.t('Paymenttypes'),
            role: 'paymenttypenotification',
            message: {
                en: `${Name} payment type updated by ${username}`,
                tr: `${Name} ödeme türü ${username} tarafından güncellendi.`
            }[req.language],
            pushurl: '/Paymenttypes'
        });

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyUpdated'), entity: Uuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function DeletePaymenttype(req, res, next) {

    const Uuid = req.params.ID

    if (!validator.isUUID(Uuid)) {
        return next(createValidationError([req.t('Paymenttypes.Error.IDRequired')], req.t('Paymenttypes'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const paymenttypeData = await db.paymenttypeModel.findOne({ where: { Uuid: Uuid } })
        if (!paymenttypeData) {
            return next(createNotFoundError(req.t('Paymenttypes.Error.NotFound'), req.t('Paymenttypes'), req.language))
        }
        if (!paymenttypeData.Isactive) {
            return next(createNotFoundError(req.t('Paymenttypes.Error.NotActive'), req.t('Paymenttypes'), req.language))
        }

        await db.paymenttypeModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'deleted',
            service: req.t('Paymenttypes'),
            role: 'paymenttypenotification',
            message: {
                en: `${paymenttypeData.Name} payment type deleted by ${username}`,
                tr: `${paymenttypeData.Name} ödeme türü ${username} tarafından silindi`
            }[req.language],
            pushurl: '/Paymenttypes'
        });

        await t.commit();
        res.status(200).json({ message: req.t('General.SuccessfullyDeleted'), entity: Uuid })
    } catch (error) {
        await t.rollback();
        next(sequelizeErrorCatcher(error))
    }
}

module.exports = {
    GetPaymenttype,
    GetPaymenttypes,
    GetPaymenttypesCount,
    AddPaymenttype,
    UpdatePaymenttype,
    DeletePaymenttype
}
