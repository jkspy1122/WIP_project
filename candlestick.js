const getJson = require('./getJson');

async function saveKlinedataToDb(parsedJsonData) {
    if (parsedJsonData === null) {
        console.log("You need to get json data first by calling getJson()");
        return;
    }
    parsedJsonData.map(d => {
        const openTime1 = d[0];
        interval = '1m';
        open = d[1];
        high = d[2];
        low = d[3];
        close = d[4];
        volume = d[5];
        closeTime = d[6];
        quoteAssetVolume = d[7];
        numbersOfTrades = d[8];
        takerBuyBaseAssetVolume = d[9];
        takerBuyQuoteAssetVolume = d[10];
        let sql = "INSERT INTO BTCUSDT (`open_time`,`interval`,`open`,`high`,`low`,`close`,`volume`,`close_time`,`quote_asset_volume`,`number_of_trades`,`taker_buy_base_asset_volume`,`taker_buy_quote_asset_volume`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
        let values = [openTime1, interval, open, high, low, close, volume, closeTime, quoteAssetVolume, numbersOfTrades, takerBuyBaseAssetVolume, takerBuyQuoteAssetVolume];
        pool.query(sql, values, function (err, result) {
            if (err) throw err;
            //console.log(err);
        })
    })
}