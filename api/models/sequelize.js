const { Sequelize } = require("sequelize")
const config = require("config")
const dbConfig = config.get("dbConfig")
module.exports = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect
})