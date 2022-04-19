const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

//create our Post model
class Post extends Model {}

//create fields/columns for Post model
Post.init(
    //defined Post schema
    {
        id: {
            //identified id column as the primary key and set it to auto-increment
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            //define title column as a STRING value
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {
            //ensure that the url is a verified link with isURL = true
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL: true
            }
        },
        user_id: {
            //determines who posts the article. using 'references', we establish the relationship between the post and the user by creating the reference to the User model (specifically the id column that's defined by the key property, which is the primary key). the user_id is conversely defined as the foreign key and will be the matching link
                type: DataTypes.INTEGER,
                references: {
                    model: 'user',
                    key: 'id'
                }
            }
        },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
)

module.exports = Post;