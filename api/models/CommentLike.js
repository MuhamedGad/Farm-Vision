const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")
const Comment = require("./Comment")

const CommentLike = sequelize.define('CommentLike', {
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

User.belongsToMany(Comment, { through: CommentLike });
Comment.belongsToMany(User, { through: CommentLike });

(async () => {
    await CommentLike.sync(/* {alter:true} */);
})();

module.exports = CommentLike