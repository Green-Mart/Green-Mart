
const mysql = require("mysql2")

const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "W1_89717_Tushar",
    password: "manager",
    database: "greenmart"
})

module.exports = pool
