const config = require("../Config");
const bodyParser = require('body-parser')

async function JsonParser(req, res, next) {
    if (req.headers['x-proxied-by'] === config.session.secret) {
        return next();
    }
    bodyParser.json({ limit: '50mb' })(req, res, next);
}

async function UrlEncodeParser(req, res, next) {
    if (req.headers['x-proxied-by'] === config.session.secret) {
        return next();
    }
    bodyParser.urlencoded({ extended: true, limit: '50mb' })(req, res, next);
}

module.exports = {
    JsonParser,
    UrlEncodeParser,
}