var speaker = require('./speaker.js');
var exec = require('child_process').exec;

var speak = function(content){
    var convertedContent = content.replace(/\s/g, ",");
    var ttsCommand = "cd /home/root && ./ttsdemo " + convertedContent;
    exec(ttsCommand, function(error, stdout, stderr) {
        console.log(stdout);
        console.log(error);
        console.log(stderr);
        speaker.playWav("tts_sample.wav");
    });
};

module.exports = {
    speak: speak
};