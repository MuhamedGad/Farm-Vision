const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const Post = require("./Post")

const PostImage = sequelize.define('PostImage', {
    image:{
        type:DataTypes.STRING,
        allowNull:true
    }
})

Post.hasMany(PostImage, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
PostImage.belongsTo(Post);

(async () => {
    await PostImage.sync(/* {alter:true} */);
})();

module.exports = PostImage