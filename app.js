const pluginObj = require('./exchangeTickerChecker.js');
const exchangeTickerChecker = pluginObj.exchangeTickerChecker;
const loadCurrentTickers = pluginObj.loadCurrentTickers;

//code for executing the loop of ticker checker
loadCurrentTickers();
setInterval(exchangeTickerChecker,10000);