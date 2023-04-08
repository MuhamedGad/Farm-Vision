const { DataTypes } = require("sequelize")
const sequelize = require("./Sequelize")
const User = require("./User")

const Token = sequelize.define('Token', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    clientName:{
        type:DataTypes.STRING
    },
    clientType:{
        type:DataTypes.STRING
    },
    clientVersion:{
        type:DataTypes.STRING
    },
    clientEngine:{
        type:DataTypes.STRING
    },
    clientEngineVersion:{
        type:DataTypes.STRING
    },
    osName:{
        type:DataTypes.STRING
    },
    osVersion:{
        type:DataTypes.STRING
    },
    osPlatform:{
        type:DataTypes.STRING
    },
    deviceType:{
        type:DataTypes.STRING
    },
    deviceBrand:{
        type:DataTypes.STRING
    },
    deviceModel:{
        type:DataTypes.STRING
    },
    bot:{
        type:DataTypes.STRING
    },
}, {
    // Other model options go here
})

// Relation Between User and Token
User.hasMany(Token, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Token.belongsTo(User);

(async () => {
    await Token.sync({alter:true})
})()

module.exports = Token