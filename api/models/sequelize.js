const { Sequelize } = require("sequelize")
const config = require("config")
// const dbConfig = config.get("dbConfig")
const dbConfig = {
  host:"localhost",
  database: "smart_farm",
  user:"root",
  password:"",
  dialect:"mysql"
}

module.exports = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect
})