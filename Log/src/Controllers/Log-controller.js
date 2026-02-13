const { initApproveMessageService } = require("../Services/MessageService");
const { sequelizeErrorCatcher, createValidationError } = require("../Utilities/Error")
const validator = require("../Utilities/Validator")

async function GetLogsByQuerry(req, res, next) {
    try {
        const {
            Startdate,
            Enddate,
            Status,
            Service,
            UserID,
            Targeturl,
            Requesttype
        } = req.body

        let whereClause = {};

        if (Startdate && Enddate) {
            whereClause.Createtime = {
                [Sequelize.Op.between]: [Startdate, Enddate]
            };
        } else if (Startdate) {
            whereClause.Createtime = {
                [Sequelize.Op.gte]: Startdate
            };
        } else if (Enddate) {
            whereClause.Createtime = {
                [Sequelize.Op.lte]: Enddate
            };
        }

        if (Status) {
            whereClause.Status = Status;
        }

        if (Service) {
            whereClause.Service = Service;
        }

        if (UserID) {
            whereClause.UserID = UserID;
        }

        if (Targeturl) {
            whereClause.Targeturl = Targeturl;
        }

        if (Requesttype) {
            whereClause.Requesttype = Requesttype;
        }

        const logs = await db.logModel.findAll({
            where: whereClause,
            order: [['Createtime', 'DESC']]
        });
        res.status(200).json(logs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetLogs(req, res, next) {
    try {
        const logs = await db.logModel.findAll()
        res.status(200).json(logs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddLog(req, res, next) {
    try {
        await db.logModel.create({
            ...req.body,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        });

        res.status(200).json({ res: "success" });
    } catch (err) {
        console.error("Log kayıt hatası:", err.message);
        res.status(200).json({ res: "log_failed" });
    }
}

async function GetUsagecountbyUserMontly(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.query

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Logs.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Logs.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Logs'), req.language))
        }

        const logs = await db.logModel.findAll({
            attributes: [
                'UserID',
                [Sequelize.fn('COUNT', Sequelize.col('UserID')), 'UsageCount']
            ],
            group: ['UserID'],
            order: [['UserID', 'ASC']],
            where: {
                Createtime: {
                    [Sequelize.Op.between]: [Startdate, Enddate],
                },
            },
        });
        res.status(200).json(logs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetProcessCount(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.query

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Logs.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Logs.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Logs'), req.language))
        }

        const logs = await db.logModel.findAll({
            attributes: [
                'UserID',
                'Requesttype',
                [Sequelize.fn('COUNT', Sequelize.col('UserID')), 'Count']
            ],
            group: ['UserID', 'Requesttype'],
            order: [['UserID', 'ASC']],
            where: {
                Createtime: {
                    [Sequelize.Op.between]: [Startdate, Enddate],
                },
            },
        });
        res.status(200).json(logs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetServiceUsageCount(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.query

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Logs.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Logs.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Logs'), req.language))
        }

        const logs = await db.logModel.findAll({
            attributes: [
                'Service',
                'Requesttype',
                [Sequelize.fn('COUNT', Sequelize.col('Service')), 'Count']
            ],
            group: ['Service', 'Requesttype'],
            order: [['Service', 'ASC']],
            where: {
                Createtime: {
                    [Sequelize.Op.between]: [Startdate, Enddate],
                },
            },
        });
        res.status(200).json(logs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetServiceUsageCountDaily(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.query

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Logs.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Logs.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Logs'), req.language))
        }

        const logs = await db.logModel.findAll({
            attributes: [
                'Service',
                'Requesttype',
                [Sequelize.fn('COUNT', Sequelize.col('Service')), 'Count']
            ],
            group: ['Service', 'Requesttype'],
            order: [['Service', 'ASC']],
            where: {
                Createtime: {
                    [Sequelize.Op.between]: [Startdate, Enddate],
                },
            },
        });
        res.status(200).json(logs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetLogByUser(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.query

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Logs.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Logs.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Logs'), req.language))
        }

        const logs = await db.logModel.findAll({
            attributes: [
                'UserID',
                [Sequelize.fn('DATE', Sequelize.col('Createtime')), 'LogDate'],
                [Sequelize.fn('COUNT', Sequelize.col('UserID')), 'Count']
            ],
            group: ['LogDate', 'UserID'],
            where: {
                Createtime: {
                    [Sequelize.Op.between]: [new Date(Startdate), new Date(Enddate)],
                },
            },
        });

        const groupedLogs = logs.reduce((acc, log) => {
            const dateKey = new Date(log.LogDate).toLocaleDateString('tr');
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push({
                UserID: log.UserID,
                Count: log.Count,
            });
            return acc;
        }, {});

        const resArr = Object.keys(groupedLogs).map(date => ({
            key: date,
            value: groupedLogs[date],
        }));

        res.status(200).json(resArr)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function ConsumeLogs() {
    const { channel, q } = await initApproveMessageService('serviceLog', 'Log', 'Log');
    let logBuffer = [];
    const BULK_SIZE = 100;
    const FLUSH_INTERVAL = 5000;

    const flushLogs = async () => {
        if (logBuffer.length === 0) return;
        const currentBatch = [...logBuffer];
        logBuffer = [];
        try {
            await db.logModel.bulkCreate(currentBatch.map(b => ({
                ...b.payload,
                Createduser: "System",
                Createtime: new Date(),
                Isactive: true
            })));

            console.log(`İşlem başarılı: ${currentBatch.length} log oluşturuldu.`);
            currentBatch.forEach(b => channel.ack(b.msg));
        } catch (error) {
            console.error('Bulk log hatası:', error);
            currentBatch.forEach(b => channel.nack(b.msg, false, true));
        }
    };

    setInterval(flushLogs, FLUSH_INTERVAL);

    channel.consume(q.queue, async (msg) => {
        if (msg) {
            const payload = JSON.parse(msg.content.toString());
            logBuffer.push({ msg, payload });

            if (logBuffer.length >= BULK_SIZE) {
                await flushLogs();
            }
        }
    });
}

module.exports = {
    ConsumeLogs,
    GetLogsByQuerry,
    GetLogs,
    AddLog,
    GetUsagecountbyUserMontly,
    GetProcessCount,
    GetServiceUsageCount,
    GetServiceUsageCountDaily,
    GetLogByUser
}