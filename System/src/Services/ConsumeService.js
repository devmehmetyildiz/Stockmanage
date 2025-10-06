
const { ConsumeApprovalRequests } = require('../Controllers/Approvalrequest-controller');

const startConsumeServices = () => {
    ConsumeApprovalRequests().catch(err => console.error('RabbitMQ Consumer Error:', err));
}

module.exports = { startConsumeServices };
