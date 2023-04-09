const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const Post = require("./Post")

const PostTags = sequelize.define('PostTags', {
    // Model attributes are defined here
    tag:{
        type:DataTypes.STRING,
        allowNull:false
    }
}, {
    // Other model options go here
});

// Relation Between Post and PostTags
Post.hasMany(PostTags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
PostTags.belongsTo(Post);

(async () => {
    await PostTags.sync(/* {alter:true} */);
})();

module.exports = PostTags