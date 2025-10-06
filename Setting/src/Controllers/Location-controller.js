const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const { publishEvent } = require("../Services/MessageService")

async function GetLocationsCount(req, res, next) {
    try {
        const locations = await db.locationModel.count({ where: req.query })
        res.status(200).json(locations)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetLocations(req, res, next) {
    try {
        const locations = await db.locationModel.findAll({ where: req.query })
        res.status(200).json(locations)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetLocation(req, res, next) {

    const Uuid = req.params.ID

    if (!validator.isUUID(Uuid)) {
        return next(createValidationError([req.t('Locations.Error.IDRequired')], req.t('Locations'), req.language))
    }

    try {
        const locationData = await db.locationModel.findOne({ where: { Uuid: Uuid } })
        if (!locationData) {
            return next(createNotFoundError(req.t('Locations.Error.NotFound'), req.t('Locations'), req.language))
        }
        if (!locationData.Isactive) {
            return next(createNotFoundError(req.t('Locations.Error.NotActive'), req.t('Locations'), req.language))
        }

        res.status(200).json(locationData)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function AddLocation(req, res, next) {

    let validationErrors = []
    const { Name, Description } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Locations.Error.NameRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Locations'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'
    const itemUuid = uuid()

    try {
        await db.locationModel.create({
            Uuid: itemUuid,
            Name,
            Description,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true,
        }, { transaction: t })

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'created',
            service: req.t('Locations'),
            role: 'locationnotification',
            message: {
                en: `${Name} location created by ${username}`,
                tr: `${Name} bölgesi ${username} tarafından oluşturuldu`
            }[req.language],
            pushurl: '/Locations'
        })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyCreated'), entity: itemUuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function UpdateLocation(req, res, next) {

    let validationErrors = []
    const { Uuid, Name, Description } = req.body

    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Locations.Error.IDRequired'))
    }
    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Locations.Error.NameRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Locations'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'

    try {
        const locationData = await db.locationModel.findOne({ where: { Uuid } })
        if (!locationData) {
            return next(createNotFoundError(req.t('Locations.Error.NotFound'), req.t('Locations'), req.language))
        }
        if (!locationData.Isactive) {
            return next(createNotFoundError(req.t('Locations.Error.NotActive'), req.t('Locations'), req.language))
        }

        await db.locationModel.update({
            Name,
            Description,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid }, transaction: t })

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'updated',
            service: req.t('Locations'),
            role: 'locationnotification',
            message: {
                en: `${Name} location updated by ${username}`,
                tr: `${Name} bölgesi ${username} tarafından güncellendi`
            }[req.language],
            pushurl: '/Locations'
        })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyUpdated'), entity: Uuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function DeleteLocation(req, res, next) {

    const Uuid = req.params.ID

    if (!validator.isUUID(Uuid)) {
        return next(createValidationError([req.t('Locations.Error.IDRequired')], req.t('Locations'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'

    try {
        const locationData = await db.locationModel.findOne({ where: { Uuid } })
        if (!locationData) {
            return next(createNotFoundError(req.t('Locations.Error.NotFound'), req.t('Locations'), req.language))
        }
        if (!locationData.Isactive) {
            return next(createNotFoundError(req.t('Locations.Error.NotActive'), req.t('Locations'), req.language))
        }

        const doctordefines = await db.doctordefineModel.findAll({ where: { Isactive: true, LocationID: Uuid } })

        if (doctordefines.length > 0) {
            return next(createNotFoundError(req.t('Locations.Error.ThereAreDoctors'), req.t('Locations'), req.language))
        }

        await db.locationModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid }, transaction: t })

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: 'deleted',
            service: req.t('Locations'),
            role: 'locationnotification',
            message: {
                en: `${locationData.Name} location deleted by ${username}`,
                tr: `${locationData.Name} bölgesi ${username} tarafından silindi`
            }[req.language],
            pushurl: '/Locations'
        })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyDeleted'), entity: Uuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

module.exports = {
    GetLocation,
    GetLocations,
    GetLocationsCount,
    AddLocation,
    UpdateLocation,
    DeleteLocation
}
