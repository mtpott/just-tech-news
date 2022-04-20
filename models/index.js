const Post = require('./Post');
const User = require('./User');

//create associations
//this association creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model
User.hasMany(Post, {
    foreignKey: 'user_id'
});

//defining the relationship of the Post model to the User. the constraint imposed here is that a post can belong to one user, but not many users.
Post.belongsTo(User, {
    foreignKey: 'user_id',
});

module.exports = { User, Post };