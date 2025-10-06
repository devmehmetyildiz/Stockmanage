const config = require('../Config')
const { sequelizeErrorCatcher, requestErrorCatcher } = require('../Utilities/Error')
const createValidationError = require('../Utilities/Error').createValidationError
const createNotFoundError = require('../Utilities/Error').createNotFoundError
const createErrorList = require('../Utilities/Error').createList
const axios = require('axios');

const INVALID_AUTHORIZATION_HEADER = createErrorList('FORBIDDEN', 'INVALID_AUTHORIZATION_HEADER', {
    en: 'Access denied. Invalid authorization header',
    tr: 'Erişim reddedildi. Geçersiz yekilendirme başlığı',
})

const PUBLIC_URLS = [
    { method: 'GET', url: 'api-docs' }
]

async function authorizationChecker(req, res, next) {
    try {
        if (req.identity === undefined) req.identity = {}
        let accessToken = {}

        let isMicroservicesreq = req.headers && req.headers.session_key && req.headers.session_key === config.session.secret
        if (!isMicroservicesreq) {

            if (!isPublicUrlRequest(req.method, req.originalUrl)) {
                if (!doesAuthorizationHeaderExists(req.headers)) {
                    return next(createValidationError({
                        code: 'AUTHORIZATION_HEADER_REQUIRED', description: {
                            en: 'You need to provide authorization headers to access this resource',
                            tr: 'Bu kaynağa erişmek için yetkilendirme başlıkları gerekiyor',
                        }
                    }, req.language))
                }

                let isTokenValid = false
                let authorizationHeaderType = getAuthorizationHeaderType(req.headers)
                if (authorizationHeaderType === 'bearer') {
                    let bearerToken = getBearerToken(req.headers)
                    if (bearerToken) {
                        try {

                            const accessTokenresponse = await axios(
                                {
                                    method: 'POST',
                                    url: config.services.Auth + 'Oauth/ValidateToken',
                                    data: {
                                        accessToken: bearerToken
                                    }
                                }
                            )
                            accessToken = accessTokenresponse.data
                            isTokenValid = true
                        } catch (err) {
                            return next(requestErrorCatcher(err, 'AUTH'))
                        }
                    }

                    if (isTokenValid) {
                        req.identity.accessToken = bearerToken
                        req.identity.user = null
                        req.identity.privileges = []

                        try {
                            const user = await db.userModel.findOne({ where: { Uuid: accessToken.Userid } })
                            if (!user) {
                                return next(createNotFoundError(req.t('Users.Error.NotFound'), req.t('Users'), req.language))
                            }
                            if (!user.Isactive) {
                                return next(createNotFoundError(req.t('Users.Error.NotActive'), req.t('Users'), req.language))
                            }
                            let rolesuuids = await db.userroleModel.findAll({
                                where: {
                                    UserID: user.Uuid
                                }
                            })
                            user.Roles = await db.roleModel.findAll({
                                where: {
                                    Uuid: rolesuuids.map(u => { return u.RoleID })
                                }
                            })
                            user.PasswordHash && delete user.PasswordHash
                            req.identity.user = user
                            const userroles = await db.userroleModel.findAll({ where: { UserID: user.Uuid } })
                            if (!userroles) {
                                return next(createNotFoundError(req.t('Users.Error.UserroleNotFound'), req.t('Users'), req.language))
                            }
                            for (const userrole of userroles) {
                                let privileges = await db.roleprivilegeModel.findAll({ where: { RoleID: userrole.RoleID } })
                                req.identity.privileges = privileges.map(u => { return u.PrivilegeID }).concat(req.identity.privileges)
                            }
                        } catch (error) {
                            sequelizeErrorCatcher(error)
                            next()
                        }
                    }
                }
            } else {
                return next(INVALID_AUTHORIZATION_HEADER[req.language])
            }
        }
        next()
    } catch (err) {
        return next(err)
    }
}

function doesAuthorizationHeaderExists(headers) {
    return headers.authorization &&
        (headers.authorization.toLowerCase().indexOf('bearer') === 0)
}

function getAuthorizationHeaderType(headers) {
    if (!headers.authorization) {
        return null
    }

    if (headers.authorization.toLowerCase().indexOf('bearer') === 0) {
        return 'bearer'
    }

    return null
}

function getBearerToken(headers) {
    if (!headers.authorization) {
        return null
    }

    let headerParts = headers.authorization.split(' ')
    if (headerParts[0].toLowerCase() == 'bearer' && headerParts.length >= 2)
        return headerParts[1]
    else
        return null
}

function isPublicUrlRequest(method, url) {
    const clearedUrl = (url || '').toLocaleLowerCase().replace('/', '')
    let res = false
    let route = PUBLIC_URLS.find(u => u.method.toLowerCase() === method.toLowerCase() && clearedUrl.includes(u.url.toLocaleLowerCase()))
    if (route) {
        res = true
    }
    return res
}

module.exports = authorizationChecker