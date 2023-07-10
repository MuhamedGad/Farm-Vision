const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")

const ModelsImage = sequelize.define('ModelsImage', {
    // image:{
    //     type:DataTypes.STRING,
    //     allowNull:false
    // },
    // resultImage:{
    //     type:DataTypes.STRING
    // },
    image: {
        type: DataTypes.BLOB("long"),
    },
    resultImage:{
        type: DataTypes.BLOB("long"),
    },
    type:{
        type:DataTypes.STRING
    },
    confidence:{
        type:DataTypes.FLOAT
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