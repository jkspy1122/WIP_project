//Json fetcher with promise
async function getJson(endpoint) {
    let success = false;
    let retryCounts = 0;
    let maxRetries = 4;
    let timeLag = 5000
    let temp = null;
    while(!success && retryCounts <= maxRetries) {
        try {
            temp = await (await fetch(endpoint)).json();
            success = true;
        } catch(e) {
            console.log('----An Error occured while fetching json data from remote host. Retry after 5 seconds. Retry Counts: ' + retryCounts + " ---- " + (new Date().toLocaleString()) + " ---- ")
            await new Promise(resolve => setTimeout(resolve, timeLag)); //add timelag
            retryCounts++; //try 5 times no success then give up -> 無條件 return temp -> null
        }
    }
    return temp;
}

module.exports = getJson;