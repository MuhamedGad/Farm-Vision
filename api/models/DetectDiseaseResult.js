const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const ModelsImage = require("./ModelsImage")

const DetectDiseaseResult = sequelize.define('DetectDiseaseResult', {
    diseaseType:{
        type:DataTypes.STRING,
        allowNull:false
    },
});

ModelsImage.hasMany(DetectDiseaseResult, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
DetectDiseaseResult.belongsTo(ModelsImage);

(async () => {
    await DetectDiseaseResult.sync(/* {alter:true} */);
})();

module.exports = DetectDiseaseResult