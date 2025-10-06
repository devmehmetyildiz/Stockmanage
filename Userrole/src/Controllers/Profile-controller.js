const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const bcrypt = require('bcrypt')

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/

async function Getusersalt(req, res, next) {

    let validationErrors = []
    if (req.params.userId === undefined) {
        validationErrors.push(req.t('Profile.Error.UserIDRequired'))
    }
    if (!validator.isUUID(req.params.userId)) {
        validationErrors.push(req.t('Profile.Error.UnsupportedUserID'))
    }
    if (validationErrors.length > 0) {
        LoginRequest, LoginResponse
        return next(createValidationError(validationErrors, req.t('Profile'), req.language))
    }
    try {
        const usersalt = await db.usersaltModel.findOne({ where: { UserID: req.params.userId } })
        if (!usersalt) {
            return next(createNotFoundError(req.t('Profile.Error.UserSaltNotFound'), req.t('Profile'), req.language))
        }
        res.status(200).json(usersalt)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function Getuserbyemail(req, res, next) {

    let validationErrors = []
    if (req.params.email === undefined) {
        validationErrors.push(req.t('Profile.Error.EmailRequired'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Profile'), req.language))
    }
    try {
        const user = await db.userModel.findOne({ where: { Email: req.params.email } })
        if (!user) {
            return next(createNotFoundError(req.t('Profile.Error.NotFoundByEmail'), req.t('Profile'), req.language))
        }
        if (!user.Isactive) {
            return next(createNotFoundError(req.t('Profile.Error.NotActiveByEmail'), req.t('Profile'), req.language))
        }
        user.Roleuuids = await db.userroleModel.findAll({
            where: {
                UserID: user.Uuid
            },
            attributes: ['RoleID']
        })
        res.status(200).json(user)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function Getuserbyusername(req, res, next) {

    let validationErrors = []
    if (req.params.username === undefined) {
        validationErrors.push(req.t('Profile.Error.UsernameRequired'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Profile'), req.language))
    }
    try {
        const user = await db.userModel.findOne({ where: { Username: req.params.username } })
        if (!user) {
            return next(createNotFoundError(req.t('Profile.Error.NotFound'), req.t('Profile'), req.language))
        }
        if (!user.Isactive) {
            return next(createNotFoundError(req.t('Profile.Error.NotActive'), req.t('Profile'), req.language))
        }
        user.Roleuuids = await db.userroleModel.findAll({
            where: {
                UserID: user.Uuid
            },
            attributes: ['RoleID']
        })
        res.status(200).json(user)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function Changepasswordbyrequest(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
    } = req.body

    if (!Uuid) {
        validationErrors.push(req.t('Profile.Error.UserIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Profile.Error.UnsupportedUserID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Profile'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const user = await db.userModel.findOne({ where: { Uuid: Uuid } })
        if (!user) {
            return next(createNotFoundError(req.t('Profile.Error.NotFound'), req.t('Profile'), req.language))
        }
        if (!user.Isactive) {
            return next(createNotFoundError(req.t('Profile.Error.NotActive'), req.t('Profile'), req.language))
        }

        await db.userModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await t.commit()
        res.status(200).send('success')
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}

async function Changepassword(req, res, next) {
    let validationErrors = []
    const {
        Oldpassword,
        Newpassword,
        Newpasswordre,
    } = req.body

    if (!PASSWORD_REGEX.test(Newpassword)) {
        validationErrors.push(req.t('Password.Error.PasswordHint'))
    }
    if (!validator.isString(Newpassword)) {
        validationErrors.push(req.t('Users.Error.PasswordHint'))
    }
    if (!validator.isString(Newpasswordre)) {
        validationErrors.push(req.t('Profile.Error.NewPasswordReRequired'))
    }
    if (!validator.isString(Oldpassword)) {
        validationErrors.push(req.t('Profile.Error.OldPasswordRequired'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Profile'), req.language))
    }
    if (Newpassword !== Newpasswordre) {
        return next(createNotFoundError(req.t('Profile.Error.PasswordDidntMatch'), req.t('Profile'), req.language))
    }

    let newSalt = ""
    let usersalt = null
    try {
        usersalt = await db.usersaltModel.findOne({ where: { UserID: req.identity?.user?.Uuid } })
        dbUser = await db.userModel.findOne({ where: { Uuid: req.identity?.user?.Uuid } })
        if (!usersalt) {
            return next(createNotFoundError(req.t('Profile.Error.UserSaltNotFound'), req.t('Profile'), req.language))
        }
        const isValid = await ValidatePassword(Oldpassword, dbUser?.PasswordHash, usersalt.Salt)
        if (!isValid) {
            return next(createNotFoundError(req.t('Profile.Error.OldPasswordDidntMatch'), req.t('Profile'), req.language))
        }
        newSalt = await bcrypt.genSalt(16)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const hash = await bcrypt.hash(Newpassword, newSalt)
        await db.userModel.update({
            ...req.identity?.user,
            PasswordHash: hash,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: req.identity?.user?.Uuid }, transaction: t })
        await db.usersaltModel.update({
            ...usersalt,
            Salt: newSalt,
        }, { where: { UserID: req.identity?.user?.Uuid }, transaction: t })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    res.status(200).json({
        messages: "Password changed Successfully"
    })
}

async function Getusername(req, res, next) {
    if (!req.identity?.user) {
        return next(createNotFoundError(req.t('Profile.Error.NotFound'), req.t('Profile'), req.language))
    }
    res.status(200)
    return res.send(req?.identity?.user?.Username || '')
}

async function Getmeta(req, res, next) {
    if (!req.identity?.user) {
        return next(createNotFoundError(req.t('Profile.Error.NotFound'), req.t('Profile'), req.language))
    }
    res.status(200)
    return res.send(req.identity.user)
}

async function Gettablemeta(req, res, next) {

    if (!req.identity.user) {
        return next(createNotFoundError(req.t('Profile.Error.NotFound'), req.t('Profile'), req.language))
    }
    try {
        const tablemetaconfigs = await db.tablemetaconfigModel.findAll({ where: { UserID: req?.identity?.user?.Uuid || '' } })
        if (!tablemetaconfigs) {
            return next(createNotFoundError(req.t('Profile.TableMetaNotFound.NotFound'), req.t('Profile'), req.language))
        }
        res.status(200).json(tablemetaconfigs)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function Resettablemeta(req, res, next) {
    const key = req?.params?.metaKey
    if (!req.identity?.user) {
        return next(createNotFoundError(req.t('Profile.Error.NotFound'), req.t('Profile'), req.language))
    }
    try {
        await db.tablemetaconfigModel.destroy({ where: { Meta: key, UserID: req?.identity?.user?.Uuid || '' } })
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    Gettablemeta(req, res, next)
}

async function Savetablemeta(req, res, next) {

    let validationErrors = []
    const {
        Meta,
        Config,
    } = req.body

    if (validator.isString(Meta)) {
        validationErrors.push(req.t('Profile.Error.MetaRequired'))
    }
    if (validator.isString(Config)) {
        validationErrors.push(req.t('Profile.Error.ConfigRequired'))
    }
    //TODO bak buraya
    try {
        const tablemetaconfig = await db.tablemetaconfigModel.findOne({ where: { UserID: req?.identity?.user?.Uuid || '', Meta: Meta || '' } })
        if (!tablemetaconfig) {
            await db.tablemetaconfigModel.create({
                ...req.body,
                UserID: req?.identity?.user?.Uuid
            })
        } else {
            await db.tablemetaconfigModel.update({
                ...req.body,
            }, { where: { Id: tablemetaconfig.Id } })
        }
        const tablemetaconfigs = await db.tablemetaconfigModel.findAll({ where: { UserID: req?.identity?.user?.Uuid } })
        if (!tablemetaconfigs) {
            return next(createNotFoundError(req.t('Profile.Error.TableMetaNotFound'), req.t('Profile'), req.language))
        }
        res.status(200).json(tablemetaconfigs)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function ValidatePassword(UserPassword, DbPassword, salt) {
    try {
        let hash = await bcrypt.hash(UserPassword, salt)
        if (hash === DbPassword) {
            return true
        } else {
            return false
        }
    } catch {
        return false
    }
}

async function GetTableConfig(req, res, next) {

    let validationErrors = []
    if (req.query.Key === undefined) {
        validationErrors.push(req.t('Profile.Error.KeyRequired'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Profile'), req.language))
    }
    if (!req.identity.user) {
        return next(createNotFoundError(req.t('Profile.Error.NotFound'), req.t('Profile'), req.language))
    }

    try {
        const tableconfigs = await db.tableconfigModel.findAll({ where: { UserID: req?.identity?.user?.Uuid || '', Key: req.query.Key } })
        if (!tableconfigs) {
            return next(createNotFoundError(req.t('Profile.TableMetaNotFound.NotFound'), req.t('Profile'), req.language))
        }
        res.status(200).json(tableconfigs)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function SaveTableConfig(req, res, next) {

    let validationErrors = []
    const {
        Key,
        Config,
    } = req.body

    if (validator.isString(Key)) {
        validationErrors.push(req.t('Profile.Error.KeyRequired'))
    }
    if (validator.isString(Config)) {
        validationErrors.push(req.t('Profile.Error.ConfigRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Profile'), req.language))
    }

    if (!req.identity?.user) {
        return next(createNotFoundError(req.t('Profile.Error.NotFound'), req.t('Profile'), req.language))
    }

    try {
        const tableconfig = await db.tableconfigModel.findOne({ where: { UserID: req?.identity?.user?.Uuid || '', Key: Key } })
        if (!tableconfig) {
            await db.tableconfigModel.create({
                Key: Key,
                Config: Config,
                UserID: req?.identity?.user?.Uuid
            })
        } else {
            await db.tableconfigModel.update({
                Config: Config,
            }, { where: { Id: tableconfig.Id } })
        }
        const restableconfig = await db.tableconfigModel.findAll({ where: { UserID: req?.identity?.user?.Uuid, Key: Key } })
        if (!restableconfig) {
            return next(createNotFoundError(req.t('Profile.Error.TableMetaNotFound'), req.t('Profile'), req.language))
        }
        res.status(200).json(restableconfig)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function ResetTableConfig(req, res, next) {
    let validationErrors = []
    const {
        Key,
    } = req.body

    if (validator.isString(Key)) {
        validationErrors.push(req.t('Profile.Error.KeyRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Profile'), req.language))
    }

    if (!req.identity?.user) {
        return next(createNotFoundError(req.t('Profile.Error.NotFound'), req.t('Profile'), req.language))
    }
    try {
        await db.tableconfigModel.destroy({ where: { Key: Key, UserID: req?.identity?.user?.Uuid || '' } })
        res.status(200).json([])
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

module.exports = {
    Getusername,
    Getmeta,
    Changepassword,
    Resettablemeta,
    Gettablemeta,
    Savetablemeta,
    Getuserbyusername,
    Getuserbyemail,
    Getusersalt,
    Changepasswordbyrequest,
    GetTableConfig,
    SaveTableConfig,
    ResetTableConfig
}