
const amqp = require('amqplib');
const config = require('../Config');

let channels = {};
let qs = {};

async function initApproveMessageService(_routingKey, serviceName, tableName,) {
    const routingKey = `${_routingKey}.${serviceName}.${tableName}`;
    let channel = channels[routingKey]
    let q = qs[routingKey]
    if (!channel || !q) {
        const connection = await amqp.connect(`amqp://${config.message.username}:${config.message.password}@localhost:${config.message.port}`);
        channel = await connection.createChannel();

        await channel.assertExchange(`${config.session.domain}.channel`, 'topic', { durable: true });

        q = await channel.assertQueue(routingKey, { durable: true });

        await channel.bindQueue(routingKey, `${config.session.domain}.channel`, routingKey);

        console.log("✅ RabbitMQ initialized, queue bound to exchange");
        channels[routingKey] = channel
        qs[routingKey] = q
    }
    return { channel, q };
}

function publishEvent(_routingKey, serviceName, tableName, payload) {
    const routingKey = `${_routingKey}.${serviceName}.${tableName}`;
    initApproveMessageService(routingKey).then(({ channel }) => {
        channel.publish(
            `${config.session.domain}.channel`,
            routingKey,
            Buffer.from(JSON.stringify(payload)),
            { persistent: true }
        );
        console.log("📤 Message published:", routingKey, payload.Record);
    })
}

module.exports = { initApproveMessageService, publishEvent };
