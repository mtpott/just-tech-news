const Post = require('./Post');
const User = require('./User');
const Vote = require('./Vote');
const Comment = require('./Comment');

//create associations
//this association creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model
User.hasMany(Post, {
    foreignKey: 'user_id'
});

//defining the relationship of the Post model to the User. the constraint imposed here is that a post can belong to one user, but not many users.
Post.belongsTo(User, {
    foreignKey: 'user_id',
});

//belongsToMany() methods--allow both the User and Post models to query each other's information in the context of a vote. if we want to see which users voted on a single post, we can do that. if we want to see which posts a single user voted on, we can see that too. this gives us more capabilities for visualizing the data on the client-side

User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

//we instruct the application that the User and Post models will be connected, but in this case through the Vote model. we state what we want the foreign key to be in Vote, which aligns with the fields we set up in the model. we also stipulate that the name of the Vote model should be displayed as voted_posts when queried on, making it a little more informative.

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

//by creating one-to-many associations directly between the models, we can perform aggregated SQL functions between models. in this case, we'll see a total count of votes for a single post when queried. this would be difficult if we hadn't directly associated the Vote model with the other two.

Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
})

Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Comment, {
    foreignKey: 'user_id'
});

Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Vote, Comment };