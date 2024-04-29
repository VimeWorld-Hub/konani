const mysql = require('mysql2');
const config = require('../config')

const connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    database: config.mysql.database,
    password: config.mysql.password,
})

connection.query("SET SESSION wait_timeout = 604800")

async function execute(query, params = []) {
    return await new Promise((resolve, reject) => {
        connection.query(
            query,
            params,
            function(err, results) {
                if(err) return reject(err.stack);
                resolve(results);
            }
        )
    })
}

module.exports = { execute }