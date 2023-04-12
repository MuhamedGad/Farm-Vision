const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")

const Tag = sequelize.define('Tag', {
    tag:{
        type:DataTypes.STRING,
        allowNull:false,
        unique: true
    },
    describtion:{
        type:DataTypes.STRING,
        allowNull:false
    },
    numberOfPosts:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue: 0
    }
});

User.hasMany(Tag)
Tag.belongsTo(User);

(async () => {
    await Tag.sync(/* {alter:true} */);
})();

module.exports = Tag