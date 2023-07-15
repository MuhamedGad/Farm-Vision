const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
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
  image: {
    type: DataTypes.BLOB("long"),
  },
  role: {
    type: DataTypes.ENUM("admin", "superAdmin", "farmer", "engineer"),
    allowNull: false
  },
  premium: {
    type: DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue: false
  },
  haveFreeTrial: {
    type: DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue: true
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  devicesNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 50
  },
  loginDevices: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  workField: {
    type: DataTypes.STRING,
    allowNull: false
  },
  usageTarget: {
    type: DataTypes.STRING,
    allowNull: false
  },
  streetName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastUpdatedUserName: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

(async () => {
  await User.sync(/* { alter: true } */);
})();

module.exports = User