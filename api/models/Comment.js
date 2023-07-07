const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")
const Post = require("./Post")

const Comment = sequelize.define('Comment', {
    content:{
        type:DataTypes.STRING(1000),
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
    },
    numberOfDisLikes:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
    },
    points:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
    }
});

User.hasMany(Comment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Comment.belongsTo(User);

Post.hasMany(Comment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Comment.belongsTo(Post);

Comment.hasMany(Comment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Comment.belongsTo(Comment);

(async () => {
    await Comment.sync(/* {alter:true} */);
})();

module.exports = Comment