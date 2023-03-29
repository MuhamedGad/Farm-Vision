const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")

const User = sequelize.define('User', {
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "logo.jpg"
  },
  admin: {
    type:DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  phoneNumber:{
    type:DataTypes.STRING,
    allowNull: true
  },
  devicesNumber:{
    type:DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  },
  loginDevices:{
    type:DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  // Other model options go here
});

(async () => {
  await User.sync(/* {alter:true} */);
})();

module.exports = User