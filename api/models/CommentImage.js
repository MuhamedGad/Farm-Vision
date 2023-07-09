const { DataTypes } = require("sequelize")
const sequelize = require("./sequelize")
const Comment = require("./Comment")

const CommentImage = sequelize.define('CommentImage', {
    image:{
        type:DataTypes.STRING,
        allowNull:true
    }
})

Comment.hasMany(CommentImage, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
CommentImage.belongsTo(Comment);

(async () => {
    await CommentImage.sync({alter:true});
})();

module.exports = CommentImage