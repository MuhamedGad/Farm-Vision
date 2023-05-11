const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")

const EmailsDeleted = sequelize.define('EmailsDeleted', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

(async () => {
    await EmailsDeleted.sync(/* {alter:true} */);
})();

module.exports = EmailsDeleted