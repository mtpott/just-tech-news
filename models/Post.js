const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

//create our Post model
class Post extends Model {
    static upvote(body, models) {
        //using JS's built-in static keyword to indicate that the upvote method is one that's based on the Post model and not an instance method like we used earlier in the User model.
        //with the upvote method, we'll pass in the value of req.body(as body) and an object of the models (as models) as parameters.
        return models.Vote.create({
            user_id: body.user_id,
            post_id: body.post_id
        }).then(() =>{
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    'id',
                    'post_url',
                    'title',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                        'vote_count'
                    ]
                ]
            });
        });
    }
}

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