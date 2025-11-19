const { PAYMENT_TRANSACTION_TYPE_CLOSE_TRANSACTION, VISIT_PAYMENT_STATUS_FULL, VISIT_PAYMENT_STATUS_SEMI, VISIT_STATU_CLOSED } = require("../Constants")
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

async function ApproveTransaction(req, res, next) {
    let validationErrors = []
    const {
        TransactionID,
        Paymentmethod,
        Paydate,
        Description
    } = req.body

    if (!validator.isUUID(TransactionID)) {
        validationErrors.push(req.t('Paymentplans.Error.TransactionIDRequired'))
    }
    if (!validator.isNumber(Paymentmethod)) {
        validationErrors.push(req.t('Paymentplans.Error.PaymentmethodRequired'))
    }
    if (!validator.isISODate(Paydate)) {
        validationErrors.push(req.t('Paymentplans.Error.PaydateRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Paymentplans'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const transaction = await db.paymenttransactionModel.findOne({ where: { Uuid: TransactionID } })
        if (!transaction) {
            return next(createNotFoundError(req.t('Paymentplans.Error.TransactionNotFound'), req.t('Paymentplans'), req.language))
        }
        if (!transaction.Isactive) {
            return next(createNotFoundError(req.t('Paymentplans.Error.TransactionNotActive'), req.t('Paymentplans'), req.language))
        }
        if (!(transaction.Status === 0 || transaction.Status === false)) {
            return next(createNotFoundError(req.t('Paymentplans.Error.TransactionCompleted'), req.t('Paymentplans'), req.language))
        }

        const plan = await db.paymentplanModel.findOne({ where: { Uuid: transaction.PaymentplanID } })

        if (!plan) {
            return next(createNotFoundError(req.t('Paymentplans.Error.NotFound'), req.t('Paymentplans'), req.language))
        }
        if (!plan.Isactive) {
            return next(createNotFoundError(req.t('Paymentplans.Error.NotActive'), req.t('Paymentplans'), req.language))
        }

        await db.paymenttransactionModel.update({
            Paydate,
            Status: true,
            Paymentmethod,
            Description,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { transaction: t, where: { Uuid: TransactionID } })

        const allUnPaidTransactions = await db.paymenttransactionModel.findAll({ where: { PaymentplanID: plan.Uuid, Isactive: true, Status: false } })

        const unPaidTransactions = allUnPaidTransactions.filter(u => u.Uuid !== TransactionID)

        const remainingValue = unPaidTransactions.reduce((prev, curr) => {
            return prev + curr.Amount
        }, 0)

        await db.paymentplanModel.update({
            Remainingvalue: remainingValue,
            Status: unPaidTransactions.length > 0 ? VISIT_PAYMENT_STATUS_SEMI : VISIT_PAYMENT_STATUS_FULL,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { transaction: t, where: { Uuid: plan?.Uuid } })

        if (unPaidTransactions.length <= 0) {
            await db.visitModel.update({
                Status: VISIT_STATU_CLOSED,
                Updateduser: username,
                Updatetime: new Date(),
            }, { transaction: t, where: { Uuid: plan.VisitID } })
        }

        await t.commit()
        res.status(200).json(plan)
    } catch (error) {
        if (t) await t.rollback()
        next(sequelizeErrorCatcher(error))
    }
}



module.exports = {
    GetPaymentplansCount,
    GetPaymentplans,
    GetPaymentplan,
    GetPaymenttransactions,
    GetPaymenttransactionCounts,
    ApproveTransaction
}
