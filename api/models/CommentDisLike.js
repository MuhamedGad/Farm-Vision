const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")
const Comment = require("./Comment")

const CommentDisLike = sequelize.define('CommentDisLike', {
    UserId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    CommentId: {
        type: DataTypes.INTEGER,
        references: {
            model: Comment,
            key: 'id'
        }
    }
});

User.belongsToMany(Comment, { through: CommentDisLike });
Comment.belongsToMany(User, { through: CommentDisLike });

(async () => {
    await CommentDisLike.sync({alter:true});
})();

module.exports = CommentDisLike