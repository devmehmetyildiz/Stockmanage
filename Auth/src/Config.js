require("dotenv").config()

const config = {
  env: process.env.APP_ENV,
  port: process.env.APP_PUBLIC_PORT,
  session: {
    domain: process.env.APP_SESSION_DOMAIN,
    name: process.env.APP_SESSION_NAME,
    secret: process.env.APP_SESSION_SECRET,
    organization: process.env.APP_SESSION_ORGANIZATION,
    corsdomains: parseDomain(process.env.CORS_DOMAINS),
  },
  message: {
    username: process.env.APP_MQ_USERNAME,
    password: process.env.APP_MQ_PASSWORD,
    port: process.env.APP_MQ_PORT,
  },
  database: {
    host: process.env.APP_MYSQL_DB_SERVER,
    user: process.env.APP_MYSQL_DB_USER,
    password: process.env.APP_MYSQL_DB_PASSWORD,
    database: process.env.APP_MYSQL_DB_NAME,
  },
  services: {
    Auth: process.env.AUTH_URL,
    Business: process.env.BUSINESS_URL,
    Setting: process.env.SETTING_URL,
    System: process.env.SYSTEM_URL,
    Userrole: process.env.USERROLE_URL,
    Warehouse: process.env.WAREHOUSE_URL,
    File: process.env.FILE_URL,
    Log: process.env.LOG_URL,
    Gateway: process.env.GATEWAY_URL,
    Web: process.env.WEB_URL
  }
}

function parseDomain(urls) {
  let urlarray = urls.split(',').map(url => {
    return url
  })
  return urlarray
}

module.exports = config