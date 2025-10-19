const { sequelizeErrorCatcher } = require("../Utilities/Error")
const { createValidationError, createNotFoundError } = require("../Utilities/Error")
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetPaymentplansCount(req, res, next) {
    try {
        const count = await db.paymentplanModel.count({ where: req.query })
        res.status(200).json(count)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetPaymentplans(req, res, next) {
    try {
        const paymentplans = await db.paymentplanModel.findAll({ where: req.query })
        res.status(200).json(paymentplans)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetPaymenttransactions(req, res, next) {
    try {
        const transactions = await db.paymenttransactionModel.findAll({ where: req.query })
        res.status(200).json(transactions)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetPaymenttransactionCounts(req, res, next) {
    try {
        const transactions = await db.paymenttransactionModel.count({ where: req.query })
        res.status(200).json(transactions)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

async function GetPaymentplan(req, res, next) {
    const Uuid = req.params.ID

    if (!validator.isUUID(Uuid)) {
        return next(createValidationError([req.t('Paymentplans.Error.IDRequired')], req.t('Paymentplans'), req.language))
    }

    try {
        const plan = await db.paymentplanModel.findOne({ where: { Uuid } })
        if (!plan) {
            return next(createNotFoundError(req.t('Paymentplans.Error.NotFound'), req.t('Paymentplans'), req.language))
        }
        if (!plan.Isactive) {
            return next(createNotFoundError(req.t('Paymentplans.Error.NotActive'), req.t('Paymentplans'), req.language))
        }

        const transactions = await db.paymenttransactionModel.findAll({ where: { Isactive: true, PaymentplanID: Uuid } })
        plan.Transactions = transactions ?? []

        res.status(200).json(plan)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

module.exports = {
    GetPaymentplansCount,
    GetPaymentplans,
    GetPaymentplan,
    GetPaymenttransactions,
    GetPaymenttransactionCounts
}
