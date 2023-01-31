const { runInContext } = require('lodash');
const _ = require('lodash');
const log = console.log;
//import mysql2 connector profiles from sql_init.js
const sql_initObj = require('./sql_init.js');
const pool = sql_initObj.pool;
const promisequery = sql_initObj.promisequery;
const tickers = ['BTCUSDT','ETHUSDT','APTUSDT'];
const config = {
  /////////////////////////////////////////////////////////////////////////
  symbolArray: tickers,
  defaultFromTS:'09/08/2019 00:00:00',//Format - mm/dd/yyyy hh:mm:ss;
  toTS:'1/31/2023 23:59:59',//Format - mm/dd/yyyy hh:mm:ss;
  ///////////////////////////////////////////////////////////////////////////
  tfw:{
    '1m':1*60*1000,
    '3m':3*60*1000,
    '5m':5*60*1000,
    '15m':15*60*1000,
    '30m':30*60*1000,
    '1h':1*60*60*1000,
    '2h':2*60*60*1000,
    '4h':4*60*60*1000,
    '8h':8*60*60*1000,
    '12h':12*60*60*1000,
    '1d':1*24*60*60*1000,
    '3d':3*24*60*60*1000,
    '1w':7*24*60*60*1000,
    '1M':30*24*60*60*1000,
  },
  async getPrameters(intervalInput){
    //sql query for 2 nd latest records of 'fromdate' from table btcusdt with interval = 'yourInterval'
    //let sql = `SELECT \`open_time\`,\`interval\` FROM BTCUSDT WHERE \`interval\` = ${intervalInput} ORDER BY \`open_time\` DESC LIMIT 3`
    let fromTSfromDb = await promisequery(`SELECT \`open_time\`,\`interval\` FROM BTCUSDT WHERE \`interval\` = \'${intervalInput}\' ORDER BY \`open_time\` DESC LIMIT 3`);
    log(fromTSfromDb);
    if (fromTSfromDb.length) {
      return {
        symbolArray: this.symbolArray,
        timeframe: intervalInput,
        fromTS: fromTSfromDb[1].open_time,
        toTS: new Date(this.toTS).getTime(),
        tfw: this.tfw
      }
    }
    log(this.defaultFromTS);
    //fromTs check if value doesn't exits -> default value asign to '09/08/2019 00:00:00' and don't forget to convert it to unixtimestamp!
    return {  symbolArray:this.symbolArray,
              timeframe:intervalInput,
              fromTS:new Date(this.defaultFromTS).getTime(),
              toTS:new Date(this.toTS).getTime(),
              tfw:this.tfw}
  }
}

const getReqArray = ({ symbolArray, fromTS, toTS, timeframe, tfw }) => {
    return _.times(symbolArray.length, (i) => {
        const symbol = symbolArray[i];
        const barw = tfw[timeframe]; //將barw assign一個值=tfw物件裡key=timeframe變數的value，例子中key是'1m',對應的value是1*60*1000
        const n = Math.ceil((toTS - fromTS) / (1500 * barw));
        if (n <=1 ) {
          const limits = Math.ceil((toTS - fromTS) / barw);
          return `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframe}&startTime=${fromTS}&limit=${limits}`
        }
        else 
        return _.times(n, (i) => {
            const startTS = fromTS + i * 1500 * barw;
            return `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframe}&startTime=${startTS}&limit=1500`;
        })
    })

}


//config.getPrameters會輸出一個物件，內含symbol,timeframe,fromTS,toTS,fileName,tfw(物件)
//可定一個物件來存放轉出的parameters
//getReq可將gerPrameters得到的物件，當作參數傳入進行處理
async function run() {
  await log(getReqArray(await config.getPrameters('1m'))); 
}


run();