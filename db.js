/** Database for lunchly */

const { Client } = require("pg");

let DB_URI;

const { user, password } = require('./config')


// we set process.env.NODE_ENV = 'test' in our test file
// so when we run our test Node will know which database to use
if (process.env.NODE_ENV === 'test') {
    DB_URI = `postgresql://${user}:${password}@localhost:5432/lunchly_test`
} else {
    DB_URI = `postgresql://${user}:${password}@localhost:5432/lunchly`
}
// this way tell pg which database to use
let db = new Client({
    connectionString: DB_URI
})

db.connect();

module.exports = db;
