const express = require('express');
const app = express();
const i18next = require('./i18n');
const middleware = require('i18next-http-middleware');
const { JsonParser, UrlEncodeParser } = require('./Utilities/BodyParserConfig');

require("./Middlewares/Databaseconnector")()
  .then(() => {
    const swaggerUI = require('swagger-ui-express');
    const swaggerSpec = require('./Middlewares/SwaggerEnabler');
    const cors = require('cors');
    const bodyParser = require('body-parser')
    const session = require('express-session')
    const router = require('xpress-router')
    const routes = require('./Routes')
    const errorHandlers = require('./Middlewares/Errorhandlers')
    const authorizationChecker = require('./Middlewares/Authorizationchecker');
    const reqbodyhelper = require("./Middlewares/Reqbodyhelper")
    const languageHelper = require('./Middlewares/LanguageHelper')
    const databaseconnectionchecker = require('./Middlewares/Databaseconnectionchecker')
    const { crossDomainEnabler, getCorsOptions, getSessionOption, CreateApp } = require('./Middlewares/AppOptions');

    app.use(cors(getCorsOptions()))
    app.use(express.static('./dist'))
    app.set('view engine', 'pug')
    app.use(session(getSessionOption(session)))
    app.use(JsonParser);
    app.use(UrlEncodeParser);
    app.use(middleware.handle(i18next));
    app.use(languageHelper)
    app.use(crossDomainEnabler)
    app.use(databaseconnectionchecker)
    app.use(authorizationChecker)
    app.use(reqbodyhelper)
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

    app.disable('etag');
    app.disable('x-powered-by');

    router(app, routes, { controllerDirectory: `${process.cwd()}/src/Controllers/permission-checkers/`, controllerFileSuffix: '-permissioncheckers.js', logRoutesList: false })
    router(app, routes, { controllerDirectory: `${process.cwd()}/src/Controllers/`, controllerFileSuffix: '-controller.js', logRoutesList: false })

    errorHandlers.init(app)

    CreateApp(app)

    module.exports = app
  })
  .catch((error) => {
    console.log('error: ', error);
    console.log("Closing App")
    process.exit(500)
  })




