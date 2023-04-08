const { Sequelize } = require("sequelize")
const config = require("config")
// const dbConfig = config.get("dbConfig")
// const dbConfig = {
//   host:"localhost",
//   database: "smart_farm",
//   user:"root",
//   password:"",
//   dialect:"mysql"
// }
const dbConfig = {
  host    : "dpg-cg5lcf4eoogsv90200q0-a.oregon-postgres.render.com",
  user    : "smart_farm",
  password: "HzwOrOrxsYlPfQTKTOxranWnnpuLKFkw",
  database: "smart_farm",
  port    : 5432,
  dialect : "postgres"
}

module.exports = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect
})