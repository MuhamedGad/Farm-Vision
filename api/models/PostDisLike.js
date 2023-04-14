const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")
const Post = require("./Post")

const PostDisLike = sequelize.define('PostDisLike', {
    UserId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    PostId: {
        type: DataTypes.INTEGER,
        references: {
            model: Post,
            key: 'id'
        }
    }
});

User.belongsToMany(Post, { through: PostDisLike });
Post.belongsToMany(User, { through: PostDisLike });

(async () => {
    await PostDisLike.sync({alter:true});
})();

module.exports = PostDisLike