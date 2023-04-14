const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const Post = require("./Post")
const Tag = require("./Tag")

const PostTags = sequelize.define('PostTags', {
    PostId: {
        type: DataTypes.INTEGER,
        references: {
            model: Post,
            key: 'id'
        }
    },
    TagId: {
        type: DataTypes.INTEGER,
        references: {
            model: Tag,
            key: 'id'
        }
    }
});

Post.belongsToMany(Tag, { through: PostTags });
Tag.belongsToMany(Post, { through: PostTags });

(async () => {
    await PostTags.sync({alter:true});
})();

module.exports = PostTags