const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")
const Feature = require("./Feature")

const UserFeatures = sequelize.define('UserFeatures', {
    UserId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    FeatureId: {
        type: DataTypes.INTEGER,
        references: {
            model: Feature,
            key: 'id'
        }
    }
});

User.belongsToMany(Feature, { through: UserFeatures });
Feature.belongsToMany(User, { through: UserFeatures });

(async () => {
    await UserFeatures.sync(/* {alter:true} */);
})();

module.exports = UserFeatures