var request = require('request');


var socket = null;

var lastUltrasonicResult = 0;

var getLastResult = function(){
    return lastUltrasonicResult;
}

var setLastResult = function(text){
    lastUltrasonicResult = text;
}

var init = function(){
    setInterval(function(){
        request('http://10.40.13.225:9615/ultrasonic', function(error, response, body) {
          setLastResult(body);
          console.log(body);
        });
    }, 1000);
}

module.exports = {
    init: init,
    getLastResult: getLastResult
}
