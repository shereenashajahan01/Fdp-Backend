const pg = require('pg');
//const credentials = require('./credentials');

 
var config = {
    host: "50.17.102.76",
    user: "postgres",
    database: "fdp_db",
    password: "fdpAdmin",
    port: 5432,
}  
const pool = new pg.Pool(config);
 
pool.on('error', function (err, client) {
     console.error('idle client error', err.message, err.stack);
});
module.exports.pool = pool;
module.exports.query = function (text, values, callback) {
  console.log('query:', text, values);
  return pool.query(text, values, callback);
};
module.exports.connect = function (callback) {
  return pool.connect(callback);
};
