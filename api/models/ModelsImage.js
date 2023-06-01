const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")

const ModelsImage = sequelize.define('ModelsImage', {
    image:{
        type:DataTypes.STRING,
        allowNull:false
    },
    resultImage:{
        type:DataTypes.STRING
    },
    type:{
        type:DataTypes.STRING
    }
});

User.hasMany(ModelsImage, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
ModelsImage.belongsTo(User);

(async () => {
    await ModelsImage.sync({alter:true});
})();

module.exports = ModelsImage