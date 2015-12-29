var request = require('request');


var socket = null;

var lastResult = 0;

var init = function(){
   request('http://www.pm25.in/api/querys/pm2_5.json?city=shenzhen&token=YOUR_KEY_HERE', function(error, response, body) {
      jsonData = JSON.parse(body);
      lastResult = jsonData[0]['PM2_5'];
//      console.log(jsonData);
    });
}

module.exports = {
    init: init,
    lastResult: lastResult
}
