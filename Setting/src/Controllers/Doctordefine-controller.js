const { sequelizeErrorCatcher } = require("../Utilities/Error")
const { createValidationError, createNotFoundError } = require("../Utilities/Error")
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const { publishEvent } = require("../Services/MessageService")

async function GetDoctordefinesCount(req, res, next) {
    try {
        const doctordefines = await db.doctordefineModel.count({ where: req.query })
        res.status(200).json(doctordefines)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetDoctordefines(req, res, next) {
    try {
        const doctordefines = await db.doctordefineModel.findAll({ where: req.query })
        res.status(200).json(doctordefines)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetDoctordefine(req, res, next) {
    const Uuid = req.params.ID

    if (!validator.isUUID(Uuid)) {
        return next(createValidationError([req.t('Doctordefines.Error.IDRequired')], req.t('Doctordefines'), req.language))
    }

    try {
        const doctordefine = await db.doctordefineModel.findOne({ where: { Uuid } })
        if (!doctordefine) {
            return next(createNotFoundError(req.t('Doctordefines.Error.NotFound'), req.t('Doctordefines'), req.language))
        }
        if (!doctordefine.Isactive) {
            return next(createNotFoundError(req.t('Doctordefines.Error.NotActive'), req.t('Doctordefines'), req.language))
        }

        res.status(200).json(doctordefine)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function AddDoctordefine(req, res, next) {
    let validationErrors = []
    const {
        Name,
        Surname,
        CountryID,
        Address,
        LocationID,
        Gender,
        Phonenumber1,
        Phonenumber2,
        Email,
        Specialization,
        Status,
        Role,
        Description,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Doctordefines.Error.NameRequired'))
    }
    if (!validator.isString(Surname)) {
        validationErrors.push(req.t('Doctordefines.Error.SurnameRequired'))
    }
    if (!validator.isString(LocationID)) {
        validationErrors.push(req.t('Doctordefines.Error.LocationIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Doctordefines'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'
    const itemUuid = uuid()

    try {
        await db.doctordefineModel.create({
            Uuid: itemUuid,
            Name,
            Surname,
            CountryID,
            Address,
            LocationID,
            Gender,
            Phonenumber1,
            Phonenumber2,
            Email,
            Specialization,
            Status: Status ?? true,
            Role,
            Description,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true,
        }, { transaction: t })

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: {
                en: "Created",
                tr: "Oluşturuldu"
            }[req.language],
            service: req.t('Doctordefines'),
            role: 'doctordefinenotification',
            message: {
                en: `${Name} ${Surname} doctor define created by ${username}`,
                tr: `${Name} ${Surname} doktor tanımı ${username} tarafından oluşturuldu`
            }[req.language],
            pushurl: '/Doctordefines'
        })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyCreated'), entity: itemUuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function UpdateDoctordefine(req, res, next) {
    let validationErrors = []
    const {
        Uuid,
        Name,
        Surname,
        CountryID,
        Address,
        LocationID,
        Gender,
        Phonenumber1,
        Phonenumber2,
        Email,
        Specialization,
        Status,
        Role,
        Description,
    } = req.body

    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Doctordefines.Error.IDRequired'))
    }
    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Doctordefines.Error.NameRequired'))
    }
    if (!validator.isString(Surname)) {
        validationErrors.push(req.t('Doctordefines.Error.SurnameRequired'))
    }
    if (!validator.isString(LocationID)) {
        validationErrors.push(req.t('Doctordefines.Error.LocationIDRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Doctordefines'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'

    try {
        const doctordefine = await db.doctordefineModel.findOne({ where: { Uuid } })
        if (!doctordefine) {
            return next(createNotFoundError(req.t('Doctordefines.Error.NotFound'), req.t('Doctordefines'), req.language))
        }
        if (!doctordefine.Isactive) {
            return next(createNotFoundError(req.t('Doctordefines.Error.NotActive'), req.t('Doctordefines'), req.language))
        }

        await db.doctordefineModel.update({
            Name,
            Surname,
            CountryID,
            Address,
            LocationID,
            Gender,
            Phonenumber1,
            Phonenumber2,
            Email,
            Specialization,
            Status,
            Role,
            Description,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid }, transaction: t })

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: {
                en: "Updated",
                tr: "Güncellendi"
            }[req.language],
            service: req.t('Doctordefines'),
            role: 'doctordefinenotification',
            message: {
                en: `${Name} ${Surname} doctor define updated by ${username}`,
                tr: `${Name} ${Surname} doktor tanımı ${username} tarafından güncellendi`
            }[req.language],
            pushurl: '/Doctordefines'
        })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyUpdated'), entity: Uuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function DeleteDoctordefine(req, res, next) {
    const Uuid = req.params.ID

    if (!validator.isUUID(Uuid)) {
        return next(createValidationError([req.t('Doctordefines.Error.IDRequired')], req.t('Doctordefines'), req.language))
    }

    const t = await db.sequelize.transaction()
    const username = req?.identity?.user?.Username || 'System'

    try {
        const doctordefine = await db.doctordefineModel.findOne({ where: { Uuid } })
        if (!doctordefine) {
            return next(createNotFoundError(req.t('Doctordefines.Error.NotFound'), req.t('Doctordefines'), req.language))
        }
        if (!doctordefine.Isactive) {
            return next(createNotFoundError(req.t('Doctordefines.Error.NotActive'), req.t('Doctordefines'), req.language))
        }

        await db.doctordefineModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid }, transaction: t })

        publishEvent("notificationCreate", 'User', 'Userrole', {
            type: {
                en: "Deleted",
                tr: "Silindi"
            }[req.language],
            service: req.t('Doctordefines'),
            role: 'doctordefinenotification',
            message: {
                en: `${doctordefine.Name} ${doctordefine.Surname} doctor define deleted by ${username}`,
                tr: `${doctordefine.Name} ${doctordefine.Surname} doktor tanımı ${username} tarafından silindi`
            }[req.language],
            pushurl: '/Doctordefines'
        })

        await t.commit()
        res.status(200).json({ message: req.t('General.SuccessfullyDeleted'), entity: Uuid })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

module.exports = {
    GetDoctordefine,
    GetDoctordefines,
    GetDoctordefinesCount,
    AddDoctordefine,
    UpdateDoctordefine,
    DeleteDoctordefine
}
