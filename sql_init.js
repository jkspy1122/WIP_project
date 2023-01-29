//load variables from dotenv
require('dotenv').config()

//import mysql connector for mariaDB
const mysql = require('mysql2');

//create and init connection pool
const pool  = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password : process.env.password,
    database : process.env.database,
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0
});

//
//用promise封裝過的query，promise()方法只能接query不能在query後面塞函數，只能把callback函數放在then裡面
//我這裡封裝的promisequery callback用then，只回傳收到的sql server回傳結果
//需注意，因promise方法回傳的results的預設值是內含meta資料，例如column definition之類的
//封裝前用results[0]，只回傳物件陣列裡的第一個物件
//使用方法： 
//let data = await promisequery('SELECT symbol,listingStatus FROM cryptodata.exchangeTickers')
async function promisequery(sql) {
    return new Promise((resolve, reject) => {
        pool.promise().query(sql).then((results) => {
            resolve(results[0]);
        }).catch((err) => {
            console.log(err);
        });
    });
}

module.exports.pool = pool;
module.exports.promisequery = promisequery;