const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const { publishEvent } = require("../Services/MessageService")

async function GetCasesCount(req, res, next) {
    try {
        const cases = await db.caseModel.count({ where: req.query })
        res.status(200).json(cases)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetCases(req, res, next) {
    try {
        const cases = await db.caseModel.findAll({ where: req.query })
        res.status(200).json(cases)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetCase(req, res, next) {

    const Uuid = req.params.ID

    if (!validator.isUUID(Uuid)) {
        return next(createValidationError([req.t('Cases.Error.IDRequired')], req.t('Cases'), req.language))
    }

    try {
        const caseData = await db.caseModel.findOne({ where: { Uuid: Uuid } })
        if (!caseData) {
            return next(createNotFoundError(req.t('Cases.Error.NotFound'), req.t('Cases'), req.language))
        }
        if (!caseData.Isactive) {
            return next(createNotFoundError(req.t('Cases.Error.NotActive'), req.t('Cases'), req.language))
        }

        res.status(200).json(caseData)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function AddCase(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Color,
        Type,
        Isdefault,
        Description,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Cases.Error.NameRequired'))
    }
    if (!validator.isString(Color)) {
        validationErrors.push(req.t('Cases.Error.ColorRequired'))
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Cases.Error.TypeRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Cases'), req.language))
    }


    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    const itemUuid = uuid()

    try {
        if (Isdefault) {
            await db.caseModel.update({
                Isdefault: false,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Type, Isactive: true }, transaction: t })
        }

        await db.caseModel.create({
            Uuid: itemUuid,
            Name,
            Color,
            Type,
            Isdefault: Isdefault ?? false,
            Description,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true,
        }, { transaction: t })


        //TODO mesaja durumlarıda ekle
        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'created',
            service: req.t('Cases'),
            role: 'casenotification',
            message: {
                en: `${Name} case created by ${username}`,
                tr: `${Name} durumu ${username} tarafından oluşturuldu`
            }[req.language],
            pushurl: '/Cases'
        });

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyCreated'), entity: itemUuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function UpdateCase(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        Name,
        Color,
        Type,
        Isdefault,
        Description,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Cases.Error.NameRequired'))
    }
    if (!validator.isString(Color)) {
        validationErrors.push(req.t('Cases.Error.ColorRequired'))
    }
    if (!validator.isNumber(Type)) {
        validationErrors.push(req.t('Cases.Error.TypeRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Cases.Error.IDRequired'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Cases'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const caseData = await db.caseModel.findOne({ where: { Uuid: Uuid } })
        if (!caseData) {
            return next(createNotFoundError(req.t('Cases.Error.NotFound'), req.t('Cases'), req.language))
        }
        if (!caseData.Isactive) {
            return next(createNotFoundError(req.t('Cases.Error.NotActive'), req.t('Cases'), req.language))
        }

        if (Isdefault) {
            await db.caseModel.update({
                Isdefault: false,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Type, Isactive: true }, transaction: t })
        }

        await db.caseModel.update({
            Name,
            Color,
            Type,
            Isdefault: Isdefault ?? false,
            Description,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        //TODO mesaja durumlarıda ekle
        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'updated',
            service: req.t('Cases'),
            role: 'casenotification',
            message: {
                en: `${Name} case updated by ${username}`,
                tr: `${Name} durumu ${username} tarafından güncellendi.`
            }[req.language],
            pushurl: '/Cases'
        });

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyUpdated'), entity: Uuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function DeleteCase(req, res, next) {

    const Uuid = req.params.ID

    if (!validator.isUUID(Uuid)) {
        return next(createValidationError([req.t('Cases.Error.IDRequired')], req.t('Cases'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const caseData = await db.caseModel.findOne({ where: { Uuid: Uuid } })
        if (!caseData) {
            return next(createNotFoundError(req.t('Cases.Error.NotFound'), req.t('Cases'), req.language))
        }
        if (!caseData.Isactive) {
            return next(createNotFoundError(req.t('Cases.Error.NotActive'), req.t('Cases'), req.language))
        }

        await db.caseModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        //TODO mesaja durumlarıda ekle
        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'deleted',
            service: req.t('Cases'),
            role: 'casenotification',
            message: {
                en: `${caseData.Name} case deleted by ${username}`,
                tr: `${caseData.Name} durumu ${username} tarafından silindi`
            }[req.language],
            pushurl: '/Cases'
        });
        await t.commit();
        res.status(200).json({ message: req.t('General.SuccessfullyDeleted'), entity: Uuid })
    } catch (error) {
        await t.rollback();
        next(sequelizeErrorCatcher(error))
    }
}


module.exports = {
    GetCase,
    GetCases,
    GetCasesCount,
    AddCase,
    UpdateCase,
    DeleteCase
}