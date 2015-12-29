var exec = require('child_process').exec;

var messageQueue = [];
var isPlaying = false;

var playWav = function(filename){
    messageQueue.push(filename);
    if(!isPlaying){
        doPlay();
    }
}

var getIsPlaying = function(){
    return isPlaying;
};

var doPlay = function(){
    if(messageQueue.length <= 0){
        isPlaying = false;
        return;
    }
    isPlaying = true;
    filename = messageQueue.shift();
    var audioPath = "/home/root/"+filename;
    var audioCommand = "gst-launch-1.0 filesrc location= "+audioPath+" ! wavparse ! pulsesink";
    exec(audioCommand, function(error, stdout, stderr) {
        if(stderr){
            console.log('stderr: ', stderr);
        }
        if (error !== null) {
            console.log('exec error: ', error);
        }
        doPlay();
    });
}

module.exports = {
    playWav: playWav,
    getIsPlaying: getIsPlaying
}