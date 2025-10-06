const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const bcrypt = require('bcrypt')
const CreateNotification = require("../Utilities/CreateNotification")
const { notificationTypes } = require("../Constants/Defines")

const USERNAME_REGEX = /^[a-z][a-z0-9]{2,24}$/

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

async function Register(req, res, next) {

    try {
        const usercount = await db.userModel.count({
            where: {
                Isactive: true
            }
        });
        if (usercount > 0) {
            return next(createValidationError(req.t('Users.Error.AdminUserAlreadyActive'), req.t('Users'), req.language))
        }
        const {
            Username,
            Email,
            Password,
        } = req.body
        let validationErrors = []
        if (!validator.isString(Username)) {
            validationErrors.push(req.t('Roles.Error.UsernameRequired'))
        }
        if (!validator.isString(Password)) {
            validationErrors.push(req.t('Roles.Error.PasswordRequired'))
        }
        if (!validator.isString(Email)) {
            validationErrors.push(req.t('Roles.Error.EmailRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Users'), req.language))
        }


        const salt = await bcrypt.genSalt(16)
        const hash = await bcrypt.hash(Password, salt)
        let useruuid = uuid()
        let adminRoleuuid = uuid()

        const t = await db.sequelize.transaction();

        try {
            const createadminRolePromise = db.roleModel.create({
                Uuid: adminRoleuuid,
                Name: "Admin",
                Createduser: "System",
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })

            const createadminRoleprivelegesPromise = db.roleprivilegeModel.create({
                RoleID: adminRoleuuid,
                PrivilegeID: "admin"
            }, { transaction: t })

            const createUserPromise = db.userModel.create({
                Username: Username,
                Email: Email,
                Uuid: useruuid,
                Name: "Admin",
                Surname: "Sys",
                Language: "tr",
                PasswordHash: hash,
                Isworker: false,
                Isworking: true,
                Createduser: "System",
                Createtime: new Date(),
                Isactive: true,
            }, { transaction: t })

            const createUserSaltPromise = db.usersaltModel.create({
                UserID: useruuid,
                Salt: salt
            }, { transaction: t })

            const createUserrolePromise = db.userroleModel.create({
                UserID: useruuid,
                RoleID: adminRoleuuid
            }, { transaction: t })

            await Promise.all([createadminRolePromise, createadminRoleprivelegesPromise,
                createUserPromise, createUserSaltPromise, createUserrolePromise])
            await t.commit()


            res.status(200).json({
                messages: "Admin User Created Successfully"
            })
        } catch (error) {
            await t.rollback()
            next(sequelizeErrorCatcher(error))
        }
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }

}

async function GetUsersList(req, res, next) {
    try {
        const users = await db.userModel.findAll({
            where: req.query,
            attributes: [
                'Uuid',
                'Username',
                'Name',
                'Surname',
                'Email',
                'Workstarttime',
                'Workendtime',
                'Leftinfo',
                'Gender',
            ]
        })
        res.status(200).json(users)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetUsersCounts(req, res, next) {
    try {
        const users = await db.userModel.count({ where: req.query })
        res.status(200).json(users)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetUsers(req, res, next) {
    try {
        let data = null
        const users = await db.userModel.findAll({ where: req.query })
        for (const user of users) {
            user.Roleuuids = await db.userroleModel.findAll({
                where: {
                    UserID: user.Uuid
                },
                attributes: ['RoleID']
            })
        }
        users.forEach(element => {
            element.PasswordHash && delete element.PasswordHash
        });
        if (req?.Uuid) {
            data = await db.userModel.findOne({ where: { Uuid: req?.Uuid } });
        }
        res.status(200).json({ list: users, data: data })
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetUser(req, res, next) {

    let validationErrors = []
    if (req.params.userId === undefined) {
        validationErrors.push(req.t('Users.Error.UserIDRequired'))
    }
    if (!validator.isUUID(req.params.userId)) {
        validationErrors.push(req.t('Users.Error.UnsupportedUserID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Users'), req.language))
    }
    try {
        const user = await db.userModel.findOne({ where: { Uuid: req.params.userId } })
        if (!user) {
            return next(createNotFoundError(req.t('Users.Error.NotFound'), req.t('Users'), req.language))
        }
        if (!user.Isactive) {
            return next(createNotFoundError(req.t('Users.Error.NotActive'), req.t('Users'), req.language))
        }
        user.Roleuuids = await db.userroleModel.findAll({
            where: {
                UserID: user.Uuid
            },
            attributes: ['RoleID']
        })
        user.PasswordHash && delete user.PasswordHash
        res.status(200).json(user)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function AddUser(req, res, next) {

    let validationErrors = []
    const {
        Username,
        Name,
        Surname,
        Language,
        Email,
        Password,
        PasswordRe,
        Roles,
    } = req.body

    if (!USERNAME_REGEX.test(Username)) {
        validationErrors.push(req.t('Users.Error.UsernameHint'))
    }
    if (!PASSWORD_REGEX.test(Password)) {
        validationErrors.push(req.t('Users.Error.PasswordHint'))
    }
    if (!EMAIL_REGEX.test(Email)) {
        validationErrors.push(req.t('Users.Error.EmailHint'))
    }
    if (Password !== PasswordRe) {
        validationErrors.push(req.t('Users.Error.PasswordSameHint'))
    }
    if (!validator.isString(Username)) {
        validationErrors.push(req.t('Users.Error.UsernameRequired'))
    }
    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Users.Error.NameRequired'))
    }
    if (!validator.isString(Surname)) {
        validationErrors.push(req.t('Users.Error.SurnameRequired'))
    }
    if (!validator.isString(Language)) {
        validationErrors.push(req.t('Users.Error.LanguageRequired'))
    }
    if (!validator.isString(Password)) {
        validationErrors.push(req.t('Users.Error.PasswordRequired'))
    }
    if (!validator.isString(PasswordRe)) {
        validationErrors.push(req.t('Users.Error.PasswordReRequired'))
    }
    if (!validator.isString(Email)) {
        validationErrors.push(req.t('Users.Error.EmailRequired'))
    }
    if (!validator.isArray(Roles)) {
        validationErrors.push(req.t('Users.Error.RolesRequired'))
    }
    const usernamecheck = GetUserByUsername(next, Username)
        .then(user => {
            if (user && Object.keys(user).length > 0) {
                validationErrors.push(req.t('Users.Error.UsernameDuplicated'))
            }
        })
    const emailcheck = GetUserByEmail(next, Email)
        .then(user => {
            if (user && Object.keys(user).length > 0) {
                validationErrors.push(req.t('Users.Error.EmailDuplicated'))
            }
        })
    await Promise.all([usernamecheck, emailcheck])
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Users'), req.language))
    }

    const salt = await bcrypt.genSalt(16)
    const hash = await bcrypt.hash(Password, salt)
    let useruuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.userModel.create({
            ...req.body,
            Uuid: useruuid,
            PasswordHash: hash,
            Createduser: username,
            Isworking: true,
            Createtime: new Date(),
            Isactive: true,
        }, { transaction: t })

        await db.usersaltModel.create({
            UserID: useruuid,
            Salt: salt
        }, { transaction: t })
        for (const role of Roles) {
            if (!role.Uuid || !validator.isUUID(role.Uuid)) {
                return next(createValidationError(req.t('Users.Error.UnsupportedRoleID'), req.t('Users'), req.language))
            }
            await db.userroleModel.create({
                UserID: useruuid,
                RoleID: role.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: notificationTypes.Create,
            service: req.t('Users'),
            role: 'usernotification',
            message: {
                tr: `${Username} Kullanıcısı ${username} Tarafından Oluşturuldu.`,
                en: `${Username} User Created By ${username}`
            }[req.language],
            pushurl: '/Users'
        })


        await t.commit()
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
    req.Uuid = useruuid
    GetUsers(req, res, next)
}

async function UpdateUser(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        Username,
        Language,
        Email,
        Roles,
    } = req.body

    if (!validator.isString(Username)) {
        validationErrors.push(req.t('Users.Error.UsernameDuplicated'))
    }
    if (!validator.isString(Language)) {
        validationErrors.push(req.t('Users.Error.LanguageRequired'))
    }
    if (!validator.isString(Email)) {
        validationErrors.push(req.t('Users.Error.EmailRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Users.Error.UserIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Users.Error.UnsupportedUserID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Users'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const user = await db.userModel.findOne({ where: { Uuid: Uuid } })
        if (!user) {
            return next(createNotFoundError(req.t('Users.Error.NotFound'), req.t('Users'), req.language))
        }
        if (!user.Isactive) {
            return next(createNotFoundError(req.t('Users.Error.NotActive'), req.t('Users'), req.language))
        }

        await db.userModel.update({
            ...req.body,
            Username: user?.Username,
            PasswordHash: user?.PasswordHash,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.userroleModel.destroy({ where: { UserID: Uuid }, transaction: t });

        for (const role of Roles) {
            if (!role.Uuid || !validator.isUUID(role.Uuid)) {
                return next(createValidationError(req.t('Users.Error.UnsupportedRoleID'), req.t('Users'), req.language))
            }
            await db.userroleModel.create({
                UserID: Uuid,
                RoleID: role.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: notificationTypes.Update,
            service: req.t('Users'),
            role: 'usernotification',
            message: {
                tr: `${Username} Kullanıcısı ${username} Tarafından Güncellendi.`,
                en: `${Username} User Updated By ${username}`
            }[req.language],
            pushurl: '/Users'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
    req.Uuid = Uuid
    GetUsers(req, res, next)
}

async function DeleteUser(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.userId

    if (!Uuid) {
        validationErrors.push(req.t('Users.Error.UserIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Users.Error.UnsupportedUserID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Users'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const user = await db.userModel.findOne({ where: { Uuid: Uuid } })
        if (!user) {
            return next(createNotFoundError(req.t('Users.Error.NotFound'), req.t('Users'), req.language))
        }
        if (!user.Isactive) {
            return next(createNotFoundError(req.t('Users.Error.NotActive'), req.t('Users'), req.language))
        }

        await db.userModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: notificationTypes.Delete,
            service: req.t('Users'),
            role: 'usernotification',
            message: {
                tr: `${user?.Username} Kullanıcısı ${username} Tarafından Silindi.`,
                en: `${user?.Username} User Deleted By ${username}`
            }[req.language],
            pushurl: '/Users'
        })
        await t.commit();

    } catch (error) {
        await t.rollback();
        next(sequelizeErrorCatcher(error))
    }
    GetUsers(req, res, next)
}

async function RemoveUsers(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        Workendtime,
        Leftinfo
    } = req.body

    if (!validator.isISODate(Workendtime)) {
        validationErrors.push(req.t('Users.Error.WorkendtimeRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Users.Error.UserIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Users.Error.UnsupportedUserID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Users'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {

        const user = await db.userModel.findOne({ where: { Uuid: Uuid } })
        if (!user) {
            return next(createNotFoundError(req.t('Users.Error.NotFound'), req.t('Users'), req.language))
        }
        if (!user.Isactive) {
            return next(createNotFoundError(req.t('Users.Error.NotActive'), req.t('Users'), req.language))
        }
        if (user.Isleft) {
            return next(createNotFoundError(req.t('Users.Error.Alreadyleft'), req.t('Users'), req.language))
        }
        if (!user.Isworker) {
            return next(createNotFoundError(req.t('Users.Error.Isnotworker'), req.t('Users'), req.language))
        }

        await db.userModel.update({
            Isworking: false,
            Leftinfo: Leftinfo,
            Workendtime: Workendtime,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await t.commit()

        await CreateNotification({
            type: notificationTypes.Update,
            service: req.t('Users'),
            role: 'usernotification',
            message: {
                tr: `${user?.Username} Kullanıcısı ${username} Tarafından İşten Ayrıldı Olarak Güncellendi.`,
                en: `${user?.Username} User Left  By ${username}`
            }[req.language],
            pushurl: '/Users'
        })
    } catch (error) {
        await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
    GetUsers(req, res, next)
}

function GetUserByEmail(next, Email) {
    return new Promise((resolve) => {
        db.userModel.findOne({ where: { Email: Email, Isactive: true } })
            .then(user => {
                resolve(user)
            })
            .catch(err => sequelizeErrorCatcher(err))
            .catch(next)
    })
}

function GetUserByUsername(next, Username) {
    return new Promise((resolve) => {
        db.userModel.findOne({ where: { Username: Username, Isactive: true } })
            .then(user => {
                resolve(user)
            })
            .catch(err => sequelizeErrorCatcher(err))
            .catch(next)
    })
}

module.exports = {
    GetUsersList,
    GetUsersCounts,
    GetUsers,
    GetUser,
    AddUser,
    UpdateUser,
    DeleteUser,
    Register,
    RemoveUsers,
}