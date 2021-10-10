const pg = require('pg');
//const credentials = require('./credentials');

 
var config = {
    host: "ec2-44-199-26-122.compute-1.amazonaws.com",
    user: "vkeonldoimljev",
    database: "daqom94cuir0e9",
    password: "527ca61420721afe51c4397c42fcb249628d8fcb692d6b82bfb7e18f9f344dfd",
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