const { ConsumeVisitRequests } = require("../Controllers/Visit-controller");

const startConsumeServices = () => {
    ConsumeVisitRequests()
}

module.exports = { startConsumeServices };
