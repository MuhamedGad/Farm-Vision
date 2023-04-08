const { DataTypes } = require("sequelize")
const sequelize = require("./Sequelize")
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

// Like Relation Between User and Post
User.belongsToMany(Post, { through: 'PostLike' });
Post.belongsToMany(User, { through: 'PostLike' });

(async () => {
    await Post.sync({alter:true});
})();

module.exports = Post