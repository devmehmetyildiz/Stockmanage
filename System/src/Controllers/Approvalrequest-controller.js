const { initApproveMessageService, publishEvent } = require('../Services/MessageService');
const { sequelizeErrorCatcher, createValidationError, createNotFoundError } = require('../Utilities/Error');
const validator = require('../Utilities/Validator');
const uuid = require('uuid').v4

async function GetApprovalrequests(req, res, next) {
    try {
        const userPrivileges = req?.identity?.privileges || []

        const whereQuery = { ...req.query }

        if (userPrivileges.length > 0) {
            if (!userPrivileges.includes('admin')) {
                whereQuery.ApproveRoles = {
                    [Op.or]: userPrivileges.map(priv => ({
                        [Op.like]: `%${priv}%`
                    }))
                };
            }
            const approvals = await db.approvalrequestModel.findAll({ where: req.query, order: [['RequestTime', 'DESC']] });
            res.status(200).json(approvals);
        } else {
            res.status(200).json([]);
        }
    } catch (error) {
        return next(sequelizeErrorCatcher(error));
    }
}

async function GetApprovalrequestCounts(req, res, next) {
    try {
        const userPrivileges = req?.identity?.privileges || []

        const whereQuery = { ...req.query }

        if (userPrivileges.length > 0) {
            if (!userPrivileges.includes('admin')) {
                whereQuery.ApproveRoles = {
                    [Op.or]: userPrivileges.map(priv => ({
                        [Op.like]: `%${priv}%`
                    }))
                };
            }
            const approvals = await db.approvalrequestModel.count({ where: req.query });
            res.status(200).json(approvals);
        } else {
            res.status(200).json([]);
        }
    } catch (error) {
        return next(sequelizeErrorCatcher(error));
    }
}

async function ApproveApprovalrequests(req, res, next) {

    const {
        ApproveList
    } = req.body

    if (!validator.isArray(ApproveList) || ApproveList.length <= 0) {
        return next(createValidationError([req.t('Approvalrequests.Error.ApproveListNotFound')], req.t('Approve'), req.language));
    }


    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System';

    try {
        for (const approveItem of ApproveList) {
            if (!validator.isUUID(approveItem.Uuid)) {
                return next(createValidationError([req.t('Approvalrequests.Error.UnsupportedApprovalID')], req.t('Approvalrequest'), req.language));
            }

            const approval = await db.approvalrequestModel.findOne({ where: { Uuid: approveItem.Uuid }, transaction: t });
            if (!approval) {
                return next(createNotFoundError(req.t('Approvalrequests.Error.NotFound'), req.t('Approvalrequest'), req.language));
            }
            if (!approval.Isactive) {
                return next(createNotFoundError(req.t('Approvalrequests.Error.NotActive'), req.t('Approvalrequest'), req.language));
            }
            if (approval.Isapproved) {
                return next(createNotFoundError(req.t('Approvalrequests.Error.Approved'), req.t('Approvalrequest'), req.language));
            }
            if (approval.Isrejected) {
                return next(createNotFoundError(req.t('Approvalrequests.Error.Rejected'), req.t('Approvalrequest'), req.language));
            }


            const userPrivileges = req?.identity?.privileges || []

            if (!userPrivileges.includes('admin')) {
                const approveRoles = (approval.ApproveRoles || '').split(',')

                if (!(approveRoles.some(item => userPrivileges.includes(item)))) {
                    return next(createNotFoundError(req.t('Approvalrequests.Error.Usernotauthorized'), req.t('Approvalrequest'), req.language));
                }
            }

            await db.approvalrequestModel.update({
                Isapproved: true,
                Comment: approveItem.Comment,
                ApproveUserID: req?.identity?.user?.Uuid ?? username,
                ApproveTime: new Date()
            }, { where: { Uuid: approveItem.Uuid }, transaction: t });

            publishEvent("approveResponse", approval.Service, approval.Table, {
                Service: approval.Service,
                Table: approval.Table,
                Record: approval.Record,
                ApproveTime: new Date(),
                ApproveUserID: req?.identity?.user?.Uuid ?? username,
                Comment: approveItem.Comment,
                Isapproved: true
            });
        }
        await t.commit();
    } catch (err) {
        await t.rollback();
        return next(sequelizeErrorCatcher(err));
    }

    res.status(200).json({
        successCount: ApproveList
    });
}

async function RejectApprovalrequests(req, res, next) {
    const {
        RejectList
    } = req.body

    if (!validator.isArray(RejectList) || RejectList.length <= 0) {
        return next(createValidationError([req.t('Approvalrequests.Error.RejectListNotFound')], req.t('Approvalrequests'), req.language));
    }


    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System';

    try {
        for (const rejectItem of RejectList) {
            if (!validator.isUUID(rejectItem.Uuid)) {
                return next(createValidationError([req.t('Approvalrequests.Error.UnsupportedRejectID')], req.t('Approvalrequests'), req.language));
            }

            const approval = await db.approvalrequestModel.findOne({ where: { Uuid: rejectItem.Uuid }, transaction: t });
            if (!approval) {
                return next(createNotFoundError(req.t('Approvalrequests.Error.NotFound'), req.t('Approvalrequest'), req.language));
            }
            if (!approval.Isactive) {
                return next(createNotFoundError(req.t('Approvalrequests.Error.NotActive'), req.t('Approvalrequest'), req.language));
            }
            if (approval.Isapproved) {
                return next(createNotFoundError(req.t('Approvalrequests.Error.Approved'), req.t('Approvalrequest'), req.language));
            }
            if (approval.Isrejected) {
                return next(createNotFoundError(req.t('Approvalrequests.Error.Rejected'), req.t('Approvalrequest'), req.language));
            }

            const userPrivileges = req?.identity?.privileges || []

            if (!userPrivileges.includes('admin')) {
                const approveRoles = (approval.ApproveRoles || '').split(',')

                if (!(approveRoles.some(item => userPrivileges.includes(item)))) {
                    return next(createNotFoundError(req.t('Approvalrequests.Error.Usernotauthorized'), req.t('Approvalrequest'), req.language));
                }
            }

            await db.approvalrequestModel.update({
                Comment: rejectItem.Comment,
                Isrejected: true,
                ApproveUserID: req?.identity?.user?.Uuid ?? username,
                ApproveTime: new Date()
            }, { where: { Uuid: rejectItem.Uuid }, transaction: t });

            publishEvent("approveResponse", approval.Service, approval.Table, {
                Service: approval.Service,
                Table: approval.Table,
                Record: approval.Record,
                ApproveTime: new Date(),
                ApproveUserID: req?.identity?.user?.Uuid ?? username,
                ApproveUsername: username,
                Comment: rejectItem.Comment,
                Isrejected: true
            });
        }
        await t.commit();


    } catch (err) {
        await t.rollback();
        return next(sequelizeErrorCatcher(err));
    }

    res.status(200).json({
        successCount: RejectList.length
    });
}

async function ConsumeApprovalRequests() {
    const { channel, q } = await initApproveMessageService('approveRequest', 'System', 'Approval');

    console.log('RabbitMQ consumer started, waiting for messages...');

    channel.consume(q.queue, async (msg) => {
        if (msg) {
            try {
                const payload = JSON.parse(msg.content.toString());
                await db.approvalrequestModel.create({
                    ...payload,
                    Uuid: uuid(),
                    Isapproved: false,
                    Isrejected: false,
                    Isactive: true
                });

                console.log('Approval record inserted:', payload.Record);
                channel.ack(msg);
            } catch (error) {
                console.error('Error processing message:', error);
            }
        }
    });
}

module.exports = {
    GetApprovalrequestCounts,
    GetApprovalrequests,
    ApproveApprovalrequests,
    RejectApprovalrequests,
    ConsumeApprovalRequests
};
