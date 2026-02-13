const { ConsumeLogs } = require("../Controllers/Log-controller");

const startConsumeServices = () => {
    ConsumeLogs().catch(err => console.error('RabbitMQ Service Log Consumer Error:', err));
}

module.exports = { startConsumeServices };
