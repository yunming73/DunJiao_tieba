// 定义创建数据库的连接对象
const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'postdb'

    })
    // 抛出数据库连接对象
module.exports = db