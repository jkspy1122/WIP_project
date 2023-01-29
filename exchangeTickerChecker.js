//import mysql2 connector profiles from sql_init.js
const sql_initObj = require('./sql_init.js');
const pool = sql_initObj.pool;
const promisequery = sql_initObj.promisequery;
const getJson = require('./getJson.js');
const exInfoEndpoint1 = 'https://fapi.binance.com/fapi/v1/exchangeInfo';

const deListedTicker = [];
const previousTickers = [];

//Load deListedTicker and previousTickers from database
async function loadCurrentTickers() {
    if (!deListedTicker.length) {
        let data = await promisequery('SELECT symbol,listingStatus FROM cryptodata.exchangeTickers');
        for (let i = 0; i < data.length; i++) {
            if (data[i].listingStatus === "SETTLING") {
                deListedTicker.push(data[i].symbol);
            }
        }
        console.log('Init process... loading deListedTicker from database.... ');
        console.log(deListedTicker);
        console.log('---------------------------------------------------------------');
    }
    if (!previousTickers.length) {
        let data = await promisequery('SELECT symbol,listingStatus FROM cryptodata.exchangeTickers');
        for (let i = 0; i < data.length; i++) {
            if (data[i].listingStatus === "TRADING") {
                previousTickers.push(data[i].symbol);
            }
        }
        console.log('Init process... loading previousTickers from database.... ');
        console.log(previousTickers);
        console.log('---------------------------------------------------------------');
    }
    //Work In Progress...Fetch Data from exchange and compare
}

async function tickersDbRecordsUpdater(parsedJsonData) {
    //check if parsed json data is passed.
    if (parsedJsonData === null) {
        console.log("You need to get json data first by calling getJson()");
        return;
    }
    //conpare every symbol with previousTickers and insert new tickers into DATABASE and previousTickers
    console.log('----' + (new Date().toLocaleString()) + '----');
    for (var i = 0 ; i < parsedJsonData.symbols.length; i++) {
        if (parsedJsonData.symbols[i].contractType === "PERPETUAL" && parsedJsonData.symbols[i].status === "TRADING" && !previousTickers.includes(parsedJsonData.symbols[i].symbol)) {
            previousTickers.push(parsedJsonData.symbols[i].symbol);
            let symbol = parsedJsonData.symbols[i].symbol;
            let baseAsset = parsedJsonData.symbols[i].baseAsset;
            let quoteAsset = parsedJsonData.symbols[i].quoteAsset;
            let status = parsedJsonData.symbols[i].status;
            let sql = "INSERT INTO exchangeTickers (symbol,baseAsset,quoteAsset,listingStatus) VALUES (?,?,?,?)";
            let values = [symbol, baseAsset, quoteAsset, status];
            pool.query(sql, values, function (err, result) {
                if (err) throw err;
                console.log('found 1 New-listing ticker. Database records updated. (ticker: ' + symbol + ')');
            });
        }
    }
    //check all tickers with status='SETTLING'. Ignored if already exist in deListedTicker
    //Mark status='SETTLING' for newly found de-listed ticker from Database and remove de-listed symbol from previousTickers and pop from previousTickers
    for (var i = 0 ; i < parsedJsonData.symbols.length; i++) {
        if (parsedJsonData.symbols[i].contractType === "PERPETUAL" && parsedJsonData.symbols[i].status === "SETTLING" && !deListedTicker.includes(parsedJsonData.symbols[i].symbol)) {
            deListedTicker.push(parsedJsonData.symbols[i].symbol);
            previousTickers.splice(previousTickers.indexOf(parsedJsonData.symbols[i].symbol),1);
            let symbol = parsedJsonData.symbols[i].symbol;
            let status = parsedJsonData.symbols[i].status;
            //Sql Prepared Statement
            let sql = `UPDATE exchangetickers SET listingStatus= '${status}' WHERE symbol = '${symbol}'`;
            pool.query(sql, function (err, result) {
                if (err) throw err;
            });
            console.log('found 1 de-listed ticker. Database records updated. (ticker: ' + symbol + ')');
        }
    }
}

async function exchangeTickerChecker() {
    let temp = await getJson(exInfoEndpoint1);
    tickersDbRecordsUpdater(temp);
}

module.exports = {
    loadCurrentTickers,
    exchangeTickerChecker,
}