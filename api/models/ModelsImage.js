const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")

const ModelsImage = sequelize.define('ModelsImage', {
    image:{
        type:DataTypes.STRING,
        allowNull:false
    },
    type:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

User.hasMany(ModelsImage, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
ModelsImage.belongsTo(User);

(async () => {
    await ModelsImage.sync(/* {alter:true} */);
})();

module.exports = ModelsImage