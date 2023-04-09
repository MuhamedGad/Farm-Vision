const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")

const UserFeatures = sequelize.define('UserFeatures', {
    // Model attributes are defined here
    feature:{
        type:DataTypes.STRING,
        allowNull:false
    }
}, {
    // Other model options go here
});

// Relation Between User and UserFeatures
User.hasMany(UserFeatures, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
UserFeatures.belongsTo(User);

(async () => {
    await UserFeatures.sync(/* {alter:true} */);
})();

module.exports = UserFeatures