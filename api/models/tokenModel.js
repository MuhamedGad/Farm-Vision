const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./userModel")

const Token = sequelize.define('Token', {
    token: {
        type: DataTypes.STRING,
        allowNull:false,
        unique: true
    }
},{
    // Other model options go here
})

// Relation Between User and Token
User.hasMany(Token, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Token.belongsTo(User);

(async () => {
    await Token.sync()
})()
module.exports = Token