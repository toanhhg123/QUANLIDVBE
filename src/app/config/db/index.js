const sql = require("mssql/msnodesqlv8");

// thong tin ket noi
var config = {
    user: 'sa',
    password: '123456',
    server: 'localhost',
    database: 'HowKteam',
    driver: 'msnodesqlv8'
};

const conn = new sql.ConnectionPool(config).connect()
    .then(data => data)
module.exports = { conn, sql }