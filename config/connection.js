//importing the base Sequelize class and using it to create a new connection to the database
//the new Sequelize() function accepts the database name, MySQL username, and MySQL password (respectively) as parameters, then we also pass configuration settings. once done, export the connection.

//import the Sequelize constructor from the library
const Sequelize = require('sequelize');

//does not need to be saved to a variable; only need to execute when we use connection.js; all of the data in the .env will be made available at process.env<environment-variable-name>
require('dotenv').config();

//create connection to our database, pass in your MySQL information for username and password
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;