const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const User = require("./User")

const Post = sequelize.define('Post', {
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
    },
    points:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
    },
}, {
    // Other model options go here
});

// Relation Between User and Post
User.hasMany(Post, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Post.belongsTo(User);

(async () => {
    await Post.sync(/* {alter:true} */);
})();

module.exports = Post