const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./userModel")

const Details = sequelize.define('Details', {
    image: {
        type: DataTypes.STRING,
        allowNull:false
    },
    plantType: {
        type: DataTypes.STRING,
        allowNull:false
    },
    diseas: {
        type: DataTypes.STRING,
        allowNull:false
    },
    confidence: {
        type: DataTypes.FLOAT,
        allowNull:false
    }
})

User.hasMany(Details, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Details.belongsTo(User);

(async () => {
    await Details.sync()
})()
module.exports = Details