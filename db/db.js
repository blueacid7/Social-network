'use strict'

const Sequelize = require('sequelize');  
var sequelize = new Sequelize('heroku_486cebd7af8aec8', 'b2f592c7c55df8', '67ac6206' , {
    host: 'us-cdbr-iron-east-04.cleardb.net',
    port: 3306,
    dialect: 'mysql',
    define: {
        underscored: true
    }
});
//connection-url in heruku mysql://b2f592c7c55df8:67ac6206@us-cdbr-iron-east-04.cleardb.net/heroku_486cebd7af8aec8?reconnect=true

// Connect all the models/tables in the database to a db object, 
//so everything is accessible via one object
const db = {};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//Models/tables
db.users = require('../models/users.js')(sequelize, Sequelize);  
db.followers = require('../models/followers.js')(sequelize, Sequelize);  
db.posts = require('../models/posts.js')(sequelize, Sequelize);

//Relations

sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));
 
// db.posts.belongsTo(db.users);  
// db.users.hasMany(db.posts);
// db.followers.belongsTo(db.users);
// db.users.hasMany(db.followers);

//functions






module.exports = db;  