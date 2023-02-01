const bottleneck = require('bottleneck');
const { get, result } = require('lodash');
const getJson = require('./getJson.js');
const { promisequery } = require('./sql_init.js');
const limiter = new bottleneck({
    reservoir: 5, // initial value
    reservoirRefreshAmount: 5,
    reservoirRefreshInterval: 2 * 1000,
    maxConcurrent: 1,
    minTime: 3000,
    trackDoneStatus: true
});

async function autoTriggerCannon() {
    //await new Promise((resolve) => setTimeout(resolve, 100));
    wrap();
    wrap();
}


async function test1() {
    console.log(await getJson(ex));
}

let ex = 'https://fapi.binance.com/fapi/v1/exchangeInfo';
let wrapGetJson = limiter.wrap(getJson);
const exarr = [
    ['https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=1567872000000&limit=1500',
        'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=1567962000000&limit=1500',
        'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=1568052000000&limit=1500'],

    ['https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1m&startTime=1567872000000&limit=1500',
        'https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1m&startTime=1567962000000&limit=1500',
        'https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1m&startTime=1568052000000&limit=1500',]
]

async function aa() {
    for (let k = 0; k < exarr.length; k++) {
    }


    for (let i = 0; i < i.length; i++) {
        let result = await wrapGetJson(d[i]);
        console.log(result);
    }
    return;
}

async function bb() {
    await Promise.all(exarr[0].map(async i => {
        console.log(await wrapGetJson(i));
    }))
}

async function cc() {
    await Promise.all(exarr.map(async k => {
        await Promise.all(k.map(async i => {
            console.log(await wrapGetJson(i));
        }))
    }))
    console.log('done time' + " ---- " + (new Date().toLocaleString()) + " ---- ")
}


//aa();
//bb();
cc();