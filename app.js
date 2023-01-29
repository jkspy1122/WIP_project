const pluginObj = require('./exchangeTickerChecker.js');
const exchangeTickerChecker = pluginObj.exchangeTickerChecker;
const loadCurrentTickers = pluginObj.loadCurrentTickers;

loadCurrentTickers();
setInterval(exchangeTickerChecker,5000);