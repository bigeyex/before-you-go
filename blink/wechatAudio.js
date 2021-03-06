var exec = require('child_process').exec;
var request = require('request');

var lastWechatText;

var setLastWechatText = function(text){
    lastWechatText = text;
}

var getLastWechatText = function(){
    console.log("get"+lastWechatText);
    return lastWechatText;
}

var init = function(){
    setInterval(function(){
        request('http://121.41.62.45/wechat/wetext.txt', function(error, response, body) {
            setLastWechatText(body);
            console.log("wechatText:"+lastWechatText);
        });
    }, 5000);
}

var playWechat = function(callback){
    var audioCommand = "/home/root/play.sh";
    exec(audioCommand, function(error, stdout, stderr) {
        if(stderr){
            console.log('stderr: ', stderr);
        }
        if (error !== null) {
            console.log('exec error: ', error);
        }
        callback();
    });
}



module.exports = {
    init: init,
    play: playWechat,
    lastWechatText: lastWechatText,
    getLastWechatText: getLastWechatText
}