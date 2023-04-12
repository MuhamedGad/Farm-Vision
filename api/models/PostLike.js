const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")
const Post = require("./Post")

const PostLike = sequelize.define('PostLike', {
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

User.belongsToMany(Post, { through: PostLike });
Post.belongsToMany(User, { through: PostLike });

(async () => {
    await PostLike.sync(/* {alter:true} */);
})();

module.exports = PostLike