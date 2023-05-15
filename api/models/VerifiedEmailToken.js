const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")

const VerifiedEmailToken = sequelize.define('VerifiedEmailToken', {
    token: {
        type:DataTypes.STRING,
        allowNull:false,
        unique: true
    }
});

User.hasOne(VerifiedEmailToken, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
VerifiedEmailToken.belongsTo(User);

(async () => {
    await VerifiedEmailToken.sync(/* {alter:true} */);
})();

module.exports = VerifiedEmailToken