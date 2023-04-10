const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")
const Post = require("./Post")

const PostLike = sequelize.define('PostLike', {
    UserId: {
        type: DataTypes.INTEGER,
        references: {
            model: User, // 'Movies' would also work
            key: 'id'
        }
    },
    PostId: {
        type: DataTypes.INTEGER,
        references: {
            model: Post, // 'Actors' would also work
            key: 'id'
        }
    }
}, {
    // Other model options go here
});

// Like Relation Between User and Post
User.belongsToMany(Post, { through: PostLike });
Post.belongsToMany(User, { through: PostLike });

(async () => {
    await PostLike.sync(/* {alter:true} */);
})();

module.exports = PostLike