const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")

const Payment = sequelize.define('Payment', {
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    price:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    describtion:{
        type:DataTypes.STRING(1000),
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