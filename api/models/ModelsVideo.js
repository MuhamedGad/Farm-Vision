const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")

const ModelsVideo = sequelize.define('ModelsVideo', {
    video:{
        type:DataTypes.STRING,
        allowNull:false
    },
    type:{
        type:DataTypes.STRING,
        allowNull:false
    },
    number:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
});

User.hasMany(ModelsVideo, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
ModelsVideo.belongsTo(User);

(async () => {
    await ModelsVideo.sync(/* {alter:true} */);
})();

module.exports = ModelsVideo