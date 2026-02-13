const { ConsumeNotifications } = require("../Controllers/Usernotification-controller");

const startConsumeServices = () => {
    ConsumeNotifications().catch(err => console.error('RabbitMQ Service Notification Consumer Error:', err));
}

module.exports = { startConsumeServices };
