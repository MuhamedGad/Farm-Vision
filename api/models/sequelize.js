const { Sequelize } = require("sequelize")
const config = require("config")
const dbConfig = config.get("dbConfig")
// let dbConfig= {
//   host    : "localhost",
//   user    : "root",
//   password: "",
//   database: "farmVision",
//   port    : "",
//   dialect : "mysql"
// }
module.exports = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect
})