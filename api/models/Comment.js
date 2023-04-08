const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")
const Post = require("./Post")

const Comment = sequelize.define('Comment', {
    // Model attributes are defined here
    content:{
        type:DataTypes.STRING,
        allowNull:false
    },
    numberOfComments:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
    },
    numberOfLikes:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
    }
}, {
    // Other model options go here
});

// Relation Between User and Comment
User.hasMany(Comment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Comment.belongsTo(User);

// Relation Between Post and Comment
Post.hasMany(Comment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Comment.belongsTo(Post);

// Relation Between Comment and Comment
Comment.hasMany(Comment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Comment.belongsTo(Comment);

// // Like Relation Between User and Comment
// User.belongsToMany(Comment, { through: 'CommentLike' });
// Comment.belongsToMany(User, { through: 'CommentLike' });

(async () => {
    await Comment.sync({alter:true});
})();

module.exports = Comment