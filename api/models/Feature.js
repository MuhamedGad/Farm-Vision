const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")

const Feature = sequelize.define('Feature', {
    feature:{
        type:DataTypes.STRING,
        allowNull:false,
        unique: true
    },
    describtion:{
        type:DataTypes.STRING,
        allowNull:false
    },
    price:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    type:{
        type: DataTypes.ENUM("video", "image", "other"),
        allowNull: false
    }
});

User.hasMany(Feature)
Feature.belongsTo(User);

(async () => {
    await Feature.sync({alter:true});
})();

module.exports = Feature