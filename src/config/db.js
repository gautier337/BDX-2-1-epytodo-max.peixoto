const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USR,
    password: process.env.ROOT_PASSWORD,
    database: process.env.DATABASE
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.message + ' !');
        return;
    }
    console.log('connected to the database with id ' + connection.threadId + '!');
});

module.exports = connection;
