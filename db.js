const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit : 1000,
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'socail_app'
});

module.exports = pool;

