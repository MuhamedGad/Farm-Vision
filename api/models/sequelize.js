const { Sequelize } = require("sequelize")
const config = require("config")
const dbConfig = config.get("dbConfig")
// const dbConfig= {
//   host    : "localhost",
//   user    : "root",
//   password: "",
//   database: "farmVision",
//   port    : "",
//   dialect : "mysql"
// }
// const dbConfig= {
//   host    : "localhost",
//   user    : "postgres",
//   password: "mohamed910",
//   database: "smart_farm",
//   port    : 5432,
//   dialect : "postgres"
// }
module.exports = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect
  }
)