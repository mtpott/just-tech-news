//imported Model object and DataTypes class from Sequelize
    //this Model class is what we create our own models from using the extends keyword so User inherits all of the functionality that the Model class does
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//create our User model
class User extends Model {
    //set up method to run on instance data (per user) to check password
    //checkPassword is an instance method that takes in the plaintext password retrieved from the client request at req.body.email and compares that with the hashed password
    checkPassword(loginPw) {
        //using the keyword 'this', we can access this user's properties, including the password, which was stored as a hashed string. 
        return bcrypt.compareSync(loginPw, this.password);
    }
}

//use the .init() method to initialize the model's data and configuration, passing in two objects as arguments
    //first object: defines the columns and data types for those columns
    //second object: configures certain options for the table


//define table columns and configuration
User.init(
    {
        //define an id column
        id: {
            //use the special Sequelize DataTypes object to provide what type of data it is
            type: DataTypes.INTEGER,
            //this is the equivalent of SQL's 'NOT NULL option
            allowNull: false,
            //instruct that this is the Primary Key
            primaryKey: true,
            //turn on auto increment
            autoIncrement: true
        },
        //define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //there cannot be any duplicate email values in this table
            unique: true,
            //if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        //define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //this means the password must be at least four characters long
                len: [4]
            }
        }
    },
    {
        hooks: {
            //set up beforeCreate lifecycle 'hook' functionality
            async beforeCreate(newUserData) {
                //async is used as a prefix to the function that contains the asynchronous function. await can be used to prefix the async function, which will assign the value from the response to the newUserData's password property. newUserData is then return to the application with the hashed password
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                    return newUserData;
                },
                    //set up beforeUpdate lifecycle 'hook' functionality
                    async beforeUpdate(updatedUserData) {
                        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                        return updatedUserData;
                    }
            },
        //TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration)

        //pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        //don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        //don't pluralize name of database table
        freezeTableName: true,
        //use underscores instead of camel-casing
        underscored: true,
        //make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;