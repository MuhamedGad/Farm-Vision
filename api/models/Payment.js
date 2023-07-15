const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")

const Payment = sequelize.define('Payment', {
    price:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    describtion:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

User.hasMany(Payment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Payment.belongsTo(User);

(async () => {
    await Payment.sync({alter:true});
})();

module.exports = Payment