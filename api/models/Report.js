const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")

const Report = sequelize.define('Report', {
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    describtion:{
        type:DataTypes.STRING(1000),
        allowNull:false
    },
    type:{
        type: DataTypes.ENUM("feedback", "error"),
        allowNull: false
    }
});

User.hasMany(Report, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Report.belongsTo(User);

(async () => {
    await Report.sync({alter:true});
})();

module.exports = Report