import mysql from 'mysql2/promise'
import config from './config.js'

const connectionOpts = {
    host:'localhost',
    user: 'root',
    port: 3306,
    password: `${config.mysqlPass}`,
    database: 'sisters_db',
}

const mysqlConnection = await mysql.createConnection(connectionOpts)

export default mysqlConnection

